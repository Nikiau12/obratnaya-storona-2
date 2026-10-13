export type InkPoint = { x: number; y: number };
export const INK_LIFETIME = 3800;

export function inkOpacity(age: number) {
  const progress = Math.max(0, Math.min(1, (age - 450) / (INK_LIFETIME - 450)));
  return .58 * (1 - progress * progress * (3 - 2 * progress));
}

export function inkWidth(speed: number) {
  return .7 + 1.05 / (1 + Math.max(0, speed) * 1.8);
}
