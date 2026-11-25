import { aboutPoints, compactPoints } from "./projects";
import { constellationScene, constellationZone } from "./viewport";
import { packConstellation } from "./packing";
import type { GraphView } from "./gestures";

type Bounds = { left: number; right: number; top: number; bottom: number };
type Anchor = Bounds & { id: string; x: number; y: number; element: HTMLElement };

function visualExtents(element: HTMLElement, side: "left" | "right", compact: boolean, phone: boolean): Bounds {
  const label = element.querySelector<HTMLElement>("[data-point-label]");
  let left = -element.offsetWidth / 2, right = -left, halfHeight = element.offsetHeight / 2;
  if (label && compact) {
    // Absolute labels extend beyond their point. Include the 24px touch spot
    // so nearby labels cannot intercept a tap on a different project.
    const rect = label.getBoundingClientRect();
    const gap = phone ? 12 : 14, radius = 12;
    left = side === "left" ? -gap - rect.width : -radius;
    right = side === "left" ? radius : gap + rect.width;
    halfHeight = Math.max(radius, rect.height / 2);
  } else if (label) {
    left = side === "left" ? 22 - element.offsetWidth : -22;
    right = left + element.offsetWidth;
  }
  return { left, right, top: -halfHeight, bottom: halfHeight };
}

function compactSeparation(a: Bounds, b: Bounds, safe: Bounds, gap: number) {
  return [true, false].map(horizontal => {
    const start = horizontal ? "left" : "top", end = horizontal ? "right" : "bottom";
    const direction = a[start] + a[end] <= b[start] + b[end] ? -1 : 1;
    const need = Math.min(a[end], b[end]) - Math.max(a[start], b[start]) + gap;
    const roomA = Math.max(0, direction < 0 ? a[start] - safe[start] : safe[end] - a[end]);
    const roomB = Math.max(0, direction < 0 ? safe[end] - b[end] : b[start] - safe[start]);
    if (roomA + roomB < need) return null;
    const initialA = Math.min(need / 2, roomA);
    const moveB = Math.min(need - initialA, roomB), moveA = need - moveB;
    return { horizontal, direction, moveA, moveB, cost: need };
  }).filter(value => value !== null).sort((a, b) => a.cost - b.cost)[0];
}

