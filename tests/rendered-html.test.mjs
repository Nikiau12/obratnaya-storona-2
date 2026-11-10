import assert from "node:assert/strict";
import test from "node:test";

async function render(path = "/") {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}-${path}`);
  const { default: worker } = await import(workerUrl.href);

  return worker.fetch(
    new Request(`http://localhost${path}`, { headers: { accept: "text/html" } }),
    { ASSETS: { fetch: async () => new Response("Not found", { status: 404 }) } },
    { waitUntil() {}, passThroughOnException() {} },
  );
}

test("renders the editorial homepage", async () => {
  const response = await render();
  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type") ?? "", /^text\/html\b/i);

  const html = await response.text();
  assert.match(html, /Обратная сторона/);
  assert.match(html, /Переводчик Петр Епифанов/);
  assert.match(html, /Витрина книг/);
  assert.match(html, /Открыть заметку у глаза/);
  assert.match(html, /constellation/);
  assert.match(html, /Чёрный фон/);
  assert.match(html, /Белый фон/);
  assert.doesNotMatch(html, /data-ink-trail|<canvas/);
  assert.doesNotMatch(html, /Содержание выпуска|Выпуск 01|Книга внутри выпуска/);
  assert.match(html, /og\.png/);
  assert.doesNotMatch(html, /codex-preview|Your site is taking shape/);
});

test("renders the longread template", async () => {
  const response = await render("/material/poetics-of-error");
  assert.equal(response.status, 200);

  const html = await response.text();
  assert.match(html, /Роман Александра Введенского/);
  assert.match(html, /Лонгрид/);
  assert.match(html, /история ненайденной книги/i);
  assert.match(html, /Книги в материале/);
  assert.match(html, /Другие материалы/);
});

test("renders archives and discovery pages", async () => {
  for (const [path, expected] of [
    ["/materials", /Журнал/],
    ["/books", /Витрина/],
    ["/authors", /Авторы/],
    ["/rubrics", /Рубрики/],
    ["/search", /Что вы хотите найти/],
    ["/about", /О нас/],
    ["/contribute", /Предложить текст/],
    ["/bureau", /Бюро/],
  ]) {
    const response = await render(path);
    assert.equal(response.status, 200, path);
    assert.match(await response.text(), expected, path);
  }
});

test("editorial book entries do not claim prices or stock and link back to their features", async () => {
  for (const slug of ["emigrant-diaries", "ideal-museum", "saturn-autumn", "beyond-horizon"]) {
    const response = await render(`/books/${slug}`);
    assert.equal(response.status, 200);
    const html = await response.text();
    assert.doesNotMatch(html, /<dt>(Цена|Наличие)<\/dt>|Купить у издательства/);
    assert.match(html, /Об издании/);
    assert.match(html, /\/material\/(cover-reviews|beyond-horizon)/);
  }
});

test("renders book, author and media format detail pages", async () => {
  for (const [path, expected] of [
    ["/books/vesele-krushenii", /Купить у издательства/],
    ["/authors/maria-volkova", /Материалы автора/],
    ["/material/archive-machine", /Психоаналитики толкуют сновидения/],
    ["/material/voice-of-paper", /Интервью с Роном Силлиманом/],
    ["/material/signal-in-static", /Play me something/],
    ["/material/paper-remembers", /Обложка как занавес/],
  ]) {
    const response = await render(path);
    assert.equal(response.status, 200, path);
    assert.match(await response.text(), expected, path);
  }
});

test("returns a useful 404 page", async () => {
  const response = await render("/missing-page");
  assert.equal(response.status, 404);
  assert.match(await response.text(), /Эта сторона пока пуста/);
});

