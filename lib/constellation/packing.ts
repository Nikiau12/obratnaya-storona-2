type Bounds = { left: number; right: number; top: number; bottom: number };
type Point = Bounds & { x: number; y: number };
const rect = (point: Point): Bounds => ({ left:point.x+point.left, right:point.x+point.right, top:point.y+point.top, bottom:point.y+point.bottom });
const overlaps = (a: Bounds, b: Bounds, gap: number) =>
  Math.min(a.right,b.right)-Math.max(a.left,b.left)>-gap+.05 && Math.min(a.bottom,b.bottom)-Math.max(a.top,b.top)>-gap+.05;

/** Keep the radial composition. Only repack if relaxation leaves a crowded edge. */
export function packConstellation<T extends Point>(points: T[], safe: Bounds, gap: number) {
  if (!points.some((a,index) => points.slice(index+1).some(b => overlaps(rect(a),rect(b),gap)))) return true;
  const original = points.map(point => ({point,x:point.x,y:point.y}));
  const placed: Bounds[] = [];
  // Larger labels go first. Small unlabelled points can use the remaining gaps.
  const order = [...points].sort((a,b) => (b.right-b.left)*(b.bottom-b.top)-(a.right-a.left)*(a.bottom-a.top));
  for (const point of order) {
    const xs = new Set([point.x, safe.left-point.left, safe.right-point.right]);
    const ys = new Set([point.y, safe.top-point.top, safe.bottom-point.bottom]);
    for (const other of placed) {
      xs.add(other.left-gap-point.right); xs.add(other.right+gap-point.left);
      ys.add(other.top-gap-point.bottom); ys.add(other.bottom+gap-point.top);
    }
    let best: {x:number;y:number;cost:number;box:Bounds} | null = null;
    for (const x of xs) for (const y of ys) {
      const box = {left:x+point.left,right:x+point.right,top:y+point.top,bottom:y+point.bottom};
      if (box.left<safe.left-.01 || box.right>safe.right+.01 || box.top<safe.top-.01 || box.bottom>safe.bottom+.01) continue;
      const cost = (x-point.x)**2+(y-point.y)**2;
      if (best && cost>=best.cost) continue;
      if (placed.some(other => overlaps(box,other,gap))) continue;
      best = {x,y,cost,box};
    }
    if (!best) {
      original.forEach(({point,x,y}) => {point.x=x;point.y=y;});
      return false;
    }
    point.x=best.x; point.y=best.y; placed.push(best.box);
  }
  return true;
}
