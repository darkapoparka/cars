import dealer from './dealer-stock.json';
import { dealerServiceCopy } from './dealer-editorial';

// Client FAQ content. Keep the retained /faq groups, item IDs and CSS hooks.
// Business details come from the same dated record as the inventory; these
// answers do not establish finance, warranty, trade-in or delivery services.
export type FaqAnswerParagraph = {
	readonly class: string;
	readonly text: string;
};

export type FaqItem = {
	readonly id: string;
	readonly question: string;
	readonly toggleClass: string;
	readonly answer: readonly FaqAnswerParagraph[];
};

export type FaqGroup = {
	readonly id: string;
	readonly containerClass: string;
	readonly headingClass: string;
	readonly heading: string;
	readonly items: readonly FaqItem[];
};

const paragraphs = (...texts: string[]): readonly FaqAnswerParagraph[] =>
	texts.map((text, index) => ({
		class: `${index < texts.length - 1 ? 'mb-8 ' : ''}h7 text-secondary line-height-28`,
		text
	}));

const answers = {
	steps: paragraphs(
		`Разгледайте обявите на ${dealer.name} и посочете конкретния автомобил при разговор на ${dealer.phone}. Данните в демото са към ${dealer.observedAt}, а не потвърждение за текуща наличност.`,
		'Проверете статуса в оригиналната обява. Очакван внос не означава пристигнал автомобил, а за клиентски автомобил уточнете местоположението и възможността за оглед. Формите в демото не изпращат запитвания и не запазват автомобил.'
	),
	'financing-documents': paragraphs(
		`${dealerServiceCopy.finance} Поискайте списъка с документи за конкретната оферта. Не изпращайте лични документи през демото.`
	),
	reserve: paragraphs(
		`Възможността за резервация се уточнява с ${dealer.shortName} на ${dealer.phone} за конкретната обява. Уговорете срока и условията директно с продавача. Изборът на автомобил или попълването на демо форма не е резервация и не приема плащане.`
	),
	'payment-methods': paragraphs(
		'Проверете обявената цена и бележката за ДДС за избрания автомобил. Начинът на плащане и крайните условия се уточняват с продавача. Демо калкулаторът не е кредитна оферта и не потвърждава начин на плащане.'
	),
	'test-drive': paragraphs(
		`В източника е посочен адрес ${dealer.address}, ${dealer.city}. ${dealer.hours}`,
		`Обадете се на ${dealer.phone}, за да потвърдите автомобила, точното място, часа и дали е възможно пробно шофиране. Не приемайте, че очакван внос или клиентски автомобил се намира на посочения адрес.`
	),
	'trade-in-accepted': paragraphs(
		dealerServiceCopy.tradeIn
	),
	'trade-in-valuation': paragraphs(
		'Няма автоматична оценка или потвърдена услуга за оценяване в демото. Ако продавачът разглежда предложение за замяна, уточнете какви данни и оглед са необходими. Въведената от Вас сума не е оферта от автокъщата.'
	),
	'trade-in-topup': paragraphs(
		'Доплащане при замяна може да се обсъди само ако продавачът приеме конкретното предложение. Размерът и условията не са определени в демото; то не изчислява обвързваща оценка и не приема плащания.'
	),
	'trade-in-documents': paragraphs(
		'Няма потвърден списък с документи за бартер в източниците на този проект. Първо уточнете дали продавачът разглежда замяна, а след това поискайте необходимия списък за конкретната сделка. Не качвайте лични документи в демото.'
	),
	warranty: paragraphs(
		'Няма потвърдена обща гаранция за всички показани автомобили. Проверете конкретната обява и поискайте от продавача условията и документите за евентуална гаранция. Показването на автомобил в демото не е гаранция за неговото състояние.'
	),
	'history-check': paragraphs(
		'Данните са преписани от публикуваните обяви и не представляват независима проверка на историята. Поискайте идентификационните данни, наличните сервизни документи и уточнение на отбелязаните разминавания. За техническото състояние обсъдете независим оглед преди решение.'
	),
	delivery: paragraphs(
		dealerServiceCopy.delivery
	)
} as const;

export const daynightFaqGroups: readonly FaqGroup[] = [
	{
		id: 'how-to-buy',
		containerClass: 'container mb-60',
		headingClass: 'h3 mb-20 text-center capitalize',
		heading: 'Как протича покупката?',
		items: [
			{
				id: 'steps',
				question: 'Какви са стъпките за покупка?',
				toggleClass: 'flat-toggle bg-white',
				answer: answers.steps
			},
			{
				id: 'financing-documents',
				question: 'Какви документи трябват за финансиране?',
				toggleClass: 'flat-toggle',
				answer: answers['financing-documents']
			},
			{
				id: 'reserve',
				question: 'Може ли автомобил да бъде запазен?',
				toggleClass: 'flat-toggle bg-white',
				answer: answers.reserve
			},
			{
				id: 'payment-methods',
				question: 'Какви варианти за плащане има?',
				toggleClass: 'flat-toggle bg-white',
				answer: answers['payment-methods']
			},
			{
				id: 'test-drive',
				question: 'Как се организира оглед или тест?',
				toggleClass: 'flat-toggle bg-white',
				answer: answers['test-drive']
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
				answer: answers['trade-in-accepted']
			},
			{
				id: 'trade-in-valuation',
				question: 'Как се оценява автомобил за замяна?',
				toggleClass: 'flat-toggle',
				answer: answers['trade-in-valuation']
			},
			{
				id: 'trade-in-topup',
				question: 'Мога ли да доплатя разликата при замяна?',
				toggleClass: 'flat-toggle bg-white',
				answer: answers['trade-in-topup']
			},
			{
				id: 'trade-in-documents',
				question: 'Какви документи са нужни за бартер?',
				toggleClass: 'flat-toggle bg-white',
				answer: answers['trade-in-documents']
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
				answer: answers.warranty
			},
			{
				id: 'history-check',
				question: 'Проверявате ли историята на автомобила?',
				toggleClass: 'flat-toggle',
				answer: answers['history-check']
			},
			{
				id: 'delivery',
				question: 'Предлагате ли доставка до друг град?',
				toggleClass: 'flat-toggle bg-white',
				answer: answers.delivery
			}
		]
	}
];
