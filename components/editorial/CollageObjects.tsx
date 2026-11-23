import { useId } from "react";
import { shalashTitleLines, type SketchImage } from "@/lib/sketch-feature";

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
      <image href="/art/printer-feed-paper.webp" x="136" y="-56" width="234" height="156"
        clipPath={`url(#${id}feed)`} />
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
