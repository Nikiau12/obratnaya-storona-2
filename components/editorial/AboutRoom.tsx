import { CardHole } from "../sketch/CardScene";
import s from "./About.module.css";

export function AboutRoom() {
  return <div className={s.room} data-room aria-hidden="true">
    <CardHole />
  </div>;
}
