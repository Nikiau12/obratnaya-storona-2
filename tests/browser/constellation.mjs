import assert from "node:assert/strict";

export async function geometry(page) {
  return page.evaluate(() => {
    const root = document.querySelector("[data-room]");
    const rect = root.getBoundingClientRect();
    const boxes = [...root.querySelectorAll("button[data-point]")].map(node => {
      const box = node.getBoundingClientRect();
      return { id: node.dataset.point, x: box.x, y: box.y, right: box.right, bottom: box.bottom };
    });
    const overlaps = [];
    for (let i = 0; i < boxes.length; i++) for (let j = i + 1; j < boxes.length; j++) {
      const a = boxes[i], b = boxes[j];
      if (Math.min(a.right, b.right) - Math.max(a.x, b.x) > 1 && Math.min(a.bottom, b.bottom) - Math.max(a.y, b.y) > 1) overlaps.push([a.id, b.id]);
    }
    const errors = [...root.querySelectorAll("line[data-from]")].map(line => {
      const marker = root.querySelector(`[data-point="${line.dataset.from}"] [class*="pointTarget"] > span`) || root.querySelector(`[data-point="${line.dataset.from}"]`);
      const dot = marker.getBoundingClientRect();
      return Math.hypot(rect.x + Number(line.getAttribute("x1")) / 1000 * rect.width - dot.x - dot.width / 2, rect.y + Number(line.getAttribute("y1")) / 1000 * rect.height - dot.y - dot.height / 2);
    });
    return {
      room: { x: rect.x, y: rect.y, width: rect.width, height: rect.height, bottom: rect.bottom },
      boxes, overlaps, lineError: Math.max(...errors),
      scale: Number(root.dataset.graphScale), x: Number(root.dataset.graphOffsetX), y: Number(root.dataset.graphOffsetY),
      pageScale: visualViewport.scale,
    };
  });
}

export function checkGeometry(value, width, height) {
  assert.equal(value.room.x, 0);
  assert.equal(value.room.width, width);
  assert.ok(Math.abs(value.room.bottom - height) < 2);
  assert.deepEqual(value.overlaps, []);
  assert.ok(value.lineError < 1, "A connection has moved away from its point");
  for (const box of value.boxes) assert.ok(box.x >= 0 && box.y >= value.room.y && box.right <= width && box.bottom <= height, JSON.stringify(box));
  assert.equal(value.pageScale, 1, "The gesture must zoom the map, not the entire webpage");
}

export async function nativePinch(page, width, height) {
  const session = await page.context().newCDPSession(page);
  const initial = await geometry(page);
  const y = initial.room.y + initial.room.height * .37;
  const cx = width / 2, half = Math.min(60, width * .15);
  const font = await page.locator('button[data-point="signal"]').evaluate(node => getComputedStyle(node).fontSize);
  async function send(type, points) {
    await session.send("Input.dispatchTouchEvent", {
      type, touchPoints: points.map(([id, x, y]) => ({ id, x, y, radiusX: 4, radiusY: 4, force: 1 })),
    });
    await page.waitForTimeout(25);
  }
  async function pinch(factor, centerX = cx, centerY = y, initialHalf = half) {
    await send("touchStart", [[1, centerX - initialHalf, centerY], [2, centerX + initialHalf, centerY]]);
    for (let i = 1; i <= 6; i++) {
      const spread = initialHalf * (1 + (factor - 1) * i / 6);
      await send("touchMove", [[1, centerX - spread, centerY], [2, centerX + spread, centerY]]);
    }
    await send("touchEnd", []);
    await page.waitForTimeout(80);
  }
  await pinch(2.8);
  let result = await geometry(page);
  assert.equal(result.scale, 2.4);
  checkGeometry(result, width, height);
  assert.equal(await page.locator('button[data-point="signal"]').evaluate(node => getComputedStyle(node).fontSize), font);
  await send("touchStart", [[1, cx, y]]);
  await send("touchMove", [[1, cx + 35, y + 20]]);
  await send("touchEnd", []);
  await page.waitForTimeout(80);
  result = await geometry(page);
  assert.ok(result.x > 0 && result.y > 0);
  checkGeometry(result, width, height);
  assert.equal(await page.locator("dialog[open]").count(), 0, "Dragging must not open a project");
  await pinch(.2);
  await page.waitForTimeout(280);
  result = await geometry(page);
  assert.equal(result.scale, 1);
  assert.equal(result.x, 0); assert.equal(result.y, 0);
  checkGeometry(result, width, height);
  const label = await page.locator('button[data-point="signal"]').boundingBox();
  const labelX = label.x + label.width / 2, labelY = label.y + label.height / 2;
  await pinch(1.4, labelX + 30, labelY, 30);
  assert.ok((await geometry(page)).scale > 1.3, "A pinch starting on a project label must keep its fingers when pointer capture changes");
  assert.equal(await page.locator("dialog[open]").count(), 0);
  await pinch(.2);
  await page.waitForTimeout(280);
  const drag = await page.locator('button[data-point="signal"]').boundingBox();
  const dragX = drag.x + drag.width / 2, dragY = drag.y + drag.height / 2;
  await send("touchStart", [[1, dragX, dragY]]);
  await send("touchMove", [[1, dragX + 25, dragY + 20]]);
  await send("touchEnd", []);
  assert.equal(await page.locator("dialog[open]").count(), 0, "Dragging a label at base scale must not open its project");
  await page.waitForTimeout(280);
  await session.detach();
}

