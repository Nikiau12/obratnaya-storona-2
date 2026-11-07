// Embedded copy of the existing obratno.io scene. Standalone source is unchanged.
let darkTheme = document.documentElement.dataset.theme === "black";
addEventListener("message", event => {
  if (event.source !== parent || event.origin !== location.origin || event.data?.type !== "obratnaya:theme") return;
  darkTheme = event.data.theme === "black";
  document.documentElement.dataset.theme = darkTheme ? "black" : "white";
  rebuildRoomCache();
});

const projectLabelsReady = true;

// A compact vocabulary of letters, figures, and physical objects. The stone,
// scissors, and paper now form a quiet visual sequence inside the larger scene.
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

const nodes = [
  {
    id: "signal",
    title: "Носорог",
    description: "Независимое издательство, выросшее из одноимённого литературного журнала. Мы работаем с разными прозаическими формами — от теоретического фикшена до эссеистики и рассказов, с поэзией и переводной литературой,",
    emphasis: "с актуальностью и опытом прошедшего.",
    url: "https://nosorog.media/",
    kind: "project",
    status: "live",
  },
  {
    id: "flicker",
    title: "Teller Books",
    description: "Teller Books — книжная серия медиакомпании Teller под кураторством «Обратной стороны», главные книги по теории и практике современных медиа.",
    url: "https://teller.media/blog/",
    kind: "project",
    status: "live",
  },
  { id: "residents", title: "Онлайн-медиа «Обратная сторона»", description: "", kind: "project", url: "/materials", internal: true },
  { id: "showcase", title: "Книжный онлайн-магазин", description: "", kind: "project", url: "/books", internal: true },
  {
    id: "word",
    title: "Носорог х Press mi",
    description: "Совместная книжная серия artist-run пространства Осси «ми» и издательства «Носорог», переводная литература по современному искусству от исследователей и теоретиков XXI века.",
    url: "https://occimi.com/samizdatoccimi",
    kind: "project",
    status: "live",
  },
  {
    id: "chlor",
    title: "Издательство города Хлор",
    description: "Естественная точка сборки некоторых инициатив, посвящённых поэзии XX–XXI веков и современной экспериментальной прозе; заведомо странные и «некоммерческие» проекты.",
    url: "https://chlorinecity.ru/",
    kind: "project",
  },
  { id: "day", title: "", description: "", kind: "placeholder", status: "placeholder" },
  { id: "archive", title: "", description: "", kind: "placeholder", status: "placeholder" },
  { id: "about", title: "", description: "", kind: "placeholder", status: "placeholder" },
  {
    id: "contact",
    title: "Издательское бюро «Обратная сторона»",
    description: "Независимая команда, создающая печатные проекты на заказ — от идеи до готового издания.",
    kind: "project",
    status: "upcoming",
  },
];

const edges = [
  ["signal", "word"], ["signal", "archive"], ["signal", "residents"],
  ["flicker", "showcase"], ["flicker", "day"], ["flicker", "about"],
  ["residents", "word"], ["residents", "contact"], ["showcase", "about"],
  ["day", "word"], ["archive", "day"], ["about", "contact"],
  ["chlor", "signal"], ["chlor", "word"], ["chlor", "flicker"],
];

const desktopLayout = {
  signal: { x: 0.25, y: 0.64 }, flicker: { x: 0.77, y: 0.57 },
  residents: { x: 0.45, y: 0.385 }, showcase: { x: 0.67, y: 0.38 },
  word: { x: 0.305, y: 0.47 }, day: { x: 0.55, y: 0.435 },
  archive: { x: 0.19, y: 0.525 }, about: { x: 0.85, y: 0.485 },
  contact: { x: 0.59, y: 0.3 }, chlor: { x: 0.52, y: 0.82 },
};

const compactLayout = {
  residents: { angle: -90, radius: 1 }, contact: { angle: -50, radius: 0.8 },
  flicker: { angle: -10, radius: 0.9 }, about: { angle: 30, radius: 0.8 },
  showcase: { angle: 58, radius: 0.78 }, word: { angle: 112, radius: 0.66 },
  day: { angle: 152, radius: 0.72 }, archive: { angle: 190, radius: 1 },
  signal: { angle: 230, radius: 1 }, chlor: { angle: 80, radius: 0.94 },
};

// A very short phone cannot fit nine readable labels around a circle. Three
// staggered rows preserve the network character without forcing labels on top
// of one another; regular phones continue to use the radial layout above.
const shortPhoneLayout = {
  signal: { x: 0.25, y: 0.12 }, residents: { x: 0.49, y: 0.08 }, contact: { x: 0.9, y: 0.16 },
  archive: { x: 0.19, y: 0.45 }, day: { x: 0.39, y: 0.42 }, flicker: { x: 0.78, y: 0.48 },
  word: { x: 0.18, y: 0.86 }, showcase: { x: 0.78, y: 0.8 }, about: { x: 0.72, y: 0.82 },
  chlor: { x: 0.42, y: 0.55 },
};

