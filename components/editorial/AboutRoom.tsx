"use client";

import { useState } from "react";
import { CardHole } from "../sketch/CardScene";
import s from "./About.module.css";

export function AboutRoom() {
  const [moving, setMoving] = useState(true);
  return <div className={s.room} data-room>
    <CardHole paused={!moving} />
    <button className={s.switch} type="button" role="switch" aria-label="Движение предметов"
      aria-checked={moving} onClick={() => setMoving(!moving)} title={moving ? "Выключить движение" : "Включить движение"}>
      <span aria-hidden="true" />
    </button>
  </div>;
}
