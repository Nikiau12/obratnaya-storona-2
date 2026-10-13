import { HomeComposition } from "@/components/home/HomeComposition";
import { books } from "@/lib/content";
import { homeFeatures, homeQuote, homeShelfSlugs } from "@/lib/home-content";

export default function Home() {
  const shelf = homeShelfSlugs.flatMap((slug) => books.filter((book) => book.slug === slug));
  return <HomeComposition features={homeFeatures} quote={homeQuote} books={shelf} />;
}
