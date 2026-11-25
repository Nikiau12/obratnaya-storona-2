import assert from "node:assert/strict";

export async function storageFallback(browser, baseUrl) {
  for (const mode of ["disabled", "read-only"]) {
  const context = await browser.newContext({ viewport: { width: 390, height: 844 } });
  await context.addInitScript(mode => {
    if (mode === "disabled") Object.defineProperty(Storage.prototype, "getItem", { configurable: true, value() { throw new DOMException("Disabled", "SecurityError"); } });
    Object.defineProperty(Storage.prototype, "setItem", { configurable: true, value() { throw new DOMException("Unavailable", "QuotaExceededError"); } });
  }, mode);
  const page = await context.newPage();
  await page.goto(baseUrl + "/books/sketch-01", { waitUntil: "networkidle" });
  await page.getByRole("button", { name: "Открыть меню" }).click();
  await page.getByRole("button", { name: "Белый фон", exact: true }).click();
  assert.equal(await page.locator("html").getAttribute("data-site-theme"), "white");
  assert.equal(await page.getByRole("button", { name: "Белый фон", exact: true }).getAttribute("aria-pressed"), "true");
  await page.evaluate(() => window.dispatchEvent(new StorageEvent("storage", { key: "unrelated-preference", newValue: "changed" })));
  assert.equal(await page.locator("html").getAttribute("data-site-theme"), "white", "Unrelated browser storage changes must not reset a theme that could not be saved");
  await page.getByRole("button", { name: "Закрыть меню" }).click();
  await page.getByRole("button", { name: "В корзину", exact: true }).click();
  const cart = page.getByRole("dialog", { name: "Корзина", exact: true });
  await cart.waitFor();
  assert.equal(await cart.locator("li").count(), 1);
  await cart.getByRole("button", { name: "Закрыть", exact: true }).click();
  assert.equal(await page.getByRole("button", { name: "В корзине", exact: true }).count(), 1);
  await context.close();
  }
}

export async function cartPersistence(browser, baseUrl) {
  const context = await browser.newContext();
  const page = await context.newPage();
  for (const slug of ["sketch-01", "sketch-02"]) {
    await page.goto(baseUrl + "/books/" + slug, { waitUntil: "networkidle" });
    await page.getByRole("button", { name: "В корзину", exact: true }).click();
    const cart = page.getByRole("dialog", { name: "Корзина", exact: true });
    await cart.waitFor();
    await cart.getByRole("button", { name: "Закрыть", exact: true }).click();
    await page.waitForTimeout(500);
    await page.waitForLoadState("networkidle");
  }
  const second = await context.newPage();
  await second.goto(baseUrl + "/books", { waitUntil: "networkidle" });
  await second.getByRole("button", { name: "Корзина", exact: true }).click();
  const cart = second.getByRole("dialog", { name: "Корзина", exact: true });
  await cart.waitFor();
  assert.equal(await cart.locator("li").count(), 2);
  assert.match(await cart.textContent(), /Носорог/);
  assert.match(await cart.textContent(), /Хлор/);
  await page.evaluate(() => localStorage.removeItem("obratnaya-storona-cart-v1"));
  await second.waitForFunction(() => document.querySelector("dialog[open] ul") === null);
  await context.close();
}
