export type EditorialMedia = {kind:"audio"|"video";src:string;poster?:string;label?:string};
// Set only when an editorial recording is provided. Never synthesize content.
export const homeMedia:EditorialMedia|null=null;