const root = document.querySelector("#app");
root.innerHTML = `
  <main class="shell">
    <canvas class="scene" aria-hidden="true"></canvas>
    <section class="intro" aria-labelledby="page-title">
      <h1 id="page-title">Обратная сторона</h1>
      <p class="lede">Независимый издательский проект и констелляция книжных практик</p>
    </section>
    <nav class="node-layer" aria-label="Проекты Обратной стороны">
      <svg class="constellation-points" aria-hidden="true"></svg>
      <svg class="node-lines" aria-hidden="true"></svg>
    </nav>
    <aside class="info-panel" aria-live="polite" hidden>
      <span class="info-title"></span><span class="info-copy"></span>
    </aside>
  </main>`;

const canvas = document.querySelector(".scene");
let ctx = canvas.getContext("2d", { alpha: false });
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
const roomCanvas = document.createElement("canvas");
const cachedRoomCtx = roomCanvas.getContext("2d", { alpha: false });
const intro = document.querySelector(".intro");
const nodeLayer = document.querySelector(".node-layer");
const constellationPoints = document.querySelector(".constellation-points");
const nodeLines = document.querySelector(".node-lines");
const infoPanel = document.querySelector(".info-panel");
const infoTitle = document.querySelector(".info-title");
const infoCopy = document.querySelector(".info-copy");
const reduceMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;
const pointer = { x: 0, y: 0, easedX: 0, easedY: 0 };
const mobileGraph = { offsetX: 0, offsetY: 0, scale: 1, pointers: new Map(), pinchDistance: 0, pinchScale: 1, lastGestureAt: 0 };
const particles = Array.from({ length: 74 }, (_, i) => ({
  angle: i * 2.399, radius: 0.16 + (i % 17) * 0.035,
  speed: 0.025 + (i % 6) * 0.007, size: 0.7 + (i % 4) * 0.55,
  height: (i % 9) / 10,
}));
const fallingObjects = objectSpecs.map((spec, index) => ({
  ...spec, index, offset: spec.offset ?? index / objectSpecs.length, direction: index % 2 ? -1 : 1,
}));

let width = 1;
let height = 1;
let ratio = 1;
let activeNodeId = "signal";
let mobileLinkArmedId = null;
let startTime = performance.now();
let lastTick = startTime;
let frameAccumulator = 0;
const targetFrameDuration = 1000 / 60;

const nodeButtons = nodes.map((node, index) => {
  const button = document.createElement("button");
  button.className = `node-label is-${node.kind} is-${node.status}`;
  if (node.url) button.classList.add("has-link");
  button.type = "button";
  button.dataset.id = node.id;
  const statusLabel = node.status === "live" ? ", работает" : node.status === "upcoming" ? ", скоро" : "";
  const linkLabel = node.internal ? "" : node.url ? ", открыть сайт" : "";
  button.setAttribute("aria-label", node.title ? `${node.title}${statusLabel}${linkLabel}` : `Проект ${index + 1}: название не указано`);
  button.innerHTML = `<span class="node-marker"><span class="node-aura" aria-hidden="true"></span><span class="node-dot"></span></span>${projectLabelsReady && node.title ? `<span class="node-text">${node.title}</span>` : ""}${node.status === "upcoming" ? '<span class="node-status" aria-hidden="true">скоро</span>' : ""}`;
  ["pointerenter", "focus"].forEach((eventName) => button.addEventListener(eventName, () => {
    twinklePlaceholder(button, node);
    setActiveNode(node.id, true);
  }));
  button.addEventListener("click", () => {
    if (Date.now() - mobileGraph.lastGestureAt < 260) return;
    twinklePlaceholder(button, node);
    if (node.internal) {
      if (parent !== window) parent.postMessage({type: "obratnaya:navigate", href: node.url}, location.origin);
      else location.assign(node.url);
      return;
    }
    if (!node.url) {
      mobileLinkArmedId = null;
      setActiveNode(node.id, true);
      return;
    }
    if (isCompact() && mobileLinkArmedId !== node.id) {
      mobileLinkArmedId = node.id;
      setActiveNode(node.id, true);
      return;
    }
    mobileLinkArmedId = null;
    window.open(node.url, "_blank", "noopener,noreferrer");
  });
  nodeLayer.append(button);
  return button;
});

