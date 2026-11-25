export type GraphView = { scale: number; offsetX: number; offsetY: number };
type Point = { x: number; y: number };
type Finger = Point & { startX: number; startY: number };
const clamp = (value: number, min: number, max: number) => Math.max(min, Math.min(max, value));

/** Business-card gesture rules, without DOM or React dependencies. */
export class GraphGestures {
  readonly view: GraphView = { scale: 1, offsetX: 0, offsetY: 0 };
  private fingers = new Map<number, Finger>();
  private pinchDistance = 0;
  private pinchScale = 1;
  private moved = false;
  private suppressUntil = 0;
  private width = 0;
  private height = 0;

  get ids() { return [...this.fingers.keys()]; }
  get manipulating() { return this.moved || this.fingers.size > 1; }

  resize(width: number, height: number, enabled = width < 1100) {
    this.width = width; this.height = height;
    if (!enabled) Object.assign(this.view, { scale: 1, offsetX: 0, offsetY: 0 });
    this.constrain();
  }

  down(id: number, point: Point) {
    if (this.fingers.size === 0) this.moved = false;
    this.fingers.set(id, { ...point, startX: point.x, startY: point.y });
    if (this.fingers.size === 2) {
      const [a, b] = [...this.fingers.values()];
      this.pinchDistance = Math.hypot(b.x - a.x, b.y - a.y);
      this.pinchScale = this.view.scale;
      this.moved = true;
    }
  }

  move(id: number, point: Point, now: number) {
    const previous = this.fingers.get(id);
    if (!previous) return false;
    if (Math.hypot(point.x - previous.startX, point.y - previous.startY) > 6) this.moved = true;
    this.fingers.set(id, { ...previous, ...point });
    if (this.fingers.size >= 2 && this.pinchDistance > 0) {
      const [a, b] = [...this.fingers.values()];
      this.view.scale = clamp(this.pinchScale * Math.hypot(b.x - a.x, b.y - a.y) / this.pinchDistance, 1, 2.4);
    } else if (this.fingers.size === 1 && this.view.scale > 1 && this.moved) {
      this.view.offsetX += point.x - previous.x;
      this.view.offsetY += point.y - previous.y;
    }
    this.constrain();
    if (this.manipulating) this.suppressUntil = now + 260;
    return this.manipulating;
  }

  up(id: number, now: number) {
    if (this.manipulating) this.suppressUntil = now + 260;
    this.fingers.delete(id);
    if (this.fingers.size < 2) this.pinchDistance = 0;
    if (this.fingers.size === 0) this.moved = false;
  }

  cancel(now: number) {
    if (this.fingers.size) this.suppressUntil = now + 260;
    this.fingers.clear(); this.moved = false; this.pinchDistance = 0;
  }

  ignoreClick(now: number) { return this.manipulating || now < this.suppressUntil; }

  private constrain() {
    if (this.view.scale <= 1.001) {
      this.view.scale = 1; this.view.offsetX = 0; this.view.offsetY = 0;
      return;
    }
    const limit = Math.min(this.width, this.height) * (this.view.scale - .8) * .25;
    this.view.offsetX = clamp(this.view.offsetX, -limit, limit);
    this.view.offsetY = clamp(this.view.offsetY, -limit * .55, limit * .55);
  }
}
