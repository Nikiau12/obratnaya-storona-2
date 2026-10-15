import type { Material } from "./content";
import { homeFeatures, type HomeFeature } from "./home-content";

// Layout fixtures only. Never merge these into the publication archive.
const base: Omit<Material, "slug" | "title" | "shortTitle" | "format" | "rubric"> = {
  draft: true, authorSlug: "", date: "", readTime: "", number: "", tone: "dark",
  excerpt: "Макет для согласования. Редакционный текст пока не добавлен.",
  intro: "", body: [], tags: [], mentionedBookSlugs: [],
};

export const previewMaterials: Material[] = [
  {
    ...base, slug: "interview", title: "Разговор", shortTitle: "Разговор", format: "Интервью", rubric: "Макет интервью",
    intro: "Здесь будет вступление к интервью. Имена, реплики и стихотворения будут перенесены из исходного документа.",
    readingBlocks: [
      { type: "dialogue", role: "question", speaker: "Собеседник", blocks: [{ type: "paragraph", text: "Место для первого вопроса." }] },
      { type: "dialogue", role: "answer", speaker: "Герой интервью", blocks: [
        { type: "paragraph", text: "Место для начала ответа. Абзацы, выделения и авторские переносы сохраняются при переносе текста." },
        { type: "poem", text: "Первая строка стихотворения\n    Строка с авторским отступом\nТретья строка\n\nСледующая строфа", attribution: "Схема стихотворного фрагмента — не цитата" },
        { type: "paragraph", text: "Продолжение той же реплики после стихотворения." },
      ] },
      { type: "dialogue", role: "question", speaker: "Собеседник", blocks: [{ type: "paragraph", text: "Место для следующего вопроса." }] },
      { type: "dialogue", role: "answer", speaker: "Герой интервью", blocks: [
        { type: "paragraph", text: "Место для следующего ответа." },
        { type: "quote", text: "Место для цитируемого фрагмента внутри ответа.", attribution: "Источник цитаты" },
        { type: "paragraph", text: "Продолжение ответа после цитаты." },
      ] },
    ],
  },
  {
    ...base, slug: "object", title: "Объект недели", shortTitle: "Объект недели", format: "Объект", rubric: "Макет рубрики", template: "object-week",
    intro: "Место для названия и короткой истории предмета.",
    object: { image: { src: "/nosorog/cutouts/swinging-man.png", alt: "Пробная иллюстрация: фигура на качелях", width: 1254, height: 1254, caption: "Временная иллюстрация из имеющихся материалов. Фотография предмета пока не передана." }, details: [{ label: "Предмет", value: "Название будет добавлено" }, { label: "Происхождение", value: "Данные будут добавлены" }] },
    body: ["Здесь будет текст об объекте: его история, контекст и связь с независимым книгоизданием."],
    readingBlocks: [{ type: "paragraph", text: "Следом можно добавить подробность, отдельное изображение или цитату. Если в тексте упоминаются книги, они появятся в связанной подборке." }],
  },
  {
    ...base, slug: "visual", title: "Обложка и образ", shortTitle: "Обложка и образ", format: "Галерея", rubric: "Макет визуального материала",
    intro: "Проба парного сравнения на имеющихся изображениях. Сопоставления и подписи пока не являются редакционным материалом.",
    mentionedBookSlugs: ["ideal-museum", "beyond-horizon"],
    readingBlocks: [
      { type: "comparison", title: "Первая пара", images: [
        { src: "/books/ideal-museum.png", alt: "Обложка «Пылинок идеального музея»", width: 515, height: 515, caption: "«Пылинки идеального музея» — проба размещения обложки" },
        { src: "/nosorog/cutouts/green-animal.png", alt: "Зелёная фигура — временное изображение", width: 1254, height: 1254, caption: "Место для изображения, с которым его сравнивают" },
      ], text: "Здесь будет пояснение к первой паре. Изображения сохраняют собственные пропорции и остаются главным содержанием разворота." },
      { type: "comparison", title: "Следующая пара", images: [
        { src: "/books/beyond-horizon.jpg", alt: "Обложка «За чертой горизонта»", width: 725, height: 1200, caption: "«За чертой горизонта» — проба размещения обложки" },
        { src: "/nosorog/cutouts/swinging-man.png", alt: "Фигура на качелях — проба повторяющегося блока", width: 1254, height: 1254, caption: "Подпись ко второй части сравнения" },
      ], text: "Каждая пара может сопровождаться своим пояснением. Для варианта с конфетами или принтерами потребуются соответствующие фотографии и текст." },
    ],
  },
];

export const previewHomeFeatures: HomeFeature[] = [
  ...homeFeatures,
  { id: "preview-interview", rubric: "Интервью", title: "Разговор", excerpt: "Макет анонса без связанной книги. Текст интервью ожидается.", href: "/preview/interview", mentionedBookSlugs: [], layout: "left", draft: true },
  { id: "preview-object", rubric: "Объект недели", title: "Предмет и его история", excerpt: "Макет анонса с вырезанным изображением. Фотография предмета и текст ожидаются.", href: "/preview/object", mentionedBookSlugs: [], layout: "center", draft: true, image: { src: "/nosorog/cutouts/swinging-man.png", alt: "Временная фигура на качелях", width: 1254, height: 1254 } },
  { id: "preview-visual", rubric: "Визуальный материал", title: "Обложка и образ", excerpt: "Макет анонса с двумя книгами. Книги выбраны только для проверки подсветки; содержание материала ещё не задано.", href: "/preview/visual", mentionedBookSlugs: ["ideal-museum", "beyond-horizon"], layout: "wide", draft: true },
];
