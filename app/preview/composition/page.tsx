import {CompositionStudy} from "@/components/sketch/CompositionStudy";
export default async function Page({searchParams}:{searchParams:Promise<{variant?:string}>}){const {variant}=await searchParams;return <CompositionStudy initialVariant={variant==="roomier"?"roomier":"current"}/>;}
