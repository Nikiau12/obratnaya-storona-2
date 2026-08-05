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
  assert.match(html, /Как читать/);
  assert.match(html, /Слово дня/);
  assert.match(html, /Книжная<br\/>витрина/);
  assert.match(html, /og\.png/);
  assert.doesNotMatch(html, /codex-preview|Your site is taking shape/);
});

test("renders the longread template", async () => {
  const response = await render("/material/poetics-of-error");
  assert.equal(response.status, 200);

  const html = await response.text();
  assert.match(html, /Поэтика/);
  assert.match(html, /Лонгрид/);
  assert.match(html, /обратной стороны языка/);
  assert.match(html, /Связанные материалы/);
});

test("renders archives and discovery pages", async () => {
  for (const [path, expected] of [
    ["/materials", /Все материалы/],
    ["/books", /Книжная витрина/],
    ["/authors", /Люди на стороне/],
    ["/rubrics", /Редакционная карта/],
    ["/search", /Поиск по материалам/],
    ["/about", /Смотрим туда/],
    ["/contribute", /Что прислать/],
  ]) {
    const response = await render(path);
    assert.equal(response.status, 200, path);
    assert.match(await response.text(), expected, path);
  }
});

test("renders book, author and media format detail pages", async () => {
  for (const [path, expected] of [
    ["/books/vesele-krushenii", /Купить у издательства/],
    ["/authors/maria-volkova", /Материалы автора/],
    ["/material/archive-machine", /Архив — это машина/],
    ["/material/voice-of-paper", /00:00/],
    ["/material/signal-in-static", /Смотреть видео/],
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
