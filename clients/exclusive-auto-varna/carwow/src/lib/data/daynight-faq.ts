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


// Client-specific answers; retained group IDs and accordion presentation.
export const daynightFaqGroups: readonly FaqGroup[] = [
  {
    "id": "how-to-buy",
    "containerClass": "container mb-60",
    "headingClass": "h3 mb-20 text-center capitalize",
    "heading": "Как да подготвите покупката?",
    "items": [
      {
        "id": "steps",
        "question": "Какви са стъпките за покупка?",
        "toggleClass": "flat-toggle bg-white",
        "answer": [
          {
            "class": "h7 text-secondary line-height-28",
            "text": "Изберете обява и се обадете на продавача. Потвърдете наличността, състоянието, крайната цена и часа за оглед. Демото не запазва автомобил."
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
            "text": "Конкретен кредитор, пакет документи и условия не са потвърдени за тази демонстрация. Поискайте актуална писмена оферта от продавача."
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
            "text": "Резервация се уговаря директно с продавача. Натискането на бутон или попълването на форма в демото не потвърждава резервация."
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
            "text": "В извадката е показана обявената цена в евро с данъчната бележка от съответната обява. Начинът на плащане се уточнява с продавача."
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
            "text": "Обадете се на публикувания телефон за конкретния автомобил. Потвърдете адреса, удобния час и възможността за тест преди посещение."
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
            "text": "В някои източници продавачът посочва възможност за бартер. Това не означава, че всеки автомобил се приема. Поискайте потвърждение за конкретната сделка."
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
            "text": "Подгответе модел, година, пробег, снимки и описание на състоянието. Стойност не се определя автоматично от това демо."
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
            "text": "Доплащането и цената при бартер се договарят отделно. Показаната цена не е автоматична оферта за замяна."
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
            "text": "Поискайте от продавача списък с документите за конкретния автомобил. Не изпращайте лични документи през демонстрационните форми."
          }
        ]
      }
    ]
  },
  {
    "id": "refund",
    "containerClass": "container",
    "headingClass": "h3 mb-18 text-center capitalize",
    "heading": "Състояние и предаване",
    "items": [
      {
        "id": "warranty",
        "question": "Има ли гаранция за автомобилите?",
        "toggleClass": "flat-toggle bg-white",
        "answer": [
          {
            "class": "h7 text-secondary line-height-28",
            "text": "Не е заявена обща гаранция за всички автомобили в тази демонстрация. Проверете всяко твърдение в обявата и поискайте писмените условия за избрания автомобил."
          }
        ]
      },
      {
        "id": "history-check",
        "question": "Как да проверя историята на автомобила?",
        "toggleClass": "flat-toggle",
        "answer": [
          {
            "class": "h7 text-secondary line-height-28",
            "text": "Поискайте идентификационен номер, сервизни документи и възможност за независим преглед. Данните в демото са от публикувани обяви, не независима проверка."
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
            "text": "Доставка, транспорт и срокове не са потвърдени за тази демонстрация. Обсъдете възможностите и цената директно с продавача."
          }
        ]
      }
    ]
  }
];