test("serves original images when local Cloudflare bindings are unavailable", async () => {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}-local-image`);
  const { default: worker } = await import(workerUrl.href);

  const response = await worker.fetch(
    new Request("http://localhost/_vinext/image?url=%2Fbooks%2Fvesele-krushenii.png&w=640&q=75"),
    {},
    { waitUntil() {}, passThroughOnException() {} },
  );

  assert.equal(response.status, 307);
  assert.equal(response.headers.get("location"), "http://localhost/books/vesele-krushenii.png");
});

test("previous homepage retains both full publications internally", async () => {
 const html=await (await render("/preview/home")).text();
 assert.match(html,/href="\/material\/cover-reviews"/);
 assert.match(html,/href="\/material\/beyond-horizon"/);
 assert.doesNotMatch(html,/docs\.google\.com/);
});
test("all supplied paragraphs and footnotes survive the document transfer", async () => {
 const {readFile}=await import("node:fs/promises");
 const texts=JSON.parse(await readFile(new URL("../lib/editorial-texts.json",import.meta.url),"utf8"));
 const plain=text=>text.replace(/\\([\\\x60*_{}\[\]()#+\-.!>])/g,"$1").replace(/\[\^(\d+)\]/g,"$1").replace(/\*/g,"").replace(/\s+/g," ").trim();
 const decode=html=>html.replace(/<[^>]*>/g,"").replace(/&quot;/g,'"').replace(/&#x27;|&#39;/g,"'").replace(/&amp;/g,"&").replace(/&lt;/g,"<").replace(/&gt;/g,">").replace(/\s+/g," ");
 for(const [slug,paragraphs] of [
  ["cover-reviews",texts.reviews.chapters.flatMap(c=>c.paragraphs)],
  ["beyond-horizon",[...texts.weekly.paragraphs,...texts.weekly.footnotes.map(n=>n.text)]]
 ]){
  const response=await render("/material/"+slug);assert.equal(response.status,200);
  const html=await response.text(),body=decode(html.split("<article>")[1].split("</article>")[0]);
  for(const paragraph of paragraphs)assert.ok(body.includes(plain(paragraph)),slug+": "+plain(paragraph).slice(0,90));
  if(slug==="beyond-horizon")for(const n of texts.weekly.footnotes){
   assert.match(html,new RegExp('id="note-'+n.id+'"'));
   assert.match(html,new RegExp('id="note-ref-'+n.id+'"'));
   assert.match(html,new RegExp('href="#note-ref-'+n.id+'"'));
  }
 }
});
test("publisher pages link their books, and new pages contain no invented contacts", async()=>{
 for(const slug of ["individuum","jaromir-hladik-press","nosorog","ivan-limbakh","teller-books-mit-press"]){
  const response=await render("/publishers/"+slug);assert.equal(response.status,200);
  assert.match(await response.text(),/href="\/books\//);
 }
 for(const route of ["/about","/bureau","/contribute"]){
  const html=await (await render(route)).text();
  assert.doesNotMatch(html,/mailto:|pitch@|hello@/);
 }
});
test("missing content returns 404 and demo media has no fake playback controls", async()=>{
 for(const path of ["/books/not-a-book","/material/not-a-material","/publishers/not-a-publisher","/authors/not-an-author"]){
  assert.equal((await render(path)).status,404,path);
 }
 for(const slug of ["signal-in-static","reverse-side-of-image"]){
  const html=await (await render("/material/"+slug)).text();
  assert.doesNotMatch(html,/Макет публикации|запись пока не добавлена/);
  assert.doesNotMatch(html,/<audio|<video|Воспроизвести аудио|Смотреть видео/);
 }
});

test("preview publications are isolated from the homepage and archive", async () => {
  for (const path of ["/preview", "/preview/interview", "/preview/object", "/preview/visual", "/preview/home", "/preview/shop"]) {
    const response = await render(path);
    assert.equal(response.status, 200, path);
    const html = await response.text();
    assert.match(html, /noindex/, path);
    assert.doesNotMatch(html, /mailto:|<form/, path);
  }
  for (const path of ["/", "/materials"]) {
    const html = await (await render(path)).text();
    assert.doesNotMatch(html, /href="\/preview\/(interview|object|visual)"/, path);
  }
  assert.equal((await render("/preview/missing")).status, 404);
});

test("interview preserves mixed dialogue order, stanza breaks and indentation", async () => {
  const html = await (await render("/preview/interview")).text();
  const fragments = ["Место для первого вопроса", "Место для начала ответа", "Первая строка стихотворения\n    Строка с авторским отступом\nТретья строка\n\nСледующая строфа", "Продолжение той же реплики", "Место для следующего вопроса", "Место для цитируемого фрагмента", "Продолжение ответа после цитаты"];
  let previous = -1;
  for (const fragment of fragments) {
    const index = html.indexOf(fragment);
    assert.ok(index > previous, fragment);
    previous = index;
  }
  assert.equal((html.match(/data-role="question"/g) || []).length, 2);
  assert.equal((html.match(/data-role="answer"/g) || []).length, 2);
});

test("extended homepage contains five separate features and only one site header", async () => {
  const html = await (await render("/preview/home")).text();
  assert.equal((html.match(/<article\b/g) || []).length, 5);
  assert.equal((html.match(/<header\b/g) || []).length, 1);
  for (const id of ["cover-reviews", "book-of-the-week", "preview-interview", "preview-object", "preview-visual"]) assert.match(html, new RegExp(`id="${id}"`));
  assert.equal((html.match(/data-book="ideal-museum"/g) || []).length, 1);
  assert.match(html, /data-has-visual="false"/);
});

test("visual and object layouts preserve image dimensions without draft captions", async () => {
  const visual = await (await render("/preview/visual")).text();
  assert.match(visual, /width="725" height="1200"/);
  assert.match(visual, /Первая пара/);
  assert.match(visual, /Следующая пара/);
  assert.equal((visual.match(/<figcaption/g) || []).length, 0);
  const object = await (await render("/preview/object")).text();
  assert.match(object, /width="1254" height="1254"/);
  assert.doesNotMatch(object, /Фотография предмета пока не передана/);
  assert.doesNotMatch(object, /Купить|Цена|В наличии/);
});

test("client headlines and independent shelf have working detail routes without invented relations",async()=>{
 const home=await(await render("/")).text(),journal=await(await render("/materials")).text(),store=await(await render("/books")).text();
 assert.equal((home.match(/<article\b/g)||[]).length,5);
 assert.equal((home.match(/data-book="sketch-/g)||[]).length,6);
 assert.doesNotMatch(home,/Название публикации|Название книги|Место для анонса/);
 for(let i=1;i<=6;i++){
  const slug=`sketch-${String(i).padStart(2,"0")}`;
  for(const html of [home,store])assert.ok(html.includes(`href="/books/${slug}"`));
  const book=await render(`/books/${slug}`);assert.equal(book.status,200);
  const bookHtml=await book.text();assert.doesNotMatch(bookHtml,/Купить книгу|Об этой книге|href="\/material\/sketch-/);
  if(i<=5){
   for(const html of [home,journal])assert.ok(html.includes(`href="/material/${slug}"`));
   const article=await render(`/material/${slug}`);assert.equal(article.status,200);
   assert.doesNotMatch(await article.text(),/href="\/books\/sketch-|Место для текста/);
  }
 }
 for(const path of ["/material/sketch-06","/books/sketch-07"])assert.equal((await render(path)).status,404);
});

test("client content is searchable and publisher filtering selects the supplied books",async()=>{
 for(const [query,href] of [["Беньямина","/material/sketch-02"],["Инохоса","/books/sketch-02"]]){
  const html=await(await render(`/search?q=${encodeURIComponent(query)}`)).text();assert.ok(html.includes(`href="${href}"`));
 }
 const catalog=await(await render("/books?publisher=chlorine-city")).text();
 for(const slug of ["02","05"])assert.ok(catalog.includes(`href="/books/sketch-${slug}"`));
 assert.doesNotMatch(catalog,/href="\/books\/sketch-01"/);
});

test("reading layouts support multiple related books and no related book without filler copy",async()=>{
  for(const format of ["essay","cover-reviews","book-week","interview","object-week","visual"]){
    const response=await render(`/preview/reading/${format}`);assert.equal(response.status,200);
    const html=await response.text();assert.match(html,/noindex/);assert.ok(html.includes(`data-format="${format}"`));
    assert.doesNotMatch(html,/Место для первого вопроса|Место для анонса|Будет добавлено/);
    if(format==="cover-reviews")for(const slug of ["01","02","03"])assert.ok(html.includes(`href="/books/sketch-${slug}"`));
    if(format==="object-week")assert.doesNotMatch(html,/href="\/books\/sketch-/);
    if(format==="interview")assert.match(html,/Место для текста: Стихотворение/);
  }
  const relations=await(await render("/preview/relations")).text();
  assert.equal((relations.match(/data-book="sketch-01"/g)||[]).length,1);
  for(const format of ["essay","cover-reviews","book-week","interview","object-week","visual"])assert.ok(relations.includes(`href="/preview/reading/${format}"`));
  assert.doesNotMatch(relations,/href="\/material\/sketch-/);
});

test("comparison, cover proportions and unconfigured media remain isolated from editorial content",async()=>{
  const home=await(await render("/")).text();assert.match(home,/data-composition="current"/);
  assert.doesNotMatch(home,/<audio|Послушать|autoPlay|autoplay/);
  assert.match(home,/<video/);
  const comparison=await(await render("/preview/composition?variant=roomier")).text();assert.match(comparison,/data-composition="roomier"/);assert.match(comparison,/noindex/);
  const covers=await(await render("/preview/covers")).text();
  for(const [w,h] of [[500,900],[720,720],[1000,600],[400,1200]])assert.ok(covers.includes(`width="${w}" height="${h}"`));
  const media=await(await render("/preview/media")).text();assert.match(media,/accept="audio\/\*"/);assert.match(media,/accept="video\/\*"/);assert.doesNotMatch(media,/<audio|<video|Послушать|Смотреть<\/button>/);
});


test("quote and supplied video lead to real catalog entries without changing the six-book shelf",async()=>{
 const home=await(await render("/")).text();
 assert.match(home,/Мы уже завели наши часы/);
 assert.match(home,/Икозамерон. Джакомо Казанова, «Носорог» №19/);
 assert.match(home,/href="\/books\/nosorog-19"/);
 assert.match(home,/href="\/books\/iguana"/);
 assert.match(home,/iguana-film.mp4/);
 assert.doesNotMatch(home,/autoplay|autoPlay|Включить звук|Без звука/);
 assert.equal((home.match(/data-book="sketch-/g)||[]).length,6);
 const catalog=await(await render("/books")).text();
 for(const [slug,title] of [["nosorog-19","Носорог №19"],["iguana","Игуана"]]){
  assert.ok(catalog.includes(`href="/books/${slug}"`));
  const response=await render(`/books/${slug}`);assert.equal(response.status,200);
  const html=await response.text();assert.ok(html.includes(title));assert.doesNotMatch(html,/Купить книгу|<dt>(Цена|Наличие)<\/dt>/);
 }
});
