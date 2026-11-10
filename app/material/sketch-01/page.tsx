import {sketchFeature} from "@/lib/sketch-feature";
import { SketchPublicationPage } from "@/components/sketch/FeaturePages";
export const metadata = { title: sketchFeature.materialTitle+" — Обратная сторона", robots: { index: false, follow: true } };
export default function Page() { return <SketchPublicationPage />; }
