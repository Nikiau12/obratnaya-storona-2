import { useId } from "react";
import type { SketchImage } from "@/lib/sketch-feature";

type Point = readonly [number, number];
type Sweep = {
  curve: readonly [Point, Point, Point, Point];
  breadth: number;
  rows: number;
  marks: number;
};

// Short, broken strokes follow the tangent of each sweep. Batch by pigment so
// the field stays static and adds only a handful of SVG nodes to the page.
const sweeps: Sweep[] = [
  { curve: [[10, 395], [68, 376], [38, 144], [215, 119]], breadth: 61, rows: 11, marks: 25 },
  { curve: [[174, 122], [340, 23], [490, 231], [622, 129]], breadth: 76, rows: 14, marks: 31 },
  { curve: [[553, 150], [735, 119], [627, -20], [556, 62]], breadth: 44, rows: 9, marks: 20 },
  { curve: [[562, 53], [500, 132], [637, 130], [604, 74]], breadth: 29, rows: 5, marks: 12 },
  { curve: [[85, 425], [223, 336], [430, 558], [613, 383]], breadth: 65, rows: 10, marks: 32 },
];

const pigments = ["#17365a", "#325778", "#668594", "#9dad9c", "#c7b979", "#e4c677"];

function paint(sweep: Sweep) {
  const paths = pigments.map(() => "");
  const [a, b, c, d] = sweep.curve;
  for (let row = 0; row < sweep.rows; row++) {
    for (let mark = 0; mark < sweep.marks; mark++) {
      const phase = row * 1.79 + mark * 2.39;
      const t = (mark + .5 + .33 * Math.sin(phase)) / sweep.marks;
      const s = 1 - t;
      const x = s ** 3 * a[0] + 3 * s * s * t * b[0] + 3 * s * t * t * c[0] + t ** 3 * d[0];
      const y = s ** 3 * a[1] + 3 * s * s * t * b[1] + 3 * s * t * t * c[1] + t ** 3 * d[1];
      const dx = 3 * (s * s * (b[0] - a[0]) + 2 * s * t * (c[0] - b[0]) + t * t * (d[0] - c[0]));
      const dy = 3 * (s * s * (b[1] - a[1]) + 2 * s * t * (c[1] - b[1]) + t * t * (d[1] - c[1]));
      const speed = Math.hypot(dx, dy);
      const nx = -dy / speed, ny = dx / speed;
      const offset = sweep.breadth * ((row + .5) / sweep.rows - .5) + 2 * Math.sin(phase);
      const length = (.42 + .29 * (1 + Math.sin(phase + row))) / sweep.marks;
      const px = Math.round(x + nx * offset), py = Math.round(y + ny * offset);
      const hue = Math.round((pigments.length - 1) * (.5 + .5 * Math.sin(row * .78 + t * 2.4 + .32 * Math.sin(phase))));
      paths[hue] += `M${px} ${py}q${Math.round(dx * length * .5 + nx)} ${Math.round(dy * length * .5 + ny)} ${Math.round(dx * length)} ${Math.round(dy * length)}`;
    }
  }
  return paths;
}

const brushwork = sweeps.map(paint);
const portraitFacets = [
  { edge: "M-8 -12H316V107L174 159 24 177Z", placement: "rotate(-11 128 172) translate(-8 -7)" },
  { edge: "M-10 176L176 151 148 286 216 473H-10Z", placement: "translate(-14 10) rotate(6 120 280)" },
  { edge: "M175 145L315 100V257L152 292Z", placement: "translate(17 -1) rotate(-5 200 225)" },
  { edge: "M149 289L314 254V481H209Z", placement: "translate(10 12) rotate(3 190 320)" },
];