function twinklePlaceholder(button, node) {
  if (reduceMotion || node.status !== "placeholder") return;
  button.classList.remove("is-twinkling");
  void button.offsetWidth;
  button.classList.add("is-twinkling");
  clearTimeout(button.twinkleTimer);
  button.twinkleTimer = setTimeout(() => button.classList.remove("is-twinkling"), 1450);
}

setActiveNode(activeNodeId);
resize();
addEventListener("resize", resize);
addEventListener("pointermove", (event) => {
  if (!isCompact() && !reduceMotion) {
    pointer.x = event.clientX / width - 0.5;
    pointer.y = event.clientY / height - 0.5;
  }
  moveGraphGesture(event);
});
addEventListener("pointerdown", beginGraphGesture);
addEventListener("pointerup", endGraphGesture);
addEventListener("pointercancel", endGraphGesture);
requestAnimationFrame(render);

function resize() {
  width = innerWidth;
  height = innerHeight;
  const budget = width < 720 ? 3_000_000 : 5_000_000;
  ratio = Math.max(1, Math.min(devicePixelRatio || 1, 1.25, Math.sqrt(budget / (width * height))));
  canvas.width = Math.round(width * ratio);
  canvas.height = Math.round(height * ratio);
  canvas.style.width = `${width}px`;
  canvas.style.height = `${height}px`;
  rebuildRoomCache();
  layoutGraph();
}

function rebuildRoomCache() {
  roomCanvas.width = canvas.width;
  roomCanvas.height = canvas.height;
  cachedRoomCtx.setTransform(ratio, 0, 0, ratio, 0, 0);
  const liveCtx = ctx;
  ctx = cachedRoomCtx;
  drawRoom(0, true);
  ctx = liveCtx;
}

function render(now) {
  requestAnimationFrame(render);
  frameAccumulator += Math.min(now - lastTick, 50);
  lastTick = now;
  if (frameAccumulator < targetFrameDuration - 0.1) return;

  const elapsed = reduceMotion ? 8 : (now - startTime) / 1000;
  const delta = Math.min(frameAccumulator / 1000, 0.05);
  frameAccumulator = Math.max(0, frameAccumulator - targetFrameDuration);
  pointer.easedX += (pointer.x - pointer.easedX) * Math.min(1, delta * 3.3);
  pointer.easedY += (pointer.y - pointer.easedY) * Math.min(1, delta * 3.3);

  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.drawImage(roomCanvas, 0, 0);
  ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
  drawScene(elapsed);
}

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

