import assert from "node:assert/strict";
import { existsSync } from "node:fs";
import { mkdir, readdir, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { resolve } from "node:path";

const root = fileURLToPath(new URL("../", import.meta.url));
const output = new URL("../outputs/audit/", import.meta.url);
const { default: worker } = await import("../dist/server/index.js");
const origin = "http://localhost";
const paths = ["/", "/search?q=Носорог"];
async function discover(directory, prefix = "") {
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    if (entry.isDirectory() && !entry.name.includes("[") && !entry.name.startsWith("_")) await discover(resolve(directory, entry.name), prefix + "/" + entry.name);
    if (entry.name === "page.tsx") paths.push(prefix || "/");
  }
}
await discover(resolve(root, "app"));
const visited = new Set(), broken = [], missingAssets = [];
const options = { ASSETS: { fetch: async () => new Response("Not found", { status: 404 }) } };
const context = { waitUntil() {}, passThroughOnException() {} };
while (paths.length) {
  const path = paths.shift();
  if (visited.has(path)) continue;
  visited.add(path);
  assert.ok(visited.size <= 250, "Unexpected route expansion");
  const response = await worker.fetch(new Request(origin + path), options, context);
  if (response.status !== 200) { broken.push({ path, status: response.status }); continue; }
  const html = await response.text();
  for (const match of html.matchAll(/<a\b[^>]*\bhref="([^"]+)"/g)) {
    const href = match[1].replaceAll("&amp;", "&");
    if (!href.startsWith("/") || href.startsWith("//")) continue;
    const url = new URL(href, origin);
    if (/\.[a-z0-9]{2,5}$/i.test(url.pathname)) continue;
    paths.push(url.pathname + url.search);
  }
  for (const match of html.matchAll(/<(?:img|image|video|source|iframe)\b[^>]*\b(?:src|href|poster)="([^"]+)"/g)) {
    if (!match[1].startsWith("/")) continue;
    const url = new URL(match[1].replaceAll("&amp;", "&"), origin);
    const asset = url.pathname === "/_vinext/image" ? url.searchParams.get("url") : url.pathname;
    if (!asset || !existsSync(resolve(root, "public", asset.replace(/^\//, "")))) missingAssets.push({ page: path, asset });
  }
}
const rejected = [];
for (const source of ["//example.net/a.png", "/\\example.net/a.png", "/_vinext/image?url=/books/a.png"]) {
  const response = await worker.fetch(new Request(origin + "/_vinext/image?url=" + encodeURIComponent(source)), {}, context);
  assert.equal(response.status, 400, source);
  rejected.push(source);
}
await mkdir(output, { recursive: true });
await writeFile(new URL("route-results.json", output), JSON.stringify({ routes: [...visited].sort(), broken, missingAssets, rejected }, null, 2));
assert.deepEqual(broken, [], "An internal route is broken");
assert.deepEqual(missingAssets, [], "A rendered media asset is missing");
console.log(`PASS ${visited.size} rendered routes, internal links and local media assets; unsafe image redirects rejected`);
