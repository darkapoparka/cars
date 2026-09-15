export type FaqAnswerParagraph = { readonly class: string; readonly text: string; };
export type FaqItem = { readonly id: string; readonly question: string; readonly toggleClass: string; readonly answer: readonly FaqAnswerParagraph[]; };
export type FaqGroup = { readonly id: string; readonly containerClass: string; readonly headingClass: string; readonly heading: string; readonly items: readonly FaqItem[]; };
export const daynightFaqGroups: readonly FaqGroup[] = [
  {
    "id": "dealer-information",
    "containerClass": "container",
    "headingClass": "h3 mb-20 text-center capitalize",
    "heading": "Информация за автокъщата",
    "items": [
      {
        "id": "availability",
        "question": "Всички автомобили налични ли са в момента?",
        "toggleClass": "flat-toggle bg-white",
        "answer": [
          {
            "class": "h7 text-secondary line-height-28",
            "text": "Подбрани публикувани обяви. Наличностите и условията се потвърждават по телефона."
          }
        ]
      },
      {
        "id": "viewing",
        "question": "Как да уговоря оглед?",
        "toggleClass": "flat-toggle",
        "answer": [
          {
            "class": "h7 text-secondary line-height-28",
            "text": "Свържете се с Champion Auto Pro на 0885 072 555 преди посещение на адрес бул. „Цар Освободител“ 302 / Автомивка Izgi Europe Motor."
          }
        ]
      },
      {
        "id": "forms",
        "question": "Този преглед създава ли резервация?",
        "toggleClass": "flat-toggle bg-white",
        "answer": [
          {
            "class": "h7 text-secondary line-height-28",
            "text": "Независим демонстрационен преглед. Формите не изпращат съобщения и не създават резервация."
          }
        ]
      }
    ]
  }
];