function drawRoom(time, staticScene = false) {
  const m = sceneMetrics(staticScene);
  if (darkTheme) {
    ctx.fillStyle = "#000";
    ctx.fillRect(0, 0, width, height);
    const glow = ctx.createRadialGradient(m.holeX, m.holeY, 0, m.holeX, m.holeY, width * .6);
    glow.addColorStop(0, "#171717"); glow.addColorStop(1, "#000");
    ctx.fillStyle = glow; ctx.fillRect(0, 0, width, height);
    return;
  }
  ctx.fillStyle = "#fbfaf7";
  ctx.fillRect(0, 0, width, height);

  const wall = ctx.createLinearGradient(0, 0, 0, m.horizon);
  wall.addColorStop(0, "#fdfcf9");
  wall.addColorStop(0.72, "#f8f6f2");
  wall.addColorStop(1, "#eeebe5");
  ctx.fillStyle = wall;
  ctx.fillRect(0, 0, width, m.horizon + 2);

  const vanishingX = m.vanishingX;
  const leftPlane = ctx.createLinearGradient(0, 0, vanishingX, 0);
  leftPlane.addColorStop(0, "rgba(221,216,207,.09)");
  leftPlane.addColorStop(0.7, "rgba(247,244,239,.025)");
  leftPlane.addColorStop(1, "rgba(255,255,255,.075)");
  ctx.fillStyle = leftPlane;
  ctx.beginPath();
  ctx.moveTo(0, 0); ctx.lineTo(vanishingX, 0); ctx.lineTo(vanishingX, m.horizon); ctx.lineTo(0, height); ctx.closePath();
  ctx.fill();

  const rightPlane = ctx.createLinearGradient(vanishingX, 0, width, 0);
  rightPlane.addColorStop(0, "rgba(255,255,255,.075)");
  rightPlane.addColorStop(0.72, "rgba(246,243,238,.02)");
  rightPlane.addColorStop(1, "rgba(218,213,204,.07)");
  ctx.fillStyle = rightPlane;
  ctx.beginPath();
  ctx.moveTo(width, 0); ctx.lineTo(vanishingX, 0); ctx.lineTo(vanishingX, m.horizon); ctx.lineTo(width, height); ctx.closePath();
  ctx.fill();

  const floor = ctx.createLinearGradient(0, m.horizon, 0, height);
  floor.addColorStop(0, "#ebe8e2");
  floor.addColorStop(0.56, "#f5f2ed");
  floor.addColorStop(1, "#faf8f4");
  ctx.fillStyle = floor;
  ctx.fillRect(0, m.horizon, width, height - m.horizon);

  // A soft tonal crease replaces the hard drawn corner from the first 2D
  // version. The old 3D room read as space because of light, not an outline.
  const creaseWidth = Math.max(18, width * 0.022);
  const cornerShade = ctx.createLinearGradient(vanishingX - creaseWidth, 0, vanishingX + creaseWidth, 0);
  cornerShade.addColorStop(0, "rgba(93,86,76,0)");
  cornerShade.addColorStop(0.46, "rgba(93,86,76,.018)");
  cornerShade.addColorStop(0.5, "rgba(93,86,76,.052)");
  cornerShade.addColorStop(0.54, "rgba(255,255,255,.055)");
  cornerShade.addColorStop(1, "rgba(255,255,255,0)");
  ctx.fillStyle = cornerShade;
  ctx.fillRect(vanishingX - creaseWidth, 0, creaseWidth * 2, m.horizon + 1);

  ctx.strokeStyle = `rgba(64,59,52,${width < 640 ? 0.085 : 0.11})`;
  ctx.lineWidth = width < 640 ? 0.55 : 0.7;
  ctx.beginPath(); ctx.moveTo(vanishingX, 0); ctx.lineTo(vanishingX, m.horizon); ctx.stroke();

  ctx.strokeStyle = `rgba(64,59,52,${width < 640 ? 0.12 : 0.16})`;
  ctx.lineWidth = width < 640 ? 0.65 : 0.85;
  ctx.beginPath();
  ctx.moveTo(0, m.perspectiveEdgeY);
  ctx.lineTo(vanishingX, m.horizon);
  ctx.lineTo(width, m.perspectiveEdgeY);
  ctx.stroke();

  const glow = ctx.createRadialGradient(width * 0.5, height * 0.3, 0, width * 0.5, height * 0.3, Math.max(width, height) * 0.7);
  glow.addColorStop(0, "rgba(255,255,255,.3)");
  glow.addColorStop(1, "rgba(255,255,255,0)");
  ctx.fillStyle = glow;
  ctx.fillRect(0, 0, width, height);

  drawWallHatching(m, vanishingX);

  // Fine deterministic grain keeps the paper/concrete character without a GPU texture.
  ctx.fillStyle = "rgba(38,34,29,.022)";
  for (let i = 0; i < 130; i += 1) {
    const x = (i * 197 + 37) % Math.max(1, width);
    const y = (i * 83 + Math.floor(time * 0.05)) % Math.max(1, height);
    ctx.fillRect(x, y, 1, 1);
  }
}

function drawWallHatching(m, vanishingX) {
  const halfWidth = Math.max(1, width * 0.5);
  const cornerGap = Math.max(30, width * 0.028);
  ctx.save();
  ctx.beginPath();
  ctx.rect(0, 0, width, m.horizon);
  ctx.clip();
  ctx.strokeStyle = `rgba(58,54,48,${width < 640 ? 0.07 : width < 1100 ? 0.085 : 0.105})`;
  ctx.lineWidth = width < 640 ? 0.55 : 0.64;
  ctx.lineCap = "round";
  const hatchCount = width < 640 ? 38 : width < 1100 ? 50 : 64;

  const strokeOnWall = (startX, startY, endX, endY, side) => {
    ctx.save();
    ctx.beginPath();
    ctx.rect(side === 0 ? 0 : vanishingX, 0, side === 0 ? vanishingX : width - vanishingX, m.horizon);
    ctx.clip();
    ctx.beginPath();
    ctx.moveTo(startX, startY);
    ctx.lineTo(endX, endY);
    ctx.stroke();
    ctx.restore();
  };

  for (let side = 0; side < 2; side += 1) {
    for (let index = 0; index < hatchCount; index += 1) {
      const seed = index + side * 41;
      const localX = ((seed * 83 + 29) % 997) / 997;
      const depth = ((seed * 47 + 13) % 991) / 991;
      const x = side === 0
        ? localX * vanishingX
        : vanishingX + localX * (width - vanishingX);
      const y = m.horizon * (0.16 + depth * 0.78);
      const distanceFromCorner = Math.abs(x - vanishingX) / halfWidth;
      const length = 14 + distanceFromCorner * 38 + (seed % 5) * 2.8;
      const direction = side === 0 ? 1 : -1;
      const rise = (2.2 + depth * 4.4) * direction;
      const endX = x + length * direction;
      const endY = y - rise;
      const reachesCorner = side === 0
        ? endX >= vanishingX - cornerGap
        : endX <= vanishingX + cornerGap;
      if (reachesCorner) continue;

      ctx.globalAlpha = 0.48 + (seed % 4) * 0.09;
      strokeOnWall(x, y, endX, endY, side);

      if (index % 7 === 0) {
        ctx.globalAlpha *= 0.58;
        strokeOnWall(
          x + 3 * direction,
          y + 3,
          x + (length * 0.68 + 3) * direction,
          y + 3 - rise * 0.68,
          side,
        );
      }
    }
  }
  ctx.restore();
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
    ctx.strokeStyle = darkTheme ? `rgba(220,220,216,${flowAlpha})` : `rgba(70,67,62,${flowAlpha})`;
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
  ctx.fillStyle = darkTheme ? "rgba(240,240,236,.92)" : "rgba(12,12,12,.92)";

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
      ctx.drawImage(image, -w * 0.68, -h * 0.68, w * 1.36, h * 1.36);
    }
    return;
  }

  if (item.kind === "digamma") {
    ctx.strokeStyle = darkTheme ? "rgba(240,240,236,.9)" : "rgba(12,12,12,.9)";
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
    ctx.strokeStyle = darkTheme ? "rgba(240,240,236,.92)" : "rgba(12,12,12,.92)";
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
    ctx.fillStyle = "#1c1a18";
    ctx.scale(-1, 1);
  }
  ctx.fillText(item.text, 0, 0);
}

