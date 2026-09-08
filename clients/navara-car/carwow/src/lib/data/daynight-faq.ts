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
		text: 'Тази възможност не е потвърдена в публичните източници. Попитайте Навара кар по телефона за конкретния автомобил и условията.'
	},
	{
		class: 'h7 text-secondary line-height-28',
		text: 'За следващите стъпки: тази възможност не е потвърдена в публичните източници. Попитайте Навара кар по телефона за конкретния автомобил и условията.'
	}
];

const exploreAnswer: readonly FaqAnswerParagraph[] = [
	{
		class: 'h7 text-secondary line-height-28',
		text: 'Тази възможност не е потвърдена в публичните източници. Попитайте Навара кар по телефона за конкретния автомобил и условията.'
	}
];

const termsAnswer: readonly FaqAnswerParagraph[] = [
	{
		class: 'h7 text-secondary line-height-28',
		text: 'Тази възможност не е потвърдена в публичните източници. Попитайте Навара кар по телефона за конкретния автомобил и условията.'
	}
];

export const daynightFaqGroups: readonly FaqGroup[] = [
	{
		id: 'how-to-buy',
		containerClass: 'container mb-60',
		headingClass: 'h3 mb-20 text-center capitalize',
		heading: 'Как протича покупката?',
		items: [
			{
				// Base classes only — the initial open `active` state is applied by the
				// native accordion (openId defaults to this item), never baked in here.
				id: 'steps',
				question: 'Какви са стъпките за покупка?',
				toggleClass: 'flat-toggle bg-white',
				answer: stepsAnswer
			},
			{
				id: 'financing-documents',
				question: 'Какви документи трябват за финансиране?',
				toggleClass: 'flat-toggle',
				answer: exploreAnswer
			},
			{
				id: 'reserve',
				question: 'Може ли автомобил да бъде запазен?',
				toggleClass: 'flat-toggle bg-white',
				answer: termsAnswer
			},
			{
				id: 'payment-methods',
				question: 'Какви варианти за плащане има?',
				toggleClass: 'flat-toggle bg-white',
				answer: termsAnswer
			},
			{
				id: 'test-drive',
				question: 'Как се организира оглед или тест?',
				toggleClass: 'flat-toggle bg-white',
				answer: termsAnswer
			}
		]
	},
	{
		id: 'exchanges',
		containerClass: 'container mb-60',
		headingClass: 'h3 mb-20 text-center capitalize',
		heading: 'Бартер и замяна',
		items: [
			{
				id: 'trade-in-accepted',
				question: 'Приемате ли стария ми автомобил като бартер?',
				toggleClass: 'flat-toggle bg-white',
				answer: stepsAnswer
			},
			{
				id: 'trade-in-valuation',
				question: 'Как се оценява автомобил за замяна?',
				toggleClass: 'flat-toggle',
				answer: exploreAnswer
			},
			{
				id: 'trade-in-topup',
				question: 'Мога ли да доплатя разликата при замяна?',
				toggleClass: 'flat-toggle bg-white',
				answer: termsAnswer
			},
			{
				id: 'trade-in-documents',
				question: 'Какви документи са нужни за бартер?',
				toggleClass: 'flat-toggle bg-white',
				answer: termsAnswer
			}
		]
	},
	{
		id: 'refund',
		containerClass: 'container',
		headingClass: 'h3 mb-18 text-center capitalize',
		heading: 'Гаранция и доставка',
		items: [
			{
				id: 'warranty',
				question: 'Има ли гаранция за автомобилите?',
				toggleClass: 'flat-toggle bg-white',
				answer: stepsAnswer
			},
			{
				id: 'history-check',
				question: 'Проверявате ли историята на автомобила?',
				toggleClass: 'flat-toggle',
				answer: exploreAnswer
			},
			{
				id: 'delivery',
				question: 'Предлагате ли доставка до друг град?',
				toggleClass: 'flat-toggle bg-white',
				answer: termsAnswer
			}
		]
	}
];
