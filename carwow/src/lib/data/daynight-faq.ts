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
            "text": "Dated public stock sample, not a live feed. Confirm price, specifications and availability directly with The Dealers Point. Demo forms do not send messages."
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
            "text": "Contact Dealers Point on +971 55 187 5094 before visiting Plot No. 364-0442, Al Quoz Industrial Area 1, Dubai, UAE."
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
            "text": "Contact the showroom before travelling and confirm availability. Proposal refresh and concept stock artwork for unpublished owner review; not represented as official source artwork."
          }
        ]
      }
    ]
  }
];
