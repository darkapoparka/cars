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
            "text": "Contact Al Hamoor Al Thahabi on +971 54 555 5204 before visiting Souk Al Haraj, showroom 353, Sharjah."
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
            "text": "Independent design preview. Dated listing samples, not a live stock feed. Confirm availability, price, vehicle condition and location directly. No dealership approval or form delivery is implied."
          }
        ]
      }
    ]
  }
];
