"use client";

import { useState } from "react";

export function WordCard() {
  const [open, setOpen] = useState(false);
  return (
    <div className={`word-card ${open ? "is-open" : ""}`}>
      <div className="eyebrow"><span>Слово дня</span><span>05.08</span></div>
      <button className="word" aria-expanded={open} aria-controls="word-definition" onClick={() => setOpen(!open)}>наизнанку</button>
      <div className="word-definition" id="word-definition">
        <p><b>наречие</b></p>
        <p>Внутренней стороной наружу; не так, как принято видеть.</p>
        <p className="quote">«Каждая книга немного выворачивает мир наизнанку».</p>
      </div>
      <p className="hint">наведите или нажмите, чтобы раскрыть</p>
    </div>
  );
}