export function layoutConstellation(root: HTMLElement, view: GraphView) {
  const width = root.clientWidth, height = root.clientHeight;
  if (!width || !height) return;
  const phone = width < 640;
  const compact = width < 1100 || matchMedia("(any-pointer: coarse)").matches;
  const header = root.closest("[data-about-page]")?.querySelector("header");
  const headerBottom = Math.max(0, (header?.getBoundingClientRect().bottom ?? 0) - root.getBoundingClientRect().top);
  const zone = constellationZone(width, height, headerBottom);
  const scene = constellationScene(width, height, compact);
  root.dataset.graphScale = String(view.scale);
  root.dataset.graphOffsetX = String(view.offsetX);
  root.dataset.graphOffsetY = String(view.offsetY);
  root.dataset.graphLayout = compact ? phone ? "radial" : "compact" : "desktop";

  const anchors: Anchor[] = aboutPoints.map(point => {
    const element = root.querySelector<HTMLElement>(`[data-point="${point.id}"]`)!;
    const reference = compactPoints[point.id];
    const side = compact
      ? phone ? reference.side : point.id === "signal" || (width >= 1100 && point.id === "chlor") ? "left" : "right"
      : point.desktop[2];
    element.dataset.side = side;
    let x = width * point.desktop[0] / 100, y = height * point.desktop[1] / 100;
    const cx = width * .5;
    let cy = height * .48;
    if (compact && !phone) {
      x = width * reference.tablet[0];
      y = height * (.16 + reference.tablet[1] * .6);
      cy = height * .46;
    } else if (compact && height < 700) {
      x = width * reference.short[0];
      y = zone.safeTop + zone.zoneHeight * reference.short[1];
      cy = zone.safeTop + zone.zoneHeight * .5;
    } else if (compact) {
      const angle = reference.angle * Math.PI / 180;
      x = cx + Math.cos(angle) * zone.radiusX * reference.radius;
      y = zone.centerY + Math.sin(angle) * zone.radiusY * reference.radius;
      cy = zone.centerY;
    }
    x = cx + (x - cx) * view.scale + view.offsetX;
    y = cy + (y - cy) * view.scale + view.offsetY;
    return { id: point.id, x, y, element, ...visualExtents(element, side, compact, phone) };
  });

  const bounds = (a: Anchor): Bounds => ({ left: a.x + a.left, right: a.x + a.right, top: a.y + a.top, bottom: a.y + a.bottom });
  const padding = phone ? 10 : 18;
  const safe = compact ? { left: padding, right: width - padding, top: zone.safeTop, bottom: zone.safeBottom }
    : { left: 8, right: width - 8, top: 12, bottom: height - 12 };
  const constrain = (a: Anchor) => {
    const b = bounds(a);
    a.x += Math.max(0, safe.left - b.left) - Math.max(0, b.right - safe.right);
    a.y += Math.max(0, safe.top - b.top) - Math.max(0, b.bottom - safe.bottom);
  };
  const gap = compact ? phone ? 7 : 10 : 6;
  for (let pass = 0; pass < (compact ? 96 : 24); pass++) {
    let changed = false;
    for (const a of anchors) {
      constrain(a);
      if (a.element.tagName !== "BUTTON") continue;
      const b = bounds(a), cx = (b.left + b.right) / 2, cy = (b.top + b.bottom) / 2;
      const rx = scene.holeW * .72 + (b.right - b.left) / 2 + 8;
      const ry = scene.holeW * .245 + (b.bottom - b.top) / 2 + 8;
      const dx = cx - scene.holeX, dy = cy - scene.holeY;
      const distance = Math.hypot(dx / rx, dy / ry);
      if (distance < 1) {
        const angle = distance > .001 ? Math.atan2(dy / ry, dx / rx) : -Math.PI / 2;
        a.x += scene.holeX + Math.cos(angle) * rx - cx;
        a.y += scene.holeY + Math.sin(angle) * ry - cy;
        changed = true;
      }
    }
    for (let i = 0; i < anchors.length; i++) for (let j = i + 1; j < anchors.length; j++) {
      const a = anchors[i], b = anchors[j], ra = bounds(a), rb = bounds(b);
      const ox = Math.min(ra.right, rb.right) - Math.max(ra.left, rb.left);
      const oy = Math.min(ra.bottom, rb.bottom) - Math.max(ra.top, rb.top);
      if (ox + gap <= 0 || oy + gap <= 0) continue;
      if (compact) {
        // At a screen edge, share the movement according to available room.
        // Choosing the smaller correction lets a crowded row open vertically
        // instead of repeatedly pushing three labels against the same edge.
        const shift = compactSeparation(ra, rb, safe, gap);
        if (!shift) continue;
        if (shift.horizontal) { a.x += shift.moveA * shift.direction; b.x -= shift.moveB * shift.direction; }
        else { a.y += shift.moveA * shift.direction; b.y -= shift.moveB * shift.direction; }
        changed = true;
        continue;
      }
      const horizontal = ox < oy;
      const amount = (horizontal ? ox : oy) / 2 + gap / 2 + .5;
      const direction = horizontal ? (a.x <= b.x ? -1 : 1) : (a.y <= b.y ? -1 : 1);
      if (horizontal) { a.x += amount * direction; b.x -= amount * direction; }
      else { a.y += amount * direction; b.y -= amount * direction; }
      changed = true;
    }
    if (!changed) break;
  }
  anchors.forEach(constrain);
  if (compact) packConstellation(anchors, safe, gap);
  anchors.forEach(a => {
    a.element.style.setProperty("--node-x", `${a.x}px`);
    a.element.style.setProperty("--node-y", `${a.y}px`);
  });
  root.querySelectorAll<SVGLineElement>("line[data-from]").forEach(line => {
    const a = anchors.find(point => point.id === line.dataset.from)!;
    const b = anchors.find(point => point.id === line.dataset.to)!;
    line.setAttribute("x1", `${a.x / width * 1000}`); line.setAttribute("y1", `${a.y / height * 1000}`);
    line.setAttribute("x2", `${b.x / width * 1000}`); line.setAttribute("y2", `${b.y / height * 1000}`);
  });
  root.querySelectorAll<SVGCircleElement>("[data-dust] circle").forEach((dot, index) => {
    const angle = -1.2 + index * 2.399963;
    const spread = .3 + index % 8 / 10 + Math.sqrt((index + 1) / 42) * .32;
    const center = compact && phone ? { x: width * .5, y: zone.centerY, rx: zone.radiusX * .82, ry: zone.radiusY * .68 }
      : { x: width * (compact ? .48 : .5), y: height * (compact ? .52 : .44), rx: width * .29, ry: height * (compact ? .18 : .2) };
    dot.setAttribute("cx", `${(center.x + Math.cos(angle) * center.rx * spread) / width * 1000}`);
    dot.setAttribute("cy", `${(center.y + Math.sin(angle) * center.ry * spread) / height * 1000}`);
  });
}
