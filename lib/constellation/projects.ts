// Client copy and graph connections from the business-card src/main.js.
// The journal and shop now have destinations inside the full site.
export type AboutProject = {
  id: string;
  title: string;
  description: string;
  emphasis?: string;
  href?: string;
  linkLabel?: string;
};

export const aboutProjects: AboutProject[] = [
  { id: "signal", title: "Носорог", description: "Независимое издательство, выросшее из одноимённого литературного журнала. Мы работаем с разными прозаическими формами — от теоретического фикшена до эссеистики и рассказов, с поэзией и переводной литературой,", emphasis: "с актуальностью и опытом прошедшего.", href: "https://nosorog.media/", linkLabel: "nosorog.media" },
  { id: "flicker", title: "Teller Books", description: "Teller Books — книжная серия медиакомпании Teller под кураторством «Обратной стороны», главные книги по теории и практике современных медиа.", href: "https://teller.media/blog/", linkLabel: "teller.media" },
  { id: "residents", title: "Онлайн-медиа «Обратная сторона»", description: "", href: "/materials", linkLabel: "Журнал" },
  { id: "showcase", title: "Книжный онлайн-магазин", description: "", href: "/books", linkLabel: "Витрина" },
  { id: "word", title: "Обратная сторона х press mi", description: "Совместная книжная серия с artist-run пространством Осси «ми», переводная литература по современному искусству от исследователей и теоретиков XXI века.", href: "https://occimi.com/samizdatoccimi", linkLabel: "occimi.com" },
  { id: "chlor", title: "Издательство города Хлор", description: "Естественная точка сборки некоторых инициатив, посвящённых поэзии XX–XXI веков и современной экспериментальной прозе; заведомо странные и «некоммерческие» проекты.", href: "https://chlorinecity.ru/", linkLabel: "chlorinecity.ru" },
  { id: "contact", title: "Издательское бюро «Обратная сторона»", description: "Независимая команда, создающая печатные проекты на заказ — от идеи до готового издания." },
];

export const aboutConnections = [
  ["signal", "word"], ["signal", "archive"], ["signal", "residents"],
  ["flicker", "showcase"], ["flicker", "day"], ["flicker", "about"],
  ["residents", "word"], ["residents", "contact"], ["showcase", "about"],
  ["day", "word"], ["archive", "day"], ["about", "contact"],
  ["chlor", "signal"], ["chlor", "word"], ["chlor", "flicker"],
] as const;

// Anchors remain attached to their labels when the constellation adapts.
export const aboutPoints = [
  { id: "signal", desktop: [25, 64, "left"] },
  { id: "flicker", desktop: [77, 57, "right"] },
  { id: "residents", desktop: [45, 29, "left"] },
  { id: "showcase", desktop: [67, 30, "right"] },
  { id: "word", desktop: [30.5, 45, "left"] },
  { id: "chlor", desktop: [52, 87, "right"] },
  { id: "day", desktop: [55, 43.5, "right"] },
  { id: "archive", desktop: [19, 52.5, "right"] },
  { id: "about", desktop: [85, 48.5, "right"] },
  { id: "contact", desktop: [59, 12, "right"] },
] as const;

// The radial, short-phone and tablet coordinates from the business card.
export const compactPoints = {
  signal: { angle:230, radius:1, side:"left", short:[.25,.12], tablet:[.25,.64] },
  flicker: { angle:-10, radius:.9, side:"left", short:[.78,.48], tablet:[.77,.57] },
  residents: { angle:-90, radius:1, side:"right", short:[.49,.08], tablet:[.45,.385] },
  showcase: { angle:58, radius:.78, side:"right", short:[.78,.8], tablet:[.67,.38] },
  word: { angle:112, radius:.66, side:"left", short:[.18,.86], tablet:[.305,.47] },
  chlor: { angle:80, radius:.94, side:"left", short:[.42,.55], tablet:[.52,.82] },
  day: { angle:152, radius:.72, side:"right", short:[.39,.42], tablet:[.55,.435] },
  archive: { angle:190, radius:1, side:"left", short:[.19,.45], tablet:[.19,.525] },
  about: { angle:30, radius:.8, side:"right", short:[.72,.82], tablet:[.85,.485] },
  contact: { angle:-50, radius:.8, side:"left", short:[.9,.16], tablet:[.59,.3] },
} as const;
