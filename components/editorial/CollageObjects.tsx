import { useId } from "react";
import { shalashTitleLines, type SketchImage } from "@/lib/sketch-feature";

export function FoldedPortrait() {
  const fold = useId();
  // Tree cutout from Dalí's The Persistence of Memory: https://www.moma.org/collection/works/79018
  // The foreground sliver passes over the back of the fold and disappears beneath the temple.
  const tree = <image href="/art/memory-tree.webp" width="750" height="538.5" />;
  return <svg viewBox="32 17 668 514" width="668" height="514" aria-hidden="true" focusable="false">
    <defs>
      <clipPath id={fold}><path d="M378 165H413Q417 174 417 185L378 192Z" /></clipPath>
    </defs>
    {tree}
    <image href="/art/folded-masked-face.webp" x="357" y="122" width="329" height="298.75" />
    <g clipPath={`url(#${fold})`}>{tree}</g>
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
