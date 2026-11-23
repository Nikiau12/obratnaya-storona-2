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

// Keep the original two photo cuts. The loose stock follows the lid, and the
// ink follows the existing sheet in the tray when the body is rotated.
export function CollagePrinter({ image }: { image: SketchImage }) {
  const id = useId();
  const photo = "#" + id + "print";
  return <svg viewBox="0 -78 520 428" width="520" height="428" aria-hidden="true" focusable="false">
    <defs>
      <image id={id + "print"} href={image.src} x="40" y="14" width="430" height="287" />
      <clipPath id={id + "lid"}><path d="M0 0H505V98L99 149 0 157Z" /></clipPath>
      <clipPath id={id + "body"}><path d="M0 160L99 151 505 99V356H0Z" /></clipPath>
      <clipPath id={id + "feed"}><path d="M60 -85H430V66L156 91H60Z" /></clipPath>
    </defs>
    <g transform="rotate(-8 226 137) translate(-8 -8)">
      <use href={photo} clipPath={`url(#${id}lid)`} />
      <g clipPath={`url(#${id}feed)`} stroke="#96958f" strokeWidth="1" strokeLinejoin="round">
        <path fill="#efefec" d="M181 97C179 70 165 25 144 2L224 -27C240 13 249 49 251 94Z" />
        <path fill="#f5f4f0" d="M224 93C249 50 277 13 290 -21L362 -1C342 32 330 61 318 87Z" />
        <path fill="#fff" d="M204 95C201 58 204 7 198 -45L285 -50C289 -1 276 54 273 90Z" />
      </g>
    </g>
    <g transform="rotate(4 239 191) translate(5 6)" clipPath={`url(#${id}body)`}>
      <use href={photo} />
      <text transform="translate(178 194) rotate(-7.7)" fill="#24211f" fontSize="14" fontWeight="500">
        {shalashTitleLines.map((line, i) =>
          <tspan key={line} x={13 + i * 8} y={16 + i * 16} fontSize={i === 0 ? 17 : undefined}>{line}</tspan>
        )}
      </text>
    </g>
  </svg>;
}
