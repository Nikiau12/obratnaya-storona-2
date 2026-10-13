import type { Metadata } from "next";
export const metadata: Metadata = { title: "Бюро — Обратная сторона" };
// The bureau copy will be supplied separately. Do not invent services or contacts.
export default function BureauPage() {
  return <main className="inner-page"><section className="page-hero"><h1>Бюро</h1></section></main>;
}
