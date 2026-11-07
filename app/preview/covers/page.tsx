import {Cover} from "@/components/sketch/Cover";
import s from "@/components/sketch/Sketch.module.css";
const sizes=[[500,900],[720,720],[1000,600],[400,1200]];
export default function Page(){return <main className={s.page}><h1>Форматы обложек</h1><div className={s.bookGrid} style={{marginTop:60}}>{sizes.map(([width,height],index)=><div key={index} className={s.coverStage}><Cover book={{title:"",index,image:{src:`/sketch/covers/format-${index+1}.svg`,width,height,alt:`Формат обложки ${width} на ${height}`}}}/></div>)}</div></main>;}