function drawDust(time, m, behind) {
  ctx.fillStyle = darkTheme ? "rgba(235,235,230,.18)" : "rgba(62,57,50,.18)";
  particles.forEach((particle, index) => {
    const angle = particle.angle + time * particle.speed;
    const radiusPhase = ((time * 0.016 + index / particles.length) % 1);
    const radius = m.holeW * (1.7 - radiusPhase * 1.45);
    if ((Math.sin(angle) < 0) !== behind) return;
    const x = m.holeX + Math.cos(angle) * radius;
    const y = m.holeY + Math.sin(angle) * radius * 0.31 - (1 - radiusPhase) * particle.height * height * 0.16;
    ctx.globalAlpha = (1 - radiusPhase) * 0.52;
    ctx.beginPath(); ctx.arc(x, y, particle.size, 0, Math.PI * 2); ctx.fill();
  });
  ctx.globalAlpha = 1;
}

function ellipse(x, y, rx, ry, stroke = false) {
  ctx.beginPath(); ctx.ellipse(x, y, Math.max(0.1, rx), Math.max(0.1, ry), 0, 0, Math.PI * 2);
  stroke ? ctx.stroke() : ctx.fill();
}

function setActiveNode(id, revealDetails = false) {
  activeNodeId = id;
  const node = nodes.find((item) => item.id === id);
  const hasVisibleDetails = revealDetails && Boolean(node.description);
  infoTitle.textContent = node.title;
  infoCopy.replaceChildren(document.createTextNode(node.description));
  if (node.emphasis) {
    const emphasis = document.createElement("em");
    emphasis.textContent = node.emphasis;
    infoCopy.append(document.createTextNode(" "), emphasis);
  }
  infoPanel.hidden = !hasVisibleDetails;
  document.body.classList.toggle("has-mobile-selection", isCompact() && hasVisibleDetails);
  document.body.classList.toggle("has-active-details", hasVisibleDetails);
  nodeButtons.forEach((button) => button.classList.toggle("is-active", button.dataset.id === id));
  layoutGraph();
}

function layoutGraph() {
  if (!nodeButtons.length) return;
  const positions = new Map(nodes.map((node) => [node.id, graphPosition(node)]));
  const connected = new Set(edges.filter(([a, b]) => a === activeNodeId || b === activeNodeId).flat());
  nodes.forEach((node, index) => {
    nodeButtons[index].hidden = false;
    nodeButtons[index].classList.toggle("is-connected", connected.has(node.id));
  });
  applyNodePositions(positions);

  // Compact layouts have the same constellation on phones and tablets, but
  // labels have radically different real widths depending on the device font
  // metrics. Resolve the measured rectangles rather than guessing at a list of
  // breakpoints. This keeps titles inside the stage, apart from each other,
  // and clear of the event horizon.
  resolveCompactCollisions(positions);

  // Labels can wrap and dots use different visual sizes at each breakpoint.
  // Measure the rendered dot itself so every connection lands on its true
  // centre instead of relying on a desktop-sized magic offset.
  const anchors = new Map(nodes.map((node, index) => {
    const dotRect = nodeButtons[index].querySelector(".node-dot").getBoundingClientRect();
    return [node.id, {
      x: dotRect.left + dotRect.width * 0.5,
      y: dotRect.top + dotRect.height * 0.5,
    }];
  }));

  nodeLines.setAttribute("viewBox", `0 0 ${width} ${height}`);
  nodeLines.replaceChildren(...edges.map(([from, to], index) => {
    const a = anchors.get(from); const b = anchors.get(to);
    const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
    line.setAttribute("x1", a.x); line.setAttribute("y1", a.y);
    line.setAttribute("x2", b.x); line.setAttribute("y2", b.y);
    if (from === activeNodeId || to === activeNodeId) line.setAttribute("class", "is-lit");
    line.style.transitionDelay = isCompact() ? `${(index % 3) * 70}ms` : "0ms";
    return line;
  }));
  layoutDecorations();
  updateInfoObstructions();
}

