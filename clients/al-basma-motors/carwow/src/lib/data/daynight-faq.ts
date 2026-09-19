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
            "text": "Independent, unpublished design concept. Dated listing samples, not a live stock feed. Confirm price, specifications and availability directly with the showroom. Forms only prepare drafts; nothing is delivered."
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
            "text": "Contact Al Basma on +971 54 342 2222 before visiting Showroom 61, Souq Al Haraj, Sharjah, UAE."
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
            "text": "Independent preview. Forms do not send messages and no reservation is created."
          }
        ]
      }
    ]
  }
];
