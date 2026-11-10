import {sketchBooks} from "@/lib/sketch-feature";
import { SketchBookPage } from "@/components/sketch/FeaturePages";
export const metadata = { title: sketchBooks[0].title+" — Обратная сторона", robots: { index: false, follow: true } };
export default function Page() { return <SketchBookPage />; }
