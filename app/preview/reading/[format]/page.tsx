import Link from "next/link";
import {notFound} from "next/navigation";
import {readingPreviews,formatNames} from "@/lib/sketch-previews";
import {SketchPublicationPage} from "@/components/sketch/FeaturePages";
import s from "@/components/sketch/FeaturePages.module.css";
export function generateStaticParams(){return readingPreviews.map(f=>({format:f.format}));}
export default async function Page({params}:{params:Promise<{format:string}>}){const {format}=await params;const feature=readingPreviews.find(f=>f.format===format);if(!feature)notFound();return <><nav className={s.templateNav} aria-label="Макеты публикаций">{readingPreviews.map(f=><Link key={f.format} href={`/preview/reading/${f.format}`} aria-current={format===f.format?"page":undefined}>{formatNames[f.format]}</Link>)}</nav><SketchPublicationPage feature={feature}/></>;}
