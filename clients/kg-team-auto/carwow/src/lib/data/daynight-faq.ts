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
            "text": "Датирани примерни обяви, не потвърдена наличност. Проверете цена, състояние и местоположение при продавача."
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
            "text": "Свържете се с K-G Team Auto на +359877346262 преди посещение на адрес Индустриална зона – Юг, Околовръстен път срещу хотел Чиирите."
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
            "text": "Unapproved, unpublished prospect concept. No dealer agreement or media permission evidenced."
          }
        ]
      }
    ]
  }
];