// WebKit exposes no CDP touch dispatcher. This covers its Pointer Events path;
// the Chromium check above exercises real browser touch/default-action handling.
export async function webkitPointers(page, width, height) {
  const root = page.locator("[data-room]");
  assert.equal(await root.evaluate(node => getComputedStyle(node).touchAction), "none");
  const font = await page.locator('button[data-point="signal"]').evaluate(node => getComputedStyle(node).fontSize);
  await root.evaluate(node => {
    const box = node.getBoundingClientRect(), x = box.width / 2, y = box.y + box.height * .37;
    const send = (type, pointerId, clientX) => node.dispatchEvent(new PointerEvent(type, { pointerId, pointerType: "touch", clientX, clientY: y, bubbles: true, cancelable: true }));
    send("pointerdown", 1, x - 50); send("pointerdown", 2, x + 50);
    send("pointermove", 2, x + 150);
    send("pointerup", 1, x - 50); send("pointerup", 2, x + 150);
  });
  await page.waitForTimeout(100);
  const result = await geometry(page);
  assert.equal(result.scale, 2);
  checkGeometry(result, width, height);
  assert.equal(await page.locator('button[data-point="signal"]').evaluate(node => getComputedStyle(node).fontSize), font);
  await root.evaluate(node => {
    const box = node.getBoundingClientRect(), x = box.width / 2, y = box.y + box.height * .37;
    const send = (type, pointerId, clientX, clientY = y) => node.dispatchEvent(new PointerEvent(type, { pointerId, pointerType: "touch", clientX, clientY, bubbles: true, cancelable: true }));
    send("pointerdown", 1, x); send("pointermove", 1, x + 30, y + 20); send("pointerup", 1, x + 30, y + 20);
  });
  await page.waitForTimeout(100);
  const panned = await geometry(page);
  assert.ok(panned.x > 0 && panned.y > 0);
  checkGeometry(panned, width, height);
  assert.equal(await page.locator("dialog[open]").count(), 0);
  await root.evaluate(node => {
    const box = node.getBoundingClientRect(), x = box.width / 2, y = box.y + box.height * .37;
    const send = (type, pointerId, clientX) => node.dispatchEvent(new PointerEvent(type, { pointerId, pointerType: "touch", clientX, clientY: y, bubbles: true, cancelable: true }));
    send("pointerdown", 1, x - 80); send("pointerdown", 2, x + 80);
    send("pointermove", 1, x - 20); send("pointermove", 2, x + 20);
    send("pointerup", 1, x - 20); send("pointerup", 2, x + 20);
  });
  await page.waitForTimeout(100);
  const reset = await geometry(page);
  assert.equal(reset.scale, 1);
  assert.equal(reset.x, 0); assert.equal(reset.y, 0);
  checkGeometry(reset, width, height);
  await page.waitForTimeout(280);
}
