import { useId } from "react";
import type { SketchFeature } from "@/lib/sketch-feature";
import { DrawnObject } from "./Objects";
import s from "./Sketch.module.css";

export function FeatureVisual({feature}:{feature:SketchFeature}) {
 const clipId=useId();
 const image=feature.image;
 if(image?.viewport){const [x,y,w,h]=image.viewport;return <svg className={s.editorialImage} viewBox={`${x} ${y} ${w} ${h}`} width={w} height={h} aria-hidden="true" focusable="false">
  {image.clipPath&&<defs><clipPath id={clipId}><path d={image.clipPath}/></clipPath></defs>}
  <image href={image.src} width={image.sourceWidth} height={image.sourceHeight} clipPath={image.clipPath?`url(#${clipId})`:undefined}/>
 </svg>;}

 if(feature.image)return <img className={s.editorialImage} src={feature.image.src} width={feature.image.width} height={feature.image.height} alt={feature.image.alt??""}/>;
 if(feature.isClientDraft)return null;
 return <DrawnObject kind={feature.kind}/>;
}
