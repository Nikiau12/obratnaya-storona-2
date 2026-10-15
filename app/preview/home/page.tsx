import { HomeComposition } from "@/components/home/HomeComposition";
import { books } from "@/lib/content";
import { homeQuote } from "@/lib/home-content";
import { previewHomeFeatures } from "@/lib/preview-content";
export default function PreviewHome() {
  const slugs = new Set(previewHomeFeatures.flatMap(f => f.mentionedBookSlugs));
  return <HomeComposition features={previewHomeFeatures} books={books.filter(b => slugs.has(b.slug))} quote={homeQuote} preview />;
}