function applyNodePositions(positions) {
  nodes.forEach((node, index) => {
    const position = positions.get(node.id);
    nodeButtons[index].style.transform = `translate(${position.x}px, ${position.y}px)`;
  });
}

function moveNodePosition(nodeId, positions, dx, dy) {
  const position = positions.get(nodeId);
  positions.set(nodeId, { x: position.x + dx, y: position.y + dy });
  applyNodePositions(positions);
}

function nodeVisualRect(button) {
  const parts = [button.querySelector(".node-marker"), button.querySelector(".node-text")].filter(Boolean);
  const rects = parts.map((part) => part.getBoundingClientRect());
  const left = Math.min(...rects.map((rect) => rect.left));
  const right = Math.max(...rects.map((rect) => rect.right));
  const top = Math.min(...rects.map((rect) => rect.top));
  const bottom = Math.max(...rects.map((rect) => rect.bottom));
  return { left, right, top, bottom, width: right - left, height: bottom - top };
}

function rectsOverlap(first, second, padding = 0) {
  return first.left < second.right + padding
    && first.right > second.left - padding
    && first.top < second.bottom + padding
    && first.bottom > second.top - padding;
}

function updateInfoObstructions() {
  nodeButtons.forEach((button) => button.classList.remove("is-obscured"));
  if (infoPanel.hidden) return;
  const panelRect = infoPanel.getBoundingClientRect();
  nodes.forEach((node, index) => {
    if (node.id === activeNodeId) return;
    if (rectsOverlap(nodeVisualRect(nodeButtons[index]), panelRect, 12)) {
      // A description is a foreground reading state. Do not let a neighbouring
      // title or dot cut through it; the point returns as soon as it closes.
      nodeButtons[index].classList.add("is-obscured");
    }
  });
}

function compactSafetyBounds() {
  if (width < 640) {
    const zone = constellationZone();
    return { left: 10, right: width - 10, top: zone.safeTop, bottom: zone.safeBottom };
  }
  return {
    left: 18,
    right: width - 18,
    top: Math.max(intro.getBoundingClientRect().bottom + 18, height * 0.19),
    bottom: sceneMetrics(true).perspectiveEdgeY - 18,
  };
}

function ellipseCorrection(rect, padding = 0) {
  const m = sceneMetrics(true);
  const centerX = rect.left + rect.width * 0.5;
  const centerY = rect.top + rect.height * 0.5;
  const rx = m.holeW * 0.72 + rect.width * 0.5 + padding;
  const ry = m.holeW * 0.245 + rect.height * 0.5 + padding;
  const dx = centerX - m.holeX;
  const dy = centerY - m.holeY;
  const distance = Math.hypot(dx / rx, dy / ry);
  if (distance >= 1) return null;
  const angle = distance > 0.001 ? Math.atan2(dy / ry, dx / rx) : -Math.PI / 2;
  return {
    x: m.holeX + Math.cos(angle) * rx - centerX,
    y: m.holeY + Math.sin(angle) * ry - centerY,
  };
}

