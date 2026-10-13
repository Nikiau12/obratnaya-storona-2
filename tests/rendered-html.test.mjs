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
  assert.match(html, /Рецензии на книжные обложки/);
  assert.match(html, /Подлинный Петербург/);
  assert.match(html, /Книжная полка/);
  assert.match(html, /beyond-horizon/);
  assert.match(html, /Нефтяной фон/);
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
    ["/materials", /Медиа/],
    ["/books", /Книжный/],
    ["/authors", /Макеты авторских страниц/],
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
    ["/material/signal-in-static", /Аудиозапись пока не добавлена/],
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

test("homepage opens both full publications internally", async () => {
 const html=await (await render("/")).text();
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
  assert.match(html,/Макет публикации/);
  assert.doesNotMatch(html,/<audio|<video|Воспроизвести аудио|Смотреть видео/);
 }
});
