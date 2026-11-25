import assert from "node:assert/strict";
import { mkdir, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { chromium, webkit } from "playwright";
import { checkCompactScene, checkGeometry, geometry, nativePinch, webkitPointers } from "../tests/browser/constellation.mjs";
import { cartPersistence, storageFallback } from "../tests/browser/storage.mjs";

const baseUrl = (process.env.BASE_URL || "http://localhost:3000").replace(/\/$/, "");
const output = new URL("../outputs/audit/", import.meta.url);
await mkdir(output, { recursive: true });
const results = [];
for (const engine of [chromium, webkit]) {
  const browser = await engine.launch();
  try {
    for (const [width, height] of [[320, 568], [360, 800], [390, 844], [430, 932], [844, 390], [768, 1024], [1024, 768], [1366, 1024]]) {
      const page = await browser.newPage({ viewport: { width, height }, hasTouch: true, isMobile: true });
      const errors = [];
      page.on("pageerror", error => errors.push(error.message));
      await page.goto(baseUrl + "/about", { waitUntil: "networkidle" });
      await page.evaluate(() => document.fonts.ready);
      await page.waitForTimeout(100);
      checkGeometry(await geometry(page), width, height);
      await checkCompactScene(page, width, height);
      if (engine === chromium) await nativePinch(page, width, height);
      else await webkitPointers(page, width, height);
      await page.getByRole("button", { name: "Носорог", exact: true }).tap();
      const dialog = page.getByRole("dialog", { name: "Носорог", exact: true });
      await dialog.waitFor();
      const canvas = page.locator("canvas");
      const frame = await canvas.evaluate(node => node.toDataURL());
      await page.waitForTimeout(160);
      assert.notEqual(await canvas.evaluate(node => node.toDataURL()), frame);
      await dialog.getByRole("button", { name: "Закрыть", exact: true }).tap();
      const projects=page.locator("button[data-point]");
      for (let i=0;i<await projects.count();i++) {
        const title=await projects.nth(i).textContent();
        await projects.nth(i).tap();
        const detail=page.getByRole("dialog",{name:title,exact:true});
        await detail.waitFor();
        await detail.getByRole("button",{name:"Закрыть",exact:true}).tap();
      }
      assert.deepEqual(errors, []);
      await page.screenshot({ path: fileURLToPath(new URL(`${engine.name()}-${width}.png`, output)) });
      results.push({ engine: engine.name(), width, height, status: "passed" });
      console.log(`PASS ${engine.name()} ${width}×${height}: gestures, card and continuous motion`);
      await page.close();
    }
    const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
    await page.goto(baseUrl + "/about", { waitUntil: "networkidle" });
    const nodes = page.locator("button[data-point]");
    for (let i = 0; i < await nodes.count(); i++) {
      const node = nodes.nth(i);
      await node.hover();
      const tooltip = page.getByRole("tooltip");
      await tooltip.waitFor();
      const a = await node.boundingBox(), b = await tooltip.boundingBox();
      assert.ok(Math.min(a.x + a.width, b.x + b.width) <= Math.max(a.x, b.x) || Math.min(a.y + a.height, b.y + b.height) <= Math.max(a.y, b.y));
      await page.mouse.move(4, 996);
      await tooltip.waitFor({ state: "hidden" });
    }
    await page.close();
    await storageFallback(browser, baseUrl);
    await cartPersistence(browser, baseUrl);
    console.log(`PASS ${engine.name()}: desktop hover, disabled storage, mixed-publisher cart and cross-tab sync`);
  } finally { await browser.close(); }
}
await writeFile(new URL("browser-results.json", output), JSON.stringify({ baseUrl, results }, null, 2));