function resolveCompactCollisions(positions) {
  if (width >= 1100) return;
  const bounds = compactSafetyBounds();
  const gap = width < 640 ? 7 : 10;

  // A short bounded relaxation makes this deterministic and avoids a moving
  // target during pointer/zoom gestures. Each movement is based on the actual
  // rendered button rectangle, including the label and its marker.
  for (let pass = 0; pass < 18; pass += 1) {
    let changed = false;
    nodes.forEach((node, index) => {
      const button = nodeButtons[index];
      const rect = nodeVisualRect(button);
      let dx = 0;
      let dy = 0;
      if (rect.left < bounds.left) dx += bounds.left - rect.left;
      if (rect.right > bounds.right) dx -= rect.right - bounds.right;
      if (rect.top < bounds.top) dy += bounds.top - rect.top;
      if (rect.bottom > bounds.bottom) dy -= rect.bottom - bounds.bottom;

      const dotCorrection = eventHorizonCorrection(button);
      if (dotCorrection) {
        dx += dotCorrection.x;
        dy += dotCorrection.y;
      }
      const label = button.querySelector(".node-text");
      if (label) {
        const labelCorrection = ellipseCorrection(label.getBoundingClientRect(), gap);
        if (labelCorrection) {
          dx += labelCorrection.x;
          dy += labelCorrection.y;
        }
      }
      if (Math.abs(dx) + Math.abs(dy) > 0.5) {
        moveNodePosition(node.id, positions, dx, dy);
        changed = true;
      }
    });

    for (let a = 0; a < nodes.length; a += 1) {
      for (let b = a + 1; b < nodes.length; b += 1) {
        const first = nodeVisualRect(nodeButtons[a]);
        const second = nodeVisualRect(nodeButtons[b]);
        const overlapX = Math.min(first.right, second.right) - Math.max(first.left, second.left);
        const overlapY = Math.min(first.bottom, second.bottom) - Math.max(first.top, second.top);
        if (overlapX + gap <= 0 || overlapY + gap <= 0) continue;

        const firstCenter = { x: first.left + first.width * 0.5, y: first.top + first.height * 0.5 };
        const secondCenter = { x: second.left + second.width * 0.5, y: second.top + second.height * 0.5 };
        const separateHorizontally = overlapX < overlapY || Math.abs(firstCenter.x - secondCenter.x) > Math.abs(firstCenter.y - secondCenter.y);
        const amount = (separateHorizontally ? overlapX : overlapY) / 2 + gap;
        const direction = separateHorizontally
          ? (firstCenter.x <= secondCenter.x ? -1 : 1)
          : (firstCenter.y <= secondCenter.y ? -1 : 1);
        moveNodePosition(nodes[a].id, positions, separateHorizontally ? direction * amount : 0, separateHorizontally ? 0 : direction * amount);
        moveNodePosition(nodes[b].id, positions, separateHorizontally ? -direction * amount : 0, separateHorizontally ? 0 : -direction * amount);
        changed = true;
      }
    }
    if (!changed) break;
  }
}

function eventHorizonCorrection(button) {
  const dotRect = button.querySelector(".node-dot").getBoundingClientRect();
  const dotX = dotRect.left + dotRect.width * 0.5;
  const dotY = dotRect.top + dotRect.height * 0.5;
  const m = sceneMetrics(true);
  // Extra room covers the pointer parallax on desktop and keeps a visible
  // breathing space between the marker and the black silhouette.
  const rx = m.holeW * 0.72 + dotRect.width * 0.5 + 24;
  const ry = m.holeW * 0.245 + dotRect.height * 0.5 + 18;
  const dx = dotX - m.holeX;
  const dy = dotY - m.holeY;
  const distance = Math.hypot(dx / rx, dy / ry);
  if (distance >= 1) return null;
  const angle = distance > 0.001 ? Math.atan2(dy / ry, dx / rx) : -Math.PI / 2;
  return {
    x: m.holeX + Math.cos(angle) * rx - dotX,
    y: m.holeY + Math.sin(angle) * ry - dotY,
  };
}

function graphPosition(node) {
  if (width >= 1100) return { x: width * desktopLayout[node.id].x, y: height * desktopLayout[node.id].y };
  if (width >= 640) {
    const p = desktopLayout[node.id];
    const cx = width * 0.5; const cy = height * 0.46;
    return { x: cx + (width * p.x - cx) * mobileGraph.scale + mobileGraph.offsetX, y: cy + (height * (0.16 + p.y * 0.6) - cy) * mobileGraph.scale + mobileGraph.offsetY };
  }
  const zone = constellationZone();
  if (height < 700) {
    const p = shortPhoneLayout[node.id];
    const centerX = width * 0.5;
    const centerY = zone.safeTop + zone.zoneHeight * 0.5;
    const rawX = width * p.x;
    const rawY = zone.safeTop + zone.zoneHeight * p.y;
    return {
      x: centerX + (rawX - centerX) * mobileGraph.scale + mobileGraph.offsetX,
      y: centerY + (rawY - centerY) * mobileGraph.scale + mobileGraph.offsetY,
    };
  }
  const layout = compactLayout[node.id];
  const radiusX = zone.radiusX * layout.radius * mobileGraph.scale;
  const radiusY = zone.radiusY * layout.radius * mobileGraph.scale;
  const angle = layout.angle * Math.PI / 180;
  return {
    x: width * 0.5 + Math.cos(angle) * radiusX + mobileGraph.offsetX,
    y: zone.centerY + Math.sin(angle) * radiusY + mobileGraph.offsetY,
  };
}

