export type EditorialMedia = {kind:"audio"|"video";src:string;poster?:string;label?:string;hasAudio?:boolean;autoplay?:boolean};
// Supplied by Katya: https://t.me/nosorogmagazine/3108. This clip has no audio track.
export const homeMedia:EditorialMedia={kind:"video",src:"/katya/iguana-film.mp4",poster:"/katya/iguana-film-poster.jpg",label:"Игуана — видео из журнала Носорог",hasAudio:false,autoplay:true};
