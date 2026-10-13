// Verbatim excerpts from the supplied documents. Source links are the reading
// destinations until the two editorial templates are approved.
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
    href: "https://docs.google.com/document/d/1QUUumwdmN5A-TaCBFOj-CAi_COb-9haEj9g4m_eS6Rs/edit",
    mentionedBookSlugs: ["emigrant-diaries", "ideal-museum", "saturn-autumn"],
  },
  {
    id: "book-of-the-week",
    rubric: "Книга недели",
    title: "Подлинный Петербург",
    subtitle: "Об антологии «За чертой горизонта»",
    excerpt: "Выход в свет антологии петербургской поэзии «За чертой горизонта», составленной Станиславом Снытко, — событие, масштаб которого измеряется не столько объемом проделанной работы…",
    href: "https://docs.google.com/document/d/1j6aK01pm1zZ9G181IEO1mH16WpuUj9A6/edit",
    mentionedBookSlugs: ["beyond-horizon"],
  },
];

export const homeQuote = {
  text: "Это не мы смотрим из комнаты, а комната показывает себя",
  attribution: "Из рецензии на «Пылинки идеального музея»",
};
export const homeShelfSlugs = homeFeatures.flatMap((feature) => feature.mentionedBookSlugs);
