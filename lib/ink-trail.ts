export type InkPoint = { x: number; y: number };
export type InkRect = { left: number; top: number; right: number; bottom: number };
export const INK_LIFETIME = 3800;

export function inkOpacity(age: number) {
  const progress = Math.max(0, Math.min(1, (age - 450) / (INK_LIFETIME - 450)));
  return .58 * (1 - progress * progress * (3 - 2 * progress));
}

export function inkWidth(speed: number) {
  return .7 + 1.05 / (1 + Math.max(0, speed) * 1.8);
}

// Test the whole movement, not just its end: a fast pointer can jump over text.
export function crossesInkRect(from: InkPoint, to: InkPoint, rect: InkRect) {
  let enter = 0;
  let leave = 1;
  for (const [start, delta, min, max] of [
    [from.x, to.x - from.x, rect.left, rect.right],
    [from.y, to.y - from.y, rect.top, rect.bottom],
  ]) {
    if (delta === 0) {
      if (start < min || start > max) return false;
    } else {
      const a = (min - start) / delta;
      const b = (max - start) / delta;
      enter = Math.max(enter, Math.min(a, b));
      leave = Math.min(leave, Math.max(a, b));
      if (enter > leave) return false;
    }
  }
  return true;
}
