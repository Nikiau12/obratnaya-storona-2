import {sketchFeatures,type SketchFeature,type SketchFormat} from "./sketch-feature";
export const formatNames:Record<SketchFormat,string>={essay:"Публикация", "cover-reviews":"Рецензии на обложки","book-week":"Книга недели",interview:"Интервью","object-week":"Объект недели",visual:"Визуальный материал"};
export const readingPreviews:SketchFeature[]=sketchFeatures.map(feature=>({...feature,materialHref:`/preview/reading/${feature.format}`,bookSlugs:feature.format==="cover-reviews"?["sketch-01","sketch-02","sketch-03"]:feature.format==="object-week"?[]:feature.bookSlugs}));
