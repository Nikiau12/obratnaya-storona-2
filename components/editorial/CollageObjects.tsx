import { useId } from "react";
import type { SketchImage } from "@/lib/sketch-feature";

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
  return <svg viewBox="40 32 555 510" width="555" height="510" aria-hidden="true" focusable="false">
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

    <path fill={`url(#${id}foil)`} d="M122 248L304 100 427 165 356 355 209 427 155 383Z" />
    <g clipPath={`url(#${id}woodcut)`}>
      <image href="/katya/engraving.png" x="-85" y="145" width="442" height="365" />
    </g>
    <path fill={`url(#${id}grain)`} d="M167 337L343 299 499 373 426 446 247 425Z" />
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
    <g transform="rotate(-8 226 137) translate(-8 -8)" clipPath={`url(#${id}lid)`}><use href={`#${id}print`} /></g>
    <g transform="rotate(4 239 191) translate(5 6)" clipPath={`url(#${id}body)`}><use href={`#${id}print`} /></g>
  </svg>;
}
