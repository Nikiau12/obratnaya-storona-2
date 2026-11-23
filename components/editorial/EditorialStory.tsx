import Link from "next/link";
import type { ReactNode } from "react";
import type { SketchFeature } from "@/lib/sketch-feature";
import { FeatureVisual } from "../sketch/FeatureVisual";
import s from "./EditorialStudy.module.css";

type StoryProps = {
  feature: SketchFeature;
  className?: string;
  placement?: string;
  artwork?: ReactNode;
};

export function EditorialStory({ feature, className = "", placement, artwork }: StoryProps) {
  const variant = placement ?? [s.lead, s.dreams, s.reviews, s.press, s.map][feature.index];
  return <article className={`${s.story} ${variant} ${className}`} data-story={feature.index}>
    <Link href={feature.materialHref}>
      {feature.image && <div className={s.visual}>{artwork ?? <FeatureVisual feature={feature} />}</div>}
      <h2><span>{feature.materialTitle}</span></h2>
    </Link>
  </article>;
}
