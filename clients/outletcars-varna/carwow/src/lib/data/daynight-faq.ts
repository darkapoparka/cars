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
            "text": "Датирана извадка от обяви; потвърдете цената и наличността директно с автокъщата."
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
            "text": "Свържете се с OUTLETCARS.BG на 0898 921 010 преди посещение на адрес бул. Янош Хуняди 518, срещу КАТ Варна, Варна, България."
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
