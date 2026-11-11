import type { Metadata } from "next";
import { EditorialStudy } from "@/components/editorial/EditorialStudy";

export const metadata: Metadata = {
  title: "Обратная сторона — композиция главной",
  robots: { index: false, follow: false },
};

export default function EditorialPreview() {
  return <EditorialStudy />;
}
