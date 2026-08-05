import type { Metadata } from "next";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import "./globals.css";

const siteUrl = "https://obratnaya-storona-2.young-mite-9319.chatgpt.site";

export const metadata: Metadata = {
  title: "Обратная сторона — медиа о литературе и искусстве",
  description: "Независимое онлайн-медиа о литературе, искусстве и книжных практиках.",
  metadataBase: new URL(siteUrl),
  icons: {
    icon: [
      { url: "/favicon.svg", type: "image/svg+xml" },
      { url: "/favicon.ico", sizes: "any" },
    ],
    shortcut: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
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
      <body>
        <SiteHeader />
        {children}
        <SiteFooter />
      </body>
    </html>
  );
}
