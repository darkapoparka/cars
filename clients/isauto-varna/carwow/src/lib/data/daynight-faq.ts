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
            "text": "Датирана извадка от публичните обяви към 16.09.2026 г.; потвърдете цената и наличността директно с IS AUTO Varna."
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
            "text": "Свържете се с IS AUTO на 0899 266 666 преди посещение на адрес Бизнес парк Варна, сграда B6, Варна, България."
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
            "text": "Свържете се с автокъщата преди посещение и потвърдете наличността."
          }
        ]
      }
    ]
  }
];
