// Typed FAQ data for the native /faq route. The questions and answers are the
// exact localized strings the template pipeline produced from faqs.html (verified
// 2026-06-14 against the rendered /faq DOM), grouped into the same three sections
// the baseline renders. FaqContent.svelte renders these keyed so the native
// accordion is 1:1 with the committed visual baseline.

export type FaqAnswerParagraph = {
	/** Verbatim class string from the baseline DOM (first paragraph carries mb-8). */
	readonly class: string;
	readonly text: string;
};

export type FaqItem = {
	readonly id: string;
	readonly question: string;
	/**
	 * Verbatim base class string of the `.flat-toggle` wrapper in the baseline
	 * (some items carry `bg-white`, some don't). The open/active state is layered
	 * on top of this by the native accordion — never baked into this string.
	 */
	readonly toggleClass: string;
	readonly answer: readonly FaqAnswerParagraph[];
};

export type FaqGroup = {
	readonly id: string;
	/** Verbatim class string of the group's `.container` wrapper. */
	readonly containerClass: string;
	/** Verbatim class string of the group heading `<p class="h3 ...">`. */
	readonly headingClass: string;
	readonly heading: string;
	readonly items: readonly FaqItem[];
};

const stepsAnswer: readonly FaqAnswerParagraph[] = [
	{
		class: 'mb-8 h7 text-secondary line-height-28',
		text: 'Изберете автомобил от наличността онлайн или на място в Баново, запишете оглед и тест драйв, след което уточняваме финансиране, бартер или лизинг с екипа на NEXT CAR.'
	},
	{
		class: 'h7 text-secondary line-height-28',
		text: 'Подгответе лична карта и нужните документи. След като се договорим за условията, оформяме документите, правите оглед на автомобила и финализираме сделката.'
	}
];

const exploreAnswer: readonly FaqAnswerParagraph[] = [
	{
		class: 'h7 text-secondary line-height-28',
		text: 'Изберете автомобил от наличността онлайн или на място в Баново, запишете оглед и тест драйв, след което уточняваме финансиране, бартер или лизинг с екипа на NEXT CAR.'
	}
];

const termsAnswer: readonly FaqAnswerParagraph[] = [
	{
		class: 'h7 text-secondary line-height-28',
		text: 'Условията зависят от конкретния автомобил и избраната схема. Свържете се с екипа на NEXT CAR за актуална информация, оценка на замяна и съдействие по документите.'
	}
];

