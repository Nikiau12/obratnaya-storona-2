import type { CSSProperties } from "react";
import s from "./Sketch.module.css";

export type ObjectKind = "spider" | "cube" | "cloud" | "cup" | "eye" | "wave" | "flower" | "stone";

export function DrawnObject({ kind }: { kind: ObjectKind }) {
  return <svg viewBox="0 0 240 200" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className={s.drawing}>
    {kind === "spider" && <g transform="rotate(-12 120 100)"><path d="M110 72C69 64 55 92 68 125C81 155 136 170 158 146C184 116 160 82 130 76"/><path d="M108 76C81 55 104 29 126 37C149 42 154 63 134 79M105 39L91 23L95 12M135 40L155 23L152 11M72 93L43 79L22 91M66 112L34 113L15 132M80 137L55 158L55 178M154 92L187 75L207 86M170 112L199 109L223 129M158 141L183 155L187 181"/><circle cx="117" cy="54" r="3" fill="currentColor"/><circle cx="133" cy="58" r="3" fill="currentColor"/><path d="M84 101L105 83L86 122L125 88L105 143L147 100L128 152L157 120" strokeWidth="2"/></g>}
    {kind === "cube" && <g transform="rotate(5 120 100)"><path d="M55 67L155 46L188 70L88 94Z M55 67L58 155L88 178L88 94M88 178L187 148L188 70 M58 155L151 127L155 46"/><path d="M61 71L62 151M93 100L94 170M98 92L180 72M162 51L185 68" opacity=".4"/><path d="M106 158L172 139M107 149L175 131M106 141L174 122" opacity=".5"/></g>}
    {kind === "cloud" && <><path d="M50 139C10 144 9 106 42 97C13 74 40 43 74 58C68 19 120 19 127 50C149 19 189 43 180 70C219 57 245 95 207 114C243 143 204 169 177 148C155 182 114 168 107 149C84 170 49 166 50 139Z"/><path d="M66 70C61 65 56 64 50 66M133 57C144 46 154 48 159 55M181 88C194 84 205 91 205 98" opacity=".5"/></>}
    {kind === "cup" && <><path d="M30 79C64 86 142 88 182 73C180 117 153 149 110 150C68 145 41 120 30 79ZM182 88C214 64 238 103 211 119L170 128M74 151C99 160 132 158 153 147M22 165C64 178 158 178 197 157"/><path d="M31 79C80 66 137 66 182 73M68 31C53 48 87 44 71 61M113 23C97 40 128 41 112 59M149 33C137 43 160 49 147 59"/></>}
    {kind === "eye" && <g className={s.eyeLid}><path d="M18 117C65 37 161 38 224 102C153 162 80 172 18 117Z"/><path d="M32 98L19 78M49 80L39 56M73 66L69 41M101 59L102 30M132 58L139 32M160 65L173 41M190 81L206 61"/><ellipse cx="121" cy="104" rx="29" ry="33"/><ellipse cx="125" cy="103" rx="12" ry="20" fill="currentColor"/><path d="M26 126C80 170 157 169 219 111" opacity=".4"/></g>}
    {kind === "wave" && <>{[0,1,2,3,4,5,6,7,8,9,10,11].map(i=><path key={i} d={`M${37+i*15} ${(94-Math.sin(i*.67)*43).toFixed(2)}Q${30+i*15} 98 ${37+i*15} ${(116+Math.sin(i*.67)*43).toFixed(2)}`} strokeWidth={i%3===0?3:1.5}/>)}</>}
    {kind === "flower" && <><path d="M111 104C64 93 46 60 67 45C88 29 108 56 118 76C108 31 125 12 144 26C159 40 143 65 130 80C177 44 204 61 191 84C184 98 155 101 138 99C183 111 184 145 162 147C141 149 129 123 124 109C118 151 83 159 80 138C78 119 103 108 111 104Z M121 111C114 134 129 171 114 193M121 158C95 140 80 156 121 167"/><circle cx="124" cy="94" r="15"/></>}
    {kind === "stone" && <><path d="M53 52C88 20 170 30 190 72L212 134C216 174 167 180 117 170L52 160C13 149 21 99 53 52Z"/><path d="M56 63L91 45M48 81L105 43M44 100L121 43M38 120L139 46M41 136L156 51M51 148L171 61M68 153L182 74M89 160L190 91M111 164L196 108M137 167L202 128M163 166L203 148" strokeWidth=".6"/></>}
  </svg>;
}

const colors = ["#baa895", "#a8b5c0", "#c94f32", "#c2c17b", "#8d9d83", "#b8a3bd"];
export function DummyCover({ index }: { index: number }) {
  return <span className={s.dummyCover} data-variant={index % 6} style={{ "--cover-color": colors[index % colors.length] } as CSSProperties} aria-hidden="true"><span className={s.coverNumber}>{String(index+1).padStart(2,"0")}</span><span className={s.coverShape}/><span className={s.coverType}>Книга<br/>{String(index+1).padStart(2,"0")}</span></span>;
}

export function BlackHole() {
  return <span className={s.blackHole} aria-hidden="true"><span/><i/><i/><i/></span>;
}
