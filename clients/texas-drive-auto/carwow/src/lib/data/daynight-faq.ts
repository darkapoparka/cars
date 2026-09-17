export type FaqAnswerParagraph = { readonly class: string; readonly text: string; };
export type FaqItem = { readonly id: string; readonly question: string; readonly toggleClass: string; readonly answer: readonly FaqAnswerParagraph[]; };
export type FaqGroup = { readonly id: string; readonly containerClass: string; readonly headingClass: string; readonly heading: string; readonly items: readonly FaqItem[]; };
export const daynightFaqGroups: readonly FaqGroup[] = [
  {
    "id": "dealer-information",
    "containerClass": "container",
    "headingClass": "h3 mb-20 text-center capitalize",
    "heading": "Dealer information",
    "items": [
      {
        "id": "availability",
        "question": "Is every vehicle currently available?",
        "toggleClass": "flat-toggle bg-white",
        "answer": [
          {
            "class": "h7 text-secondary line-height-28",
            "text": "Dated listing samples; confirm price and availability directly with the dealership."
          }
        ]
      },
      {
        "id": "viewing",
        "question": "How do I arrange a viewing?",
        "toggleClass": "flat-toggle",
        "answer": [
          {
            "class": "h7 text-secondary line-height-28",
            "text": "Contact Texas Drive Auto on (214) 972-3233 before visiting 10511 Olympic Drive, Dallas, TX 75220."
          }
        ]
      },
      {
        "id": "forms",
        "question": "Does this preview submit a reservation?",
        "toggleClass": "flat-toggle bg-white",
        "answer": [
          {
            "class": "h7 text-secondary line-height-28",
            "text": "Contact the showroom before travelling and confirm availability."
          }
        ]
      }
    ]
  }
];
