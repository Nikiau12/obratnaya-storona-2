import { EditorialStudy } from "@/components/editorial/EditorialStudy";

export default async function Home({ searchParams }: { searchParams: Promise<{ composition?: string }> }) {
  const { composition } = await searchParams;
  return <EditorialStudy initialVariant={composition === "balanced" ? "balanced" : "collage"} />;
}
