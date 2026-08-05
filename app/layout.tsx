import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Обратная сторона — медиа о литературе и искусстве",
  description: "Независимое онлайн-медиа о литературе, искусстве и книжных практиках.",
  metadataBase: new URL("https://obratno.io"),
  openGraph: {
    title: "Обратная сторона",
    description: "Медиа о литературе и искусстве",
    type: "website",
    locale: "ru_RU",
    images: [{ url: "/og.png", width: 1536, height: 804, alt: "Обратная сторона — медиа о литературе и искусстве" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Обратная сторона",
    description: "Медиа о литературе и искусстве",
    images: ["/og.png"],
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ru">
      <body>{children}</body>
    </html>
  );
}
