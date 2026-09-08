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
		text: 'Browse the vehicle preview, then ask Texas Drive Auto about availability, a viewing, and a test drive. No dealer financing or payment plans are offered. Buyer-arranged funding is separate; trade-in availability is unconfirmed.'
	},
	{
		class: 'h7 text-secondary line-height-28',
		text: 'Ask which identification and purchase documents are required. Confirm the terms, inspect the vehicle, and review the paperwork before completing a purchase.'
	}
];

const exploreAnswer: readonly FaqAnswerParagraph[] = [
	{
		class: 'h7 text-secondary line-height-28',
		text: 'Browse the vehicle preview, then ask Texas Drive Auto about availability, a viewing, and a test drive. No dealer financing or payment plans are offered. Buyer-arranged funding is separate; trade-in availability is unconfirmed.'
	}
];

const termsAnswer: readonly FaqAnswerParagraph[] = [
	{
		class: 'h7 text-secondary line-height-28',
		text: 'Ask Texas Drive Auto about the selected vehicle, accepted payment methods, and required paperwork. Trade-in availability and valuations are not confirmed in this preview.'
	}
];

export const daynightFaqGroups: readonly FaqGroup[] = [
	{
		id: 'how-to-buy',
		containerClass: 'container mb-60',
		headingClass: 'h3 mb-20 text-center capitalize',
		heading: 'How does buying a car work?',
		items: [
			{
				// Base classes only — the initial open `active` state is applied by the
				// native accordion (openId defaults to this item), never baked in here.
				id: 'steps',
				question: 'What are the steps to buy a car?',
				toggleClass: 'flat-toggle bg-white',
				answer: stepsAnswer
			},
			{
				id: 'financing-documents',
				question: 'What documents does my own lender require?',
				toggleClass: 'flat-toggle',
				answer: exploreAnswer
			},
			{
				id: 'reserve',
				question: 'Can I reserve a vehicle?',
				toggleClass: 'flat-toggle bg-white',
				answer: termsAnswer
			},
			{
				id: 'payment-methods',
				question: 'What payment methods are accepted?',
				toggleClass: 'flat-toggle bg-white',
				answer: termsAnswer
			},
			{
				id: 'test-drive',
				question: 'How do I arrange a viewing or test drive?',
				toggleClass: 'flat-toggle bg-white',
				answer: termsAnswer
			}
		]
	},
	{
		id: 'exchanges',
		containerClass: 'container mb-60',
		headingClass: 'h3 mb-20 text-center capitalize',
		heading: 'Are trade-ins accepted?',
		items: [
			{
				id: 'trade-in-accepted',
				question: 'Do you accept trade-ins?',
				toggleClass: 'flat-toggle bg-white',
				answer: stepsAnswer
			},
			{
				id: 'trade-in-valuation',
				question: 'How would a trade-in be valued?',
				toggleClass: 'flat-toggle',
				answer: exploreAnswer
			},
			{
				id: 'trade-in-topup',
				question: 'Can I pay the difference on a trade-in?',
				toggleClass: 'flat-toggle bg-white',
				answer: termsAnswer
			},
			{
				id: 'trade-in-documents',
				question: 'What documents would a trade-in require?',
				toggleClass: 'flat-toggle bg-white',
				answer: termsAnswer
			}
		]
	},
	{
		id: 'refund',
		containerClass: 'container',
		headingClass: 'h3 mb-18 text-center capitalize',
		heading: 'Warranty and delivery questions',
		items: [
			{
				id: 'warranty',
				question: 'Do any vehicles include a warranty?',
				toggleClass: 'flat-toggle bg-white',
				answer: stepsAnswer
			},
			{
				id: 'history-check',
				question: 'Is vehicle history information available?',
				toggleClass: 'flat-toggle',
				answer: exploreAnswer
			},
			{
				id: 'delivery',
				question: 'Is delivery to another city available?',
				toggleClass: 'flat-toggle bg-white',
				answer: termsAnswer
			}
		]
	}
];