export const daynightFaqGroups: readonly FaqGroup[] = [
  {
    "id": "how-to-buy",
    "containerClass": "container mb-60",
    "headingClass": "h3 mb-20 text-center capitalize",
    "heading": "Как протича покупката?",
    "items": [
      {
        "id": "steps",
        "question": "Какви са стъпките за покупка?",
        "toggleClass": "flat-toggle bg-white",
        "answer": [
          {
            "class": "mb-8 h7 text-secondary line-height-28",
            "text": "Изберете конкретна обява, потвърдете наличността и уговорете посещение по телефона. Сайтът показва датиран подбор, а не гарантиран текущ склад."
          }
        ]
      },
      {
        "id": "financing-documents",
        "question": "Какви документи трябват за финансиране?",
        "toggleClass": "flat-toggle",
        "answer": [
          {
            "class": "h7 text-secondary line-height-28",
            "text": "Конкретните документи и изисквания се определят от избрания кредитор. В този прототип не е потвърден финансов партньор; не изпращайте лични документи през демо формата."
          }
        ]
      },
      {
        "id": "reserve",
        "question": "Може ли автомобил да бъде запазен?",
        "toggleClass": "flat-toggle bg-white",
        "answer": [
          {
            "class": "h7 text-secondary line-height-28",
            "text": "Възможност за запазване, капаро и условия следва да се уточнят писмено с продавача. Прототипът не приема плащания или резервации."
          }
        ]
      },
      {
        "id": "payment-methods",
        "question": "Какви варианти за плащане има?",
        "toggleClass": "flat-toggle bg-white",
        "answer": [
          {
            "class": "h7 text-secondary line-height-28",
            "text": "Уточнете начина на плащане, ДДС и всички допълнителни разходи по конкретната обява."
          }
        ]
      },
      {
        "id": "test-drive",
        "question": "Как се организира оглед или тест?",
        "toggleClass": "flat-toggle bg-white",
        "answer": [
          {
            "class": "h7 text-secondary line-height-28",
            "text": "Обадете се за часа, адреса и условията за оглед или тест. Не е публикуван потвърден график."
          }
        ]
      }
    ]
  },
  {
    "id": "exchanges",
    "containerClass": "container mb-60",
    "headingClass": "h3 mb-20 text-center capitalize",
    "heading": "Бартер и замяна",
    "items": [
      {
        "id": "trade-in-accepted",
        "question": "Приемате ли стария ми автомобил като бартер?",
        "toggleClass": "flat-toggle bg-white",
        "answer": [
          {
            "class": "mb-8 h7 text-secondary line-height-28",
            "text": "Някои обяви посочват договаряне при бартер. Приемането, оценката и участието в сделка не са гарантирани и се уточняват за конкретния автомобил."
          }
        ]
      },
      {
        "id": "trade-in-valuation",
        "question": "Как се оценява автомобил за замяна?",
        "toggleClass": "flat-toggle",
        "answer": [
          {
            "class": "h7 text-secondary line-height-28",
            "text": "Някои обяви посочват договаряне при бартер. Приемането, оценката и участието в сделка не са гарантирани и се уточняват за конкретния автомобил."
          }
        ]
      },
      {
        "id": "trade-in-topup",
        "question": "Мога ли да доплатя разликата при замяна?",
        "toggleClass": "flat-toggle bg-white",
        "answer": [
          {
            "class": "h7 text-secondary line-height-28",
            "text": "Някои обяви посочват договаряне при бартер. Приемането, оценката и участието в сделка не са гарантирани и се уточняват за конкретния автомобил."
          }
        ]
      },
      {
        "id": "trade-in-documents",
        "question": "Какви документи са нужни за бартер?",
        "toggleClass": "flat-toggle bg-white",
        "answer": [
          {
            "class": "h7 text-secondary line-height-28",
            "text": "Някои обяви посочват договаряне при бартер. Приемането, оценката и участието в сделка не са гарантирани и се уточняват за конкретния автомобил."
          }
        ]
      }
    ]
  },
  {
    "id": "refund",
    "containerClass": "container",
    "headingClass": "h3 mb-18 text-center capitalize",
    "heading": "Гаранция и доставка",
    "items": [
      {
        "id": "warranty",
        "question": "Има ли гаранция за автомобилите?",
        "toggleClass": "flat-toggle bg-white",
        "answer": [
          {
            "class": "mb-8 h7 text-secondary line-height-28",
            "text": "Не е потвърдена обща гаранционна програма. Твърденията в отделните обяви са на продавача; поискайте писмени условия."
          }
        ]
      },
      {
        "id": "history-check",
        "question": "Проверявате ли историята на автомобила?",
        "toggleClass": "flat-toggle",
        "answer": [
          {
            "class": "h7 text-secondary line-height-28",
            "text": "Пробегът и спецификациите са по публикуваната обява, не независима проверка. Поискайте VIN и сервизни документи и обсъдете преглед."
          }
        ]
      },
      {
        "id": "delivery",
        "question": "Предлагате ли доставка до друг град?",
        "toggleClass": "flat-toggle bg-white",
        "answer": [
          {
            "class": "h7 text-secondary line-height-28",
            "text": "Възможност, цена и срок за транспорт се уточняват индивидуално. Не е потвърдена обща услуга за доставка."
          }
        ]
      }
    ]
  }
];
