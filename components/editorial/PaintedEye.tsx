"use client";

import { useEffect, useId, useState } from "react";

const openEye = "M18 706C18 650 88 610 151 584C375 255 680 170 1015 184C1390 186 1770 363 1984 608C2010 664 1920 734 1775 840C1570 1000 1280 1204 996 1225C660 1260 348 1100 170 860C85 800 10 782 18 706Z";
const closedEye = "M18 706C18 704 88 703 151 702C375 699 680 700 1015 702C1390 704 1770 703 1984 706C2010 708 1920 709 1775 710C1570 712 1280 712 996 710C660 708 348 708 170 706C85 706 10 707 18 706Z";
const blinkValues = [
  openEye, openEye, closedEye, closedEye, openEye,
  openEye, closedEye, closedEye, openEye,
  openEye, closedEye, closedEye, openEye,
  openEye, closedEye, closedEye, openEye,
  openEye, closedEye, closedEye, openEye, openEye,
].join(";");
const blinkKeyTimes = "0;0.16;0.1645;0.166;0.174;0.32;0.3245;0.326;0.334;0.54;0.5445;0.546;0.554;0.72;0.7245;0.726;0.734;0.96;0.9645;0.966;0.974;1";

// The original MoMA reproduction stays intact. The SVG only clips its visible
// area to the painted eyelids, so both site themes show the same colours.
export function PaintedEye() {
  const clipId = useId();
  const [motionEnabled, setMotionEnabled] = useState(false);

  useEffect(() => {
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setMotionEnabled(!preference.matches);
    update();
    preference.addEventListener("change", update);
    return () => preference.removeEventListener("change", update);
  }, []);

  return <svg viewBox="0 150 2000 1100" fill="none" aria-hidden="true">
    <defs>
      <clipPath id={clipId}>
        <path d={openEye}>
          {motionEnabled && <animate attributeName="d" values={blinkValues} keyTimes={blinkKeyTimes} dur="24s" repeatCount="indefinite" calcMode="linear" />}
        </path>
      </clipPath>
    </defs>
    <image href="/art/magritte-the-false-mirror.jpg" width="2000" height="1345" clipPath={`url(#${clipId})`} />
  </svg>;
}
