"use client";
import { useState } from "react";
import s from "./Editorial.module.css";
const scenarios = {
  request: {
    title: "Заказ с подтверждением",
    intro: "Вариант для обсуждения: сначала уточняются наличие и доставка, затем покупатель получает подтверждение и способ оплаты.",
    steps: [
      ["Выбрать книги", "Книги из материалов добавляются в общий список заказа."],
      ["Оставить заявку", "Покупатель указывает контакт и направление доставки. Итоговая стоимость пока не обещается."],
      ["Получить подтверждение", "Магазин проверяет наличие, стоимость книг и доставки, сроки отправки."],
      ["Оплатить подтверждённый заказ", "Способ оплаты выбирается отдельно после согласования процесса."],
    ],
    needs: "Нужны получатель заявок, канал связи, срок ответа, актуальные цены и способ выставления оплаты.",
  },
  checkout: {
    title: "Корзина и оплата на сайте",
    intro: "Вариант для обсуждения: покупатель сразу видит доступность книг, стоимость доставки и итог заказа.",
    steps: [
      ["Добавить книги в корзину", "Количество ограничивается актуальными остатками."],
      ["Выбрать доставку", "Адрес и способ доставки определяют стоимость и доступность отправки."],
      ["Проверить итог и оплатить", "Оплата проходит через выбранный платёжный сервис."],
      ["Получить подтверждение", "Заказ сохраняется, магазин и покупатель получают уведомления."],
    ],
    needs: "Нужны продавец, валюта, цены, остатки, платёжный сервис, география и тарифы доставки, условия заказа и возврата.",
  },
};
export function ShopScenarios() {
  const [selected, setSelected] = useState<keyof typeof scenarios>("request");
  const scenario = scenarios[selected];
  return <><div className={s.filterRow} role="group" aria-label="Сценарии покупки для обсуждения"><button type="button" aria-pressed={selected === "request"} onClick={() => setSelected("request")}>Заказ с подтверждением</button><button type="button" aria-pressed={selected === "checkout"} onClick={() => setSelected("checkout")}>Оплата на сайте</button></div><section className={s.scenario} aria-live="polite"><h2 className={s.sectionTitle}>{scenario.title}</h2><ol className={s.scenarioSteps}>{scenario.steps.map(([title]) => <li key={title}><h3>{title}</h3></li>)}</ol></section></>;
}
