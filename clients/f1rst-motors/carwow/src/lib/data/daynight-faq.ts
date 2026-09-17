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
            "text": "Dated public stock sample, not a live feed. Confirm price, specifications and availability directly with F1rst Motors. Demo forms do not send messages."
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
            "text": "Contact F1rst Motors on +971 4 320 1030 before visiting Danube Building - 409 Sheikh Zayed Rd - Al Quoz - Al Quoz 1 - Dubai, UAE."
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
            "text": "Contact the showroom before travelling and confirm availability. F1rst Motors terms state that site logos/images/content require prior written consent. The committed branding and stock illustrations are internal proposal concepts, not copied official assets."
          }
        ]
      }
    ]
  }
];
