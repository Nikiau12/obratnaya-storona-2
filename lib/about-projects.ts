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
  { id: "signal", desktop: [25, 64, "left"], phone: [12, 56, "right"] },
  { id: "flicker", desktop: [77, 57, "right"], phone: [87, 60, "left"] },
  { id: "residents", desktop: [45, 29, "left"], phone: [8, 9, "right"] },
  { id: "showcase", desktop: [67, 30, "right"], phone: [92, 42, "left"] },
  { id: "word", desktop: [30.5, 45, "left"], phone: [8, 32, "right"] },
  { id: "chlor", desktop: [52, 87, "right"], phone: [28, 91, "right"] },
  { id: "day", desktop: [55, 43.5, "right"], phone: [64, 31, "right"] },
  { id: "archive", desktop: [19, 52.5, "right"], phone: [24, 44, "right"] },
  { id: "about", desktop: [85, 48.5, "right"], phone: [88, 78, "right"] },
  { id: "contact", desktop: [59, 12, "right"], phone: [92, 19, "left"] },
] as const;
