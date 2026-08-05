"use client";

import { useEffect, useState } from "react";

export function ArticleTools({ title }: { title: string }) {
  const [progress, setProgress] = useState(0);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const update = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(max > 0 ? Math.min(100, (window.scrollY / max) * 100) : 0);
    };
    update();
    window.addEventListener("scroll", update, { passive: true });
    return () => window.removeEventListener("scroll", update);
  }, []);

  async function share() {
    if (navigator.share) {
      await navigator.share({ title, url: window.location.href });
      return;
    }
    await navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1600);
  }

  return (
    <>
      <div className="reading-progress" style={{ transform: `scaleX(${progress / 100})` }} aria-hidden="true" />
      <button className="share-button" onClick={share}>{copied ? "Ссылка скопирована" : <>Поделиться<span className="link-arrow" aria-hidden="true"> ↗</span></>}</button>
    </>
  );
}
