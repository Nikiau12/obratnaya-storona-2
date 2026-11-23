import { useId } from "react";
import { shalashTitleLines, type SketchImage } from "@/lib/sketch-feature";

// Coordinates follow the mask in the existing 300 × 470 cover crop.
const maskEdge = "M109 151C134 150 157 142 184 139C215 141 248 150 266 171L271 201 258 238 253 276 238 319 224 369 207 394 173 408C157 411 147 400 140 388C119 363 111 332 105 302L96 263 93 221 83 205 101 199Z";
const maskCuts = [
  { edge: "M67 125H284V197L159 243 74 221Z", placement: "translate(-4 -4) rotate(-5 181 225)" },
  { edge: "M74 221L159 243 283 197V291L176 312 91 339Z", placement: "translate(5 2)" },
  { edge: "M89 339L176 312 281 291V424H81Z", placement: "translate(-4 5) rotate(4 189 323)" },
];

export function CollagePortrait({ image }: { image: SketchImage }) {
  const id = useId();
  if (!image.viewport) return <img src={image.src} alt={image.alt ?? ""} width={image.width} height={image.height} />;
  const [x, y] = image.viewport;
  return <svg viewBox="-15 -14 1480 1120" width="1480" height="1120" aria-hidden="true" focusable="false">
    <defs>
      <clipPath id={id + "mask"}><path d={maskEdge} /></clipPath>
      <g id={id + "face"} clipPath={`url(#${id}mask)`}>
        <image href={image.src} x={-x} y={-y} width={image.sourceWidth} height={image.sourceHeight} />
      </g>
      {maskCuts.map(({edge}, i) =>
        <clipPath key={edge} id={id + "cut" + i}><path d={edge} /></clipPath>
      )}
    </defs>
    <image href="/art/tree-acrobat.webp" width="1448" height="1086" />
    <g transform="translate(467 60) scale(1.09)">
      {maskCuts.map(({edge, placement}, i) =>
        <g key={edge} transform={placement}><g clipPath={`url(#${id}cut${i})`}><use href={`#${id}face`} /></g></g>
      )}
    </g>
  </svg>;
}

// Cuts follow the seams of the supplied photograph in its 720 × 480 coordinate space.
const printerParts = {
  lid: "M40 -7H670V156L582 173 193 202 47 122Z M171 75L500 52 489 104 197 130Z",
  rollers: "M170 74L503 51 490 104 194 131Z",
  leftPanel: "M45 119L196 201 198 474H41Z",
  rightPanel: "M583 168L659 150 657 310 580 320Z",
  front: "M194 201L582 166 579 237 553 264 223 301 222 355 196 361Z",
  tray: "M196 358L220 355 248 417 294 430 296 436 625 394 562 325 562 309 582 322 649 309 636 432 244 480 194 467Z",
};

export function CollagePrinter({ image }: { image: SketchImage }) {
  const id = useId();
  const print = "#" + id + "photo";
  const cut = (part: keyof typeof printerParts) => `url(#${id}${part})`;

  return <svg viewBox="-54 -211 840 817" width="840" height="817" aria-hidden="true" focusable="false">
    <defs>
      <image id={id + "photo"} href={image.src} width="720" height="480" />
      {Object.entries(printerParts).map(([name, d]) =>
        <clipPath key={name} id={id + name}><path d={d} clipRule="evenodd" /></clipPath>
      )}
    </defs>

    {/* Loose stock fans out behind the exposed mechanism. */}
    <g stroke="#9b9891" strokeWidth="1.5" strokeLinejoin="round">
      <path fill="#f1efea" d="M273 168C212 67 117 32 49 -51L172 -130C209 -82 277 -27 338 66L358 142Z"/>
      <path fill="#fff" d="M315 140C279 54 224 -19 205 -138L407 -183C406 -76 389 33 401 117Z"/>
      <path fill="#f2f1ed" d="M384 134C405 38 472 -62 516 -133L665 -70C600 -18 525 66 497 154Z"/>
      <path fill="#fff" d="M436 152C509 74 617 28 676 -24L723 88C661 122 572 135 512 174Z"/>
      <path fill="#dad7d0" d="M172 -130L160 -98 139 -108Z M406 -183L388 -153 365 -173Z"/>
    </g>

    <g transform="translate(-45 -56) rotate(-12 204 97)" clipPath={cut("lid")}><use href={print}/></g>
    <g transform="translate(20 21) rotate(8 340 88)" clipPath={cut("rollers")}><use href={print}/></g>
    <g transform="translate(-53 21) rotate(10 145 256)" clipPath={cut("leftPanel")}><use href={print}/></g>
    <g transform="translate(60 -7) rotate(-12 606 243)" clipPath={cut("rightPanel")}><use href={print}/></g>
    <g transform="translate(67 30) rotate(8 424 402)" clipPath={cut("tray")}><use href={print}/></g>

    {/* The strip curves out of the slot and folds toward the reader. */}
    <path fill="#eae8e3" stroke="#9b9891" strokeWidth="1.4"
      d="M223 291L521 254C540 305 569 353 624 392L313 436C286 378 246 337 223 291Z"/>
    <g transform="matrix(1 -.14 .34 .97 312 435)">
      <path fill="#fffefa" stroke="#aaa7a0" strokeWidth="1.4"
        d="M0 0L312 0 319 166Q238 163 174 169T5 170Q10 97 0 0Z"/>
      <text fill="#211e1b" x="21" y="42" fontSize="26" fontWeight="500">
        {shalashTitleLines.map((line, i) =>
          <tspan key={line} x="21" fontSize={i === 0 ? 34 : undefined} dy={i === 0 ? 0 : 32}>{line}</tspan>
        )}
      </text>
    </g>
    <g clipPath={cut("front")}><use href={print}/></g>
  </svg>;
}
