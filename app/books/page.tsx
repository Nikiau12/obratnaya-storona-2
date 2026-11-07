import { SketchShowcase } from "@/components/sketch/Showcase";
import { publishers } from "@/lib/publishers";
export const metadata={title:"Витрина — Обратная сторона"};
export default async function Page({searchParams}:{searchParams:Promise<{publisher?:string;q?:string;sort?:string}>}){const params=await searchParams;return <SketchShowcase initialPublisher={publishers.some(p=>p.slug===params.publisher)?params.publisher:""} initialQuery={typeof params.q==="string"?params.q:""} initialSort={params.sort==="reverse"?"reverse":"order"}/>;}
