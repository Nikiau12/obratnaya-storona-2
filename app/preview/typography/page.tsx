import { TypographyStudy } from "@/components/typography/TypographyStudy";

export const metadata = { title: "Два варианта типографики — Обратная сторона", robots: { index: false, follow: false } };

export default async function Page({ searchParams }: { searchParams: Promise<{ variant?: string }> }) {
  const { variant } = await searchParams;
  return <TypographyStudy variant={variant === "b" ? "b" : "a"} />;
}
