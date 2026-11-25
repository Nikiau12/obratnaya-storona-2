import { aboutPoints } from "./projects";
import type { GraphView } from "./gestures";

type Anchor = { id: string; x: number; y: number; side: "left" | "right"; width: number; height: number; element: HTMLElement };

// Adapt the existing graph to the available screen and measured label sizes.
// Lines use those same final anchors, so they always meet the actual dots.
export function layoutConstellation(root: HTMLElement, view: GraphView) {
  const width = root.clientWidth, height = root.clientHeight;
  if (!width || !height) return;
  root.dataset.graphScale = String(view.scale);
  root.dataset.graphOffsetX = String(view.offsetX);
  root.dataset.graphOffsetY = String(view.offsetY);
  const phone = width < 640;
  const anchors: Anchor[] = aboutPoints.map(point => {
    const element = root.querySelector<HTMLElement>(`[data-point="${point.id}"]`)!;
    const [x, y, side] = point[phone ? "phone" : "desktop"];
    element.dataset.side = side;
    const cx = width * .5, cy = height * .48;
    return { id: point.id, x: cx + (width * x / 100 - cx) * view.scale + view.offsetX, y: cy + (height * y / 100 - cy) * view.scale + view.offsetY, side,
      width: element.offsetWidth, height: element.offsetHeight, element };
  });
  const bounds = (a: Anchor) => {
    const project = a.element.tagName === "BUTTON";
    const left = project ? a.side === "left" ? a.x + 22 - a.width : a.x - 22 : a.x - a.width / 2;
    return { left, right: left + a.width, top: a.y - a.height / 2, bottom: a.y + a.height / 2 };
  };
  const constrain = (a: Anchor) => {
    const b = bounds(a);
    a.x += Math.max(0, 8 - b.left) - Math.max(0, b.right - width + 8);
    a.y += Math.max(0, 12 - b.top) - Math.max(0, b.bottom - height + 12);
  };
  const holeW = Math.min(width * (phone ? .29 : .25), height * .30);
  for (let pass = 0; pass < 24; pass++) {
    let changed = false;
    for (const a of anchors) {
      constrain(a);
      if (a.element.tagName !== "BUTTON") continue;
      const b = bounds(a), cx = (b.left + b.right) / 2, cy = (b.top + b.bottom) / 2;
      const rx = holeW * .72 + a.width / 2 + 8;
      const ry = holeW * .245 + a.height / 2 + 8;
      const dx = cx - width / 2, dy = cy - height * .75;
      const distance = Math.hypot(dx / rx, dy / ry);
      if (distance < 1) {
        const angle = distance > .001 ? Math.atan2(dy / ry, dx / rx) : -Math.PI / 2;
        a.x += width / 2 + Math.cos(angle) * rx - cx;
        a.y += height * .75 + Math.sin(angle) * ry - cy;
        changed = true;
      }
    }
    for (let i = 0; i < anchors.length; i++) for (let j = i + 1; j < anchors.length; j++) {
      const a = anchors[i], b = anchors[j], ra = bounds(a), rb = bounds(b);
      const ox = Math.min(ra.right, rb.right) - Math.max(ra.left, rb.left) + 6;
      const oy = Math.min(ra.bottom, rb.bottom) - Math.max(ra.top, rb.top) + 6;
      if (ox <= 0 || oy <= 0) continue;
      if (oy <= ox) {
        const amount = oy / 2 + .5, direction = a.y <= b.y ? -1 : 1;
        a.y += amount * direction; b.y -= amount * direction;
      } else {
        const amount = ox / 2 + .5, direction = a.x <= b.x ? -1 : 1;
        a.x += amount * direction; b.x -= amount * direction;
      }
      changed = true;
    }
    if (!changed) break;
  }
  anchors.forEach(a => {
    constrain(a);
    a.element.style.setProperty("--node-x", `${a.x}px`);
    a.element.style.setProperty("--node-y", `${a.y}px`);
  });
  root.querySelectorAll<SVGLineElement>("line[data-from]").forEach(line => {
    const a = anchors.find(point => point.id === line.dataset.from)!;
    const b = anchors.find(point => point.id === line.dataset.to)!;
    line.setAttribute("x1", `${a.x / width * 1000}`); line.setAttribute("y1", `${a.y / height * 1000}`);
    line.setAttribute("x2", `${b.x / width * 1000}`); line.setAttribute("y2", `${b.y / height * 1000}`);
  });
}
