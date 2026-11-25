/** Resolve only a local image URL; never turn a proxy parameter into a cross-origin redirect. */
export function localImageUrl(source: string | null, requestUrl: string): URL | null {
  if (!source || !source.startsWith("/") || source.startsWith("//") || /\\|%5c/i.test(source)) return null;
  try {
    const base = new URL(requestUrl);
    const url = new URL(source, base);
    if (url.origin !== base.origin || url.pathname === "/_vinext/image") return null;
    return url;
  } catch { return null; }
}