function constellationZone() {
  const safeTop = intro.getBoundingClientRect().bottom + Math.max(16, height * 0.022);
  const floorBoundary = sceneMetrics(true).perspectiveEdgeY;
  const safeBottom = width < 640
    ? Math.min(height * 0.61, floorBoundary - 18)
    : height * 0.62 - 26;
  const zoneHeight = Math.max(60, safeBottom - safeTop);
  const radiusY = Math.max(32, Math.min(zoneHeight / 2, width * 0.4)) * 0.95;
  const radiusX = width < 640 && height < 700
    ? Math.min(width * 0.32, Math.max(radiusY * 2.25, width * 0.3))
    : radiusY;
  return {
    safeTop,
    safeBottom,
    zoneHeight,
    centerY: safeTop + zoneHeight / 2 + Math.min(12, height * 0.015),
    radiusX,
    radiusY,
  };
}

function layoutDecorations() {
  constellationPoints.setAttribute("viewBox", `0 0 ${width} ${height}`);
  const elements = [];
  const zone = width < 640 ? constellationZone() : null;
  const center = zone
    ? { x: width * 0.5, y: zone.centerY, rx: zone.radiusX * 0.82, ry: zone.radiusY * 0.68 }
    : { x: width * 0.48, y: height * 0.52, rx: width * 0.29, ry: height * 0.18 };
  for (let i = 0; i < (width < 640 ? 34 : 42); i += 1) {
    const angle = -1.2 + i * 2.399963;
    const spread = 0.3 + (i % 8) / 10 + Math.sqrt((i + 1) / 42) * 0.32;
    const dot = document.createElementNS("http://www.w3.org/2000/svg", "circle");
    dot.setAttribute("cx", center.x + Math.cos(angle) * center.rx * spread);
    dot.setAttribute("cy", center.y + Math.sin(angle) * center.ry * spread);
    dot.setAttribute("r", 1 + (i % 4) * 0.35);
    dot.setAttribute("class", "constellation-dot"); elements.push(dot);
  }
  constellationPoints.replaceChildren(...elements);
}

function isCompact() { return width < 1100; }

function beginGraphGesture(event) {
  if (!isCompact() || event.pointerType !== "touch") return;
  mobileGraph.pointers.set(event.pointerId, { x: event.clientX, y: event.clientY });
  if (mobileGraph.pointers.size === 2) {
    const [a, b] = [...mobileGraph.pointers.values()];
    mobileGraph.pinchDistance = Math.hypot(b.x - a.x, b.y - a.y);
    mobileGraph.pinchScale = mobileGraph.scale;
  }
}

function moveGraphGesture(event) {
  const previous = mobileGraph.pointers.get(event.pointerId);
  if (!previous) return;
  const next = { x: event.clientX, y: event.clientY };
  mobileGraph.pointers.set(event.pointerId, next);
  if (mobileGraph.pointers.size === 1 && mobileGraph.scale > 1) {
    const limit = Math.min(width, height) * (mobileGraph.scale - 0.8) * 0.25;
    mobileGraph.offsetX = clamp(mobileGraph.offsetX + next.x - previous.x, -limit, limit);
    mobileGraph.offsetY = clamp(mobileGraph.offsetY + next.y - previous.y, -limit * 0.55, limit * 0.55);
  } else if (mobileGraph.pointers.size === 2) {
    const [a, b] = [...mobileGraph.pointers.values()];
    const distance = Math.hypot(b.x - a.x, b.y - a.y);
    mobileGraph.scale = clamp(mobileGraph.pinchScale * distance / Math.max(1, mobileGraph.pinchDistance), 1, 2.4);
    if (mobileGraph.scale <= 1.001) {
      mobileGraph.offsetX = 0;
      mobileGraph.offsetY = 0;
    } else {
      const limit = Math.min(width, height) * (mobileGraph.scale - 0.8) * 0.25;
      mobileGraph.offsetX = clamp(mobileGraph.offsetX, -limit, limit);
      mobileGraph.offsetY = clamp(mobileGraph.offsetY, -limit * 0.55, limit * 0.55);
    }
  }
  mobileGraph.lastGestureAt = Date.now();
  layoutGraph();
}

function endGraphGesture(event) {
  mobileGraph.pointers.delete(event.pointerId);
  if (mobileGraph.pointers.size < 2) mobileGraph.pinchDistance = 0;
}

function clamp(value, min, max) { return Math.max(min, Math.min(max, value)); }
function smoothstep(min, max, value) {
  const x = clamp((value - min) / (max - min), 0, 1);
  return x * x * (3 - 2 * x);
}
