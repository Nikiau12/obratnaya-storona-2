// Verbatim excerpts from the supplied documents with internal reading destinations.
export type HomeFeature = {
  id: string;
  rubric: string;
  title: string;
  subtitle?: string;
  excerpt: string;
  href: string;
  mentionedBookSlugs: string[];
};

export const homeFeatures: HomeFeature[] = [
  {
    id: "cover-reviews",
    rubric: "Рецензии на книжные обложки",
    title: "Эмигрантские дневники. Пылинки идеального музея. Осень на острове Сатурн.",
    excerpt: "Кажется, что перед нами должна предстать идеальная картинка, созданная по принципу «ничего лишнего», однако мы видим пустоту, полную самой себя…",
    href: "/material/cover-reviews",
    mentionedBookSlugs: ["emigrant-diaries", "ideal-museum", "saturn-autumn"],
  },
  {
    id: "book-of-the-week",
    rubric: "Книга недели",
    title: "Подлинный Петербург",
    subtitle: "Об антологии «За чертой горизонта»",
    excerpt: "Выход в свет антологии петербургской поэзии «За чертой горизонта», составленной Станиславом Снытко, — событие, масштаб которого измеряется не столько объемом проделанной работы…",
    href: "/material/beyond-horizon",
    mentionedBookSlugs: ["beyond-horizon"],
  },
];

export const homeQuote = {
  text: "Это не мы смотрим из комнаты, а комната показывает себя",
  attribution: "Из рецензии на «Пылинки идеального музея»",
};
export const homeShelfSlugs = homeFeatures.flatMap((feature) => feature.mentionedBookSlugs);
