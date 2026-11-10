import { useId, type CSSProperties } from "react";
import s from "./Sketch.module.css";

// Animated adaptation of src/main.js in the business-card repository:
// the floor-plane ellipse, four horizons and original cutout assets.
export function CardHole() {
  const shadow = useId();
  return <svg className={s.cardHole} viewBox="0 0 320 220" aria-hidden="true" focusable="false">
    <defs><radialGradient id={shadow}><stop stopColor="#000" stopOpacity=".85"/><stop offset=".58" stopColor="#000" stopOpacity=".6"/><stop offset="1" stopColor="#000" stopOpacity="0"/></radialGradient></defs>
    <g className={s.holeRings} fill="none" stroke="currentColor">
      <ellipse cx="150" cy="166" rx="138" ry="47" opacity=".035" strokeWidth="7"/>
      <ellipse cx="150" cy="166" rx="118" ry="40" opacity=".05" strokeWidth="6"/>
      <ellipse cx="150" cy="166" rx="101" ry="34" opacity=".07" strokeWidth="5"/>
      <ellipse cx="150" cy="166" rx="90" ry="30" opacity=".09" strokeWidth="3"/>
    </g>
    <ellipse cx="150" cy="166" rx="87" ry="40" fill={`url(#${shadow})`}/>
    <ellipse cx="150" cy="166" rx="56" ry="19" fill="#000"/>
    <g className={s.fallingObject} style={{"--fall-x":"64px","--fall-y":"71px","--fall-turn":"-18deg","--fall-delay":"0s"} as CSSProperties}><image href="/card/assets/object-stone.webp" x="67" y="76" width="39" height="39" transform="rotate(-18 86 95)"/></g>
    <g className={s.fallingObject} style={{"--fall-x":"-77px","--fall-y":"110px","--fall-turn":"26deg","--fall-delay":"-4.5s"} as CSSProperties}><image href="/card/assets/object-scissors.webp" x="195" y="34" width="64" height="45" transform="rotate(24 227 56)"/></g>
    <g className={s.fallingObject} style={{"--fall-x":"8px","--fall-y":"110px","--fall-turn":"-16deg","--fall-delay":"-9s"} as CSSProperties}><image href="/card/assets/object-cyclo-person.webp" x="125" y="27" width="35" height="58" transform="rotate(-12 142 56)"/></g>
    <g className={s.fallingObject} style={{"--fall-x":"-40px","--fall-y":"41px","--fall-turn":"35deg","--fall-delay":"-13.5s"} as CSSProperties}><image href="/card/assets/object-paper-flat-v4.webp" x="176" y="107" width="28" height="36" transform="rotate(21 190 125)"/></g>
  </svg>;
}

export function RoomLines() {
  return <svg className={s.roomLines} viewBox="0 0 320 220" aria-hidden="true" focusable="false">
    <path d="M150 0V104M0 140L150 104L320 145" fill="none" stroke="currentColor" vectorEffect="non-scaling-stroke"/>
  </svg>;
}
