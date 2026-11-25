/** Shared by the canvas and the map; compact proportions come from obratno.io. */
export function constellationScene(width: number, height: number, compact = width < 1100) {
  const phone = width < 640;
  const horizon = height * (compact ? phone ? .52 : .47 : .46);
  const edgeY = horizon + (height - horizon) * .16;
  const holeW = compact
    ? phone ? Math.min(width * .265, height * .19) : Math.min(width * .23, height * .24)
    : Math.min(width * .25, height * .30);
  return {
    horizon, vanishingX: width * .5, leftEdgeY: edgeY, rightEdgeY: edgeY,
    holeX: width * .5, holeY: height * (compact ? phone ? .68 : .69 : .75), holeW,
  };
}

export function constellationZone(width: number, height: number, headerBottom: number) {
  const phone = width < 640;
  const short = height < 540;
  const scene = constellationScene(width, height, true);
  const safeTop = Math.max(headerBottom + (short ? 8 : 18), height * (phone ? height < 700 ? .18 : .215 : .19));
  const safeBottom = scene.leftEdgeY - (short ? 6 : 18);
  const zoneHeight = Math.max(60, safeBottom - safeTop);
  const radiusY = Math.max(32, Math.min(zoneHeight / 2, width * .4)) * .95;
  return {
    safeTop, safeBottom, zoneHeight,
    centerY: safeTop + zoneHeight / 2 + Math.min(12, height * .015),
    radiusX: phone && height < 700 ? Math.min(width * .32, Math.max(radiusY * 2.25, width * .3)) : radiusY,
    radiusY,
  };
}
