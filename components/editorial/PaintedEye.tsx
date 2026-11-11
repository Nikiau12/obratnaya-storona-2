import { useId } from "react";
import s from "./EditorialStudy.module.css";

// The original MoMA reproduction stays intact. The SVG only clips its visible
// area to the painted eyelids, so both site themes show the same colours.
export function PaintedEye() {
  const clipId = useId();

  return <svg viewBox="0 150 2000 1100" fill="none" aria-hidden="true">
    <defs>
      <clipPath id={clipId}>
        <path className={s.paintedAperture} d="M18 706C18 650 88 610 151 584C375 255 680 170 1015 184C1390 186 1770 363 1984 608C2010 664 1920 734 1775 840C1570 1000 1280 1204 996 1225C660 1260 348 1100 170 860C85 800 10 782 18 706Z" />
      </clipPath>
    </defs>
    <image href="/art/magritte-the-false-mirror.jpg" width="2000" height="1345" clipPath={`url(#${clipId})`} />
  </svg>;
}
