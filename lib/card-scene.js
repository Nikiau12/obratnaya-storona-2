// Scene extracted from the business-card src/main.js, 2026-11-10.
// Original objectSpecs, trajectories, sprite rendering, horizon and dust.
// Host adapter only: transparent canvas, fixed design viewport, pause/visibility,
// reduced motion, theme ink, and cleanup. No project graph or labels.
/** @param {HTMLCanvasElement} canvas */
export function mountCardScene(canvas) {
 const ctx = canvas.getContext("2d");
 if (!ctx) return {setPaused() {}, destroy() {}};
 const width = 1200, height = 825;
 const pointer = {x:0,y:0,easedX:0,easedY:0};
 const reduceMotion = false; // Original drawScene runs at its original speed.
 const preference = matchMedia("(prefers-reduced-motion: reduce)");
 let dark = false;
 let ink = "#111", paused = false, visible = true, disposed = false;
 let frame = 0, last = 0, elapsed = 0;
const objectSpecs = [
  { kind: "letter", text: "О", width: 0.68, height: 0.72, weight: 300, fontStyle: "italic", slant: 0.26, size: 0.92, pathIndex: 0, duration: 15.2 },
  { kind: "physical-object", asset: "stone", width: 0.62, height: 0.62, size: 1.06, rotationFactor: 0.38, pathIndex: 2, duration: 18.3, offset: 1 / 6 },
  { kind: "physical-object", asset: "scissors", width: 1.05, height: 0.7, size: 0.92, rotationFactor: 0.55, pathIndex: 3, duration: 17.6, entryDelay: 0.15, entryDuration: 2.1 },
  { kind: "cover-figure", asset: "cycloPerson", width: 0.58, height: 0.92, size: 1.05, rotationFactor: 0.18, pathIndex: 4, duration: 19.4 },
  { kind: "physical-object", asset: "paper", width: 0.68, height: 0.88, size: 0.68, rotationFactor: 0.32, pathIndex: 6, duration: 18.3, offset: 4 / 6, entryDelay: 0.55, entryDuration: 2.45 },
  { kind: "digamma", width: 0.58, height: 0.7, size: 0.68, pathIndex: 7, duration: 16.8 },
  { kind: "mirror-word", text: "наоборот", width: 1.3, height: 0.42, weight: 400, fontStyle: "italic", slant: 0.22, fontFamily: 'Formular, "Tilda Sans", "Helvetica Neue", Arial, sans-serif', size: 0.82, pathIndex: 1, duration: 17.2 },
  { kind: "physical-object", asset: "bu", width: 0.62, height: 1.02, size: 0.74, rotationFactor: 0.3, pathIndex: 5, duration: 19.1 },
];

const objectImages = {
  stone: Object.assign(new Image(), {
    decoding: "async",
    src: `/card/assets/object-stone.webp`,
  }),
  scissors: Object.assign(new Image(), {
    decoding: "async",
    src: `/card/assets/object-scissors.webp`,
  }),
  cycloPerson: Object.assign(new Image(), {
    decoding: "async",
    src: `/card/assets/object-cyclo-person.webp`,
  }),
  paper: Object.assign(new Image(), {
    decoding: "async",
    src: `/card/assets/object-paper-flat-v4.webp`,
  }),
  bu: Object.assign(new Image(), {
    decoding: "async",
    src: `/card/assets/object-bu-handwritten.webp`,
  }),
};

const particles = Array.from({ length: 74 }, (_, i) => ({
  angle: i * 2.399, radius: 0.16 + (i % 17) * 0.035,
  speed: 0.025 + (i % 6) * 0.007, size: 0.7 + (i % 4) * 0.55,
  height: (i % 9) / 10,
}));
const fallingObjects = objectSpecs.map((spec, index) => ({
  ...spec, index, offset: spec.offset ?? index / objectSpecs.length, direction: index % 2 ? -1 : 1,
}));

function sceneMetrics(staticScene = false) {
  const mobile = width < 640;
  const tablet = width >= 640 && width < 1100;
  const parallaxX = staticScene ? 0 : pointer.easedX;
  const parallaxY = staticScene ? 0 : pointer.easedY;
  const horizon = height * (mobile ? 0.52 : 0.47) + parallaxY * 8;
  const vanishingX = width * 0.5 + parallaxX * 25;

  // The hole uses a different visual budget at each breakpoint. In particular,
  // its outermost ring now stays close to the phone width instead of inheriting
  // the much larger desktop proportions.
  const holeW = mobile
    ? Math.min(width * 0.265, height * 0.19)
    : tablet
      ? Math.min(width * 0.23, height * 0.24)
      : Math.min(width * 0.19, height * 0.27);

  return {
    horizon,
    vanishingX,
    perspectiveEdgeY: horizon + (height - horizon) * 0.16,
    holeX: width * 0.5 + parallaxX * 20,
    holeY: height * (mobile ? 0.68 : 0.69),
    holeW,
  };
}

function drawScene(time) {
  const m = sceneMetrics();
  const motionTime = reduceMotion ? time * 0.18 : time;
  drawHole(m, motionTime);

  const states = fallingObjects.map((item) => getObjectState(item, motionTime, m));
  states.filter((state) => state.behind).sort((a, b) => a.y - b.y).forEach(drawObject);
  drawDust(motionTime, m, true);
  states.filter((state) => !state.behind).sort((a, b) => a.y - b.y).forEach(drawObject);
  drawDust(motionTime, m, false);
}

function drawHole(m, time) {
  const w = m.holeW;
  const h = w * 0.34;
  const breath = Math.sin(time * (Math.PI * 2 / 5.2));
  const flowSignal = (
    breath * 0.78
    + Math.sin(time * 1.73 + 1.4) * 0.14
    + Math.sin(time * 2.37 + 3.1) * 0.08
  );
  const horizons = [
    { scale: 1.78, alpha: 0.022, line: 0.095, phase: 0.4 },
    { scale: 1.52, alpha: 0.033, line: 0.088, phase: 1.7 },
    { scale: 1.3, alpha: 0.047, line: 0.072, phase: 2.8 },
    { scale: 1.16, alpha: 0.056, line: 0.042, phase: 4.1 },
  ];
  ctx.save();
  // The accretion rings belong to the floor plane. Clipping them to its
  // perspective polygon prevents the wide ellipses from climbing onto the
  // walls on narrow and short screens.
  ctx.beginPath();
  ctx.moveTo(0, m.perspectiveEdgeY);
  ctx.lineTo(m.vanishingX, m.horizon);
  ctx.lineTo(width, m.perspectiveEdgeY);
  ctx.lineTo(width, height);
  ctx.lineTo(0, height);
  ctx.closePath();
  ctx.clip();
  horizons.forEach((horizon) => {
    const densityWave = Math.sin(time * 0.9 + horizon.phase) * 0.008;
    const flowScale = 1 + breath * 0.022 + flowSignal * 0.006 + densityWave;
    const flowAlpha = horizon.alpha * (1 + flowSignal * 0.34);
    ctx.strokeStyle = dark ? `rgba(230,230,230,${flowAlpha * 2})` : `rgba(70,67,62,${flowAlpha})`;
    ctx.lineWidth = Math.max(2, w * horizon.line * (1 + flowSignal * 0.16));
    ellipse(
      m.holeX,
      m.holeY + w * (horizon.scale - 1) * 0.012,
      w * horizon.scale * flowScale,
      h * horizon.scale * flowScale,
      true,
    );
  });
  ctx.restore();

  // This is an apparent change of the optical shadow, not a literal expansion
  // of the event horizon. Keeping it small makes the breathing readable while
  // the larger wave remains in the variable accretion flow.
  const opticalW = w * (1 + breath * 0.009);
  const opticalH = opticalW * 0.34;
  const shadow = ctx.createRadialGradient(m.holeX, m.holeY, opticalW * 0.12, m.holeX, m.holeY, opticalW * 0.74);
  shadow.addColorStop(0, "rgba(0,0,0,.96)");
  shadow.addColorStop(0.58, "rgba(0,0,0,.82)");
  shadow.addColorStop(1, "rgba(0,0,0,0)");
  ctx.save();
  ctx.translate(m.holeX, m.holeY);
  ctx.scale(1.42, 0.68);
  ctx.fillStyle = shadow;
  ctx.beginPath(); ctx.arc(0, 0, opticalW * 0.78, 0, Math.PI * 2); ctx.fill();
  ctx.restore();

  ctx.fillStyle = "#000";
  ellipse(m.holeX, m.holeY, opticalW * 0.72, opticalH * 0.72);
}

function getObjectState(item, time, m) {
  const cycle = ((time / item.duration + item.offset) % 1 + 1) % 1;
  // A Newtonian t² acceleration is smoothly capped by an exponential term.
  // To a distant observer this makes the final approach asymptotic: the body
  // appears to freeze just outside the event horizon instead of crossing it.
  const observedFall = 1 - Math.exp(-5 * cycle * cycle);
  const horizonRadius = m.holeW * 0.71;
  const radius = horizonRadius + m.holeW * 1.18 * Math.exp(-5 * cycle * cycle);
  const orbitalPhase = 1 - Math.exp(-3.8 * cycle * cycle);
  const angle = (item.pathIndex ?? item.index) * 1.62 + item.direction * orbitalPhase * Math.PI * 3.7;
  // Every new cycle starts above the viewport, so objects enter the room from
  // the top instead of materialising halfway down a wall.
  const altitude = height * 0.76 * (1 - observedFall);
  const groundX = m.holeX + Math.cos(angle) * radius;
  const groundY = m.holeY + Math.sin(angle) * radius * 0.32;
  const x = groundX + pointer.easedX * (20 + item.index * 3);
  const naturalY = groundY - altitude;
  // On the first visit, these two objects enter from above the viewport
  // instead of being revealed already midway through their looping orbits.
  const entryProgress = item.entryDuration
    ? clamp((time - (item.entryDelay || 0)) / item.entryDuration, 0, 1)
    : 1;
  const entryEase = smoothstep(0, 1, entryProgress);
  const y = entryProgress < 1
    ? -height * (0.18 + item.index * 0.015) + (naturalY + height * (0.18 + item.index * 0.015)) * entryEase
    : naturalY;
  const redshift = smoothstep(0.9, 0.997, observedFall);
  const tumble = item.direction * (cycle * Math.PI * 4.2 + Math.sin(time * 0.7 + item.index) * 0.18);
  const keepsBaseline = item.kind === "mirror-word" || item.kind === "text-fragment" || item.kind === "pagination" || item.kind === "proof-insert";
  const rotation = item.kind === "cover-figure"
    ? 0
    : keepsBaseline
      ? Math.sin(time * 0.42 + item.index * 0.8) * 0.075
      : tumble * (item.rotationFactor ?? (item.kind === "fragment" ? 0.62 : 0.72));
  return {
    item, cycle, redshift, behind: Math.sin(angle) < 0,
    x, y,
    groundX, groundY, angle,
    rotation,
    scale: (0.8 - observedFall * 0.27) * (width < 640 ? 0.86 : 1),
    alpha: Math.exp(-4.8 * redshift * redshift),
  };
}

function drawObject(state) {
  const { item, x, y, groundX, groundY, rotation, scale, redshift, alpha } = state;
  if (alpha <= 0.01) return;
  const base = Math.min(width, height) * 0.175;
  const itemScale = item.size || 1;
  const objectW = base * item.width * scale * itemScale;
  const objectH = base * item.height * scale * itemScale;

  ctx.save();
  ctx.globalAlpha = alpha * (0.1 + state.cycle * 0.9);
  ctx.fillStyle = "rgba(0,0,0,.1)";
  ellipse(groundX, groundY + 2, objectW * 0.42, objectH * 0.1);
  ctx.restore();

  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(rotation);
  ctx.globalAlpha = alpha * (1 - redshift * 0.28);
  drawTypographicSprite(item, objectW, objectH);
  ctx.restore();
}

function drawTypographicSprite(item, w, h) {
  ctx.fillStyle = ink;

  if (item.kind === "cover-figure") {
    const image = objectImages[item.asset];
    if (image?.complete && image.naturalWidth) {
      ctx.drawImage(image, -w * 0.56, -h * 0.56, w * 1.12, h * 1.12);
    }
    return;
  }

  if (item.kind === "physical-object") {
    const image = objectImages[item.asset];
    if (image?.complete && image.naturalWidth) {
      if (dark && item.asset === "bu") ctx.filter = "invert(1)";
      ctx.drawImage(image, -w * 0.68, -h * 0.68, w * 1.36, h * 1.36);
    }
    return;
  }

  if (item.kind === "digamma") {
    ctx.strokeStyle = ink;
    ctx.lineWidth = Math.max(2, w * 0.11);
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.beginPath();
    ctx.moveTo(-w * 0.13, -h * 0.43);
    ctx.lineTo(w * 0.31, -h * 0.43);
    ctx.moveTo(-w * 0.13, -h * 0.43);
    ctx.lineTo(-w * 0.13, h * 0.23);
    ctx.bezierCurveTo(-w * 0.13, h * 0.4, -w * 0.24, h * 0.5, -w * 0.36, h * 0.43);
    ctx.moveTo(-w * 0.13, -h * 0.06);
    ctx.lineTo(w * 0.23, -h * 0.06);
    ctx.stroke();
    return;
  }

  if (item.kind === "proof-insert") {
    ctx.strokeStyle = ink;
    ctx.lineWidth = Math.max(1.5, w * 0.055);
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.beginPath();
    ctx.moveTo(-w * 0.29, h * 0.24);
    ctx.lineTo(0, -h * 0.24);
    ctx.lineTo(w * 0.29, h * 0.2);
    ctx.stroke();
    return;
  }

  const fontSize = item.kind === "mirror-word" ? h * 1.18 : h * 1.08;
  const fontFamily = item.fontFamily || '"Tilda Sans", "Helvetica Neue", Arial, sans-serif';
  ctx.font = `${item.fontStyle ? `${item.fontStyle} ` : ""}${item.weight || 400} ${fontSize}px ${fontFamily}`;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";

  if (item.slant) ctx.transform(1, 0, -item.slant, 1, 0, 0);

  if (item.kind === "fragment") {
    // The clipped edge makes this a piece of a letter rather than another
    // complete alphabet character.
    ctx.fillStyle = "#c6322b";
    ctx.beginPath();
    ctx.rect(-w * 0.36, -h * 0.48, w * 0.42, h * 0.96);
    ctx.clip();
    ctx.fillText(item.text, -w * 0.02, 0);
    return;
  }

  if (item.kind === "mirror-word") {
    ctx.fillStyle = ink;
    ctx.scale(-1, 1);
  }
  ctx.fillText(item.text, 0, 0);
}

function drawDust(time, m, behind) {
  ctx.fillStyle = ink;
  particles.forEach((particle, index) => {
    const angle = particle.angle + time * particle.speed;
    const radiusPhase = ((time * 0.016 + index / particles.length) % 1);
    const radius = m.holeW * (1.7 - radiusPhase * 1.45);
    if ((Math.sin(angle) < 0) !== behind) return;
    const x = m.holeX + Math.cos(angle) * radius;
    const y = m.holeY + Math.sin(angle) * radius * 0.31 - (1 - radiusPhase) * particle.height * height * 0.16;
    ctx.globalAlpha = (1 - radiusPhase) * 0.52 * 0.18;
    ctx.beginPath(); ctx.arc(x, y, particle.size, 0, Math.PI * 2); ctx.fill();
  });
  ctx.globalAlpha = 1;
}

function ellipse(x, y, rx, ry, stroke = false) {
  ctx.beginPath(); ctx.ellipse(x, y, Math.max(0.1, rx), Math.max(0.1, ry), 0, 0, Math.PI * 2);
  stroke ? ctx.stroke() : ctx.fill();
}

function clamp(value, min, max) { return Math.max(min, Math.min(max, value)); }

function smoothstep(min, max, value) { const x = clamp((value - min) / (max - min), 0, 1); return x * x * (3 - 2 * x); }

 function draw() {
   if(disposed)return;
   const rect=canvas.getBoundingClientRect();
   const density=Math.min(devicePixelRatio||1,2);
   const w=Math.round(rect.width*density), h=Math.round(rect.height*density);
   if(!w||!h)return;
   if(canvas.width!==w||canvas.height!==h){canvas.width=w;canvas.height=h;}
   ctx.setTransform(1,0,0,1,0,0);ctx.clearRect(0,0,w,h);
   ctx.setTransform(w/width,0,0,h/height,0,0);
   ink=getComputedStyle(canvas).color;
   dark=document.documentElement.dataset.siteTheme === "black";
   drawScene(preference.matches?5:elapsed);
 }
 function tick(now) {
   frame=0;
   const delta=last?Math.min((now-last)/1000,.05):0;last=now;
   elapsed+=delta;
   pointer.easedX+=(pointer.x-pointer.easedX)*Math.min(1,delta*3.3);
   pointer.easedY+=(pointer.y-pointer.easedY)*Math.min(1,delta*3.3);
   draw();
   if(!disposed&&!paused&&visible&&!document.hidden&&!preference.matches)frame=requestAnimationFrame(tick);
 }
 function sync() {
   cancelAnimationFrame(frame);frame=0;last=0;draw();
   if(!disposed&&!paused&&visible&&!document.hidden&&!preference.matches)frame=requestAnimationFrame(tick);
 }
 function move(event) {
   const rect=canvas.getBoundingClientRect();
   pointer.x=clamp((event.clientX-rect.left)/rect.width*2-1,-1,1);
   pointer.y=clamp((event.clientY-rect.top)/rect.height*2-1,-1,1);
 }
 function leave(){pointer.x=0;pointer.y=0;}
 canvas.addEventListener("pointermove",move);canvas.addEventListener("pointerleave",leave);
 const resize=new ResizeObserver(sync);resize.observe(canvas);
 const intersection=new IntersectionObserver(entries=>{visible=entries[0].isIntersecting;sync();});intersection.observe(canvas);
 const theme=new MutationObserver(sync);theme.observe(document.documentElement,{attributes:true,attributeFilter:["data-site-theme","class","style"]});
 document.addEventListener("visibilitychange",sync);preference.addEventListener("change",sync);
 Object.values(objectImages).forEach(image=>image.addEventListener("load",sync));
 sync();
 return {
   setPaused(value){paused=value;sync();},
   destroy(){disposed=true;cancelAnimationFrame(frame);resize.disconnect();intersection.disconnect();theme.disconnect();document.removeEventListener("visibilitychange",sync);preference.removeEventListener("change",sync);canvas.removeEventListener("pointermove",move);canvas.removeEventListener("pointerleave",leave);Object.values(objectImages).forEach(image=>image.removeEventListener("load",sync));}
 };
}
