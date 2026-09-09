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
		text: 'Изберете автомобил от наличността онлайн или на място в Бургас, запишете оглед и тест драйв, след което уточняваме финансиране, бартер или лизинг с екипа на MG7 Group.'
	},
	{
		class: 'h7 text-secondary line-height-28',
		text: 'Подгответе лична карта и нужните документи. След като се договорим за условията, оформяме документите, правите оглед на автомобила и финализираме сделката.'
	}
];

const exploreAnswer: readonly FaqAnswerParagraph[] = [
	{
		class: 'h7 text-secondary line-height-28',
		text: 'Изберете автомобил от наличността онлайн или на място в Бургас, запишете оглед и тест драйв, след което уточняваме финансиране, бартер или лизинг с екипа на MG7 Group.'
	}
];

const termsAnswer: readonly FaqAnswerParagraph[] = [
	{
		class: 'h7 text-secondary line-height-28',
		text: 'Условията зависят от конкретния автомобил и избраната схема. Свържете се с екипа на MG7 Group за актуална информация, оценка на замяна и съдействие по документите.'
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
            "class": "h7 text-secondary line-height-28",
            "text": "Изберете обява, сравнете данните и се обадете за наличност, документи и удобен час за оглед. Този демонстрационен сайт не сключва сделки и не запазва автомобил."
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
            "text": "Не е конфигурирана финансова услуга в този преглед. Попитайте продавача какви възможности се предлагат за конкретната обява; документите, условията и одобрението се определят от съответния доставчик."
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
            "text": "Запазването се договаря директно с продавача. Натискане на бутон или попълване на демо форма не означава приета резервация."
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
            "text": "Показана е публикуваната цена в евро и данъчното уточнение от обявата. Начинът на плащане и включените разходи се потвърждават преди ангажимент."
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
            "text": "Използвайте публикувания телефон, посочете автомобила и потвърдете мястото, часа и възможността за пробно шофиране."
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
            "class": "h7 text-secondary line-height-28",
            "text": "Попитайте дали продавачът разглежда конкретното ви предложение. Този преглед не удостоверява обща политика за бартер или изкупуване."
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
            "text": "Подгответе модел, година, пробег, снимки и известни забележки. Реална оценка не се изчислява или обещава от демо формата."
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
            "text": "Възможността за замяна и евентуалното доплащане се договарят директно. Няма автоматично одобрение."
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
            "text": "Документите се уточняват според конкретните автомобили и сделка. Не качвайте лични документи в този демо преглед."
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
            "class": "h7 text-secondary line-height-28",
            "text": "Не е потвърдена обща гаранция за всички показани автомобили. Проверете срока и обхвата на всяко твърдение в конкретната обява директно с продавача."
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
            "text": "Информацията е от публични обяви, а не от независима техническа проверка. Поискайте наличната сервизна история и организирайте независим оглед при нужда."
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
            "text": "Доставка до друг град не е потвърдена като обща услуга. Попитайте за възможности, разходи и срок за конкретния автомобил."
          }
        ]
      }
    ]
  }
];