export function CollagePortrait({ image }: { image: SketchImage }) {
  const id = useId();
  if (!image.viewport || !image.clipPath) return <img src={image.src} alt={image.alt ?? ""} width={image.width} height={image.height} />;
  const [x, y] = image.viewport;
  return <svg viewBox="0 0 720 542" width="720" height="542" aria-hidden="true" focusable="false">
    <defs>
      <clipPath id={id + "silhouette"}><path d={image.clipPath} /></clipPath>
      <g id={id + "face"} transform={`translate(${-x} ${-y})`}>
        <image href={image.src} width={image.sourceWidth} height={image.sourceHeight} clipPath={`url(#${id}silhouette)`} />
      </g>
      {portraitFacets.map(({edge}, i) => <clipPath key={edge} id={id + "cut" + i}><path d={edge} /></clipPath>)}
      <pattern id={id + "grain"} patternUnits="userSpaceOnUse" width="306" height="226" viewBox="914 487 191 141">
        <image href={image.src} width={image.sourceWidth} height={image.sourceHeight} />
      </pattern>
      <pattern id={id + "foil"} patternUnits="userSpaceOnUse" width="196" height="144" viewBox="369 254 173 96" preserveAspectRatio="xMidYMid slice">
        <image href="/katya/gold.png" width="1536" height="1024" />
      </pattern>
      <clipPath id={id + "woodcut"}><path d="M58 306L191 186 245 223 147 371 68 386Z" /></clipPath>
    </defs>

    <path fill="#244461" d="M42 355C95 336 78 172 189 115C318 47 447 188 542 164C629 142 651 91 614 69C668 79 659 153 587 184C438 250 331 144 246 183C155 219 163 347 64 405Z" />
    <path fill={`url(#${id}foil)`} d="M122 248L304 100 427 165 356 355 209 427 155 383Z" />
    <g clipPath={`url(#${id}woodcut)`}>
      <image href="/katya/engraving.png" x="-85" y="145" width="442" height="365" />
    </g>
    <path fill={`url(#${id}grain)`} d="M167 337L343 299 499 373 426 446 247 425Z" />
    <path fill="#bca775" d="M185 425L347 374 495 418 344 477 222 468Z" />
    <g fill="none" strokeLinecap="round">
      {pigments.map((color, i) =>
        <path key={color} d={brushwork.map(sweep => sweep[i]).join("")} stroke={color} strokeWidth={i === 1 || i === 4 ? 3.3 : 2} />
      )}
    </g>
    <g transform="translate(187 67) scale(.89)">
      {portraitFacets.map(({edge, placement}, i) =>
        <g key={edge} transform={placement}><g clipPath={`url(#${id}cut${i})`}><use href={`#${id}face`}/></g></g>
      )}
    </g>
  </svg>;
}

// The lid and the body are cuts of the same photograph, seen on two axes.
export function CollagePrinter({ image }: { image: SketchImage }) {
  const id = useId();
  return <svg viewBox="0 0 520 350" width="520" height="350" aria-hidden="true" focusable="false">
    <defs>
      <image id={id + "print"} href={image.src} x="40" y="14" width="430" height="287" />
      <clipPath id={id + "lid"}><path d="M0 0H505V98L99 149 0 157Z" /></clipPath>
      <clipPath id={id + "body"}><path d="M0 160L99 151 505 99V356H0Z" /></clipPath>
    </defs>
    <path fill="#294861" d="M33 202L287 128 430 211 182 306 65 268Z" />
    <path fill="#c6af78" d="M135 266L376 169 479 247 199 307Z" />
    <g transform="translate(-36 25) scale(.75 .6)" fill="none" strokeLinecap="round" strokeWidth="2.5">
      {brushwork[4].map((path, i) => <path key={pigments[i]} d={path} stroke={pigments[i]} />)}
    </g>
    <g transform="rotate(-8 226 137) translate(-8 -8)" clipPath={`url(#${id}lid)`}><use href={`#${id}print`} /></g>
    <g transform="rotate(4 239 191) translate(5 6)" clipPath={`url(#${id}body)`}><use href={`#${id}print`} /></g>
  </svg>;
}
