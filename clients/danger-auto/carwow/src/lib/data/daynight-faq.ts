// DANGER AUTO copy in the retained FAQ/accordion contract.
// Sources: ../../../../../FACTS.json and dealer-stock.json, observed 2026-09-09.
// Legacy export names, IDs and class boundaries are retained for the template consumers.
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
const answer = (...paragraphs: string[]): readonly FaqAnswerParagraph[] =>
	paragraphs.map((text, index) => ({
		class: `${index < paragraphs.length - 1 ? 'mb-8 ' : ''}h7 text-secondary line-height-28`,
		text
	}));
export const daynightFaqGroups: readonly FaqGroup[] = [
	{
		id: 'how-to-buy',
		containerClass: 'container mb-60',
		headingClass: 'h3 mb-20 text-center capitalize',
		heading: 'Избор и оглед',
		items: [
			{
				id: 'steps',
				question: 'Как да започна с избрания автомобил?',
				toggleClass: 'flat-toggle bg-white',
				answer: answer(
					'Разгледайте автомобила и оригиналната му обява. Този демо каталог съдържа осем обяви на DANGER AUTO, проверени на 9 септември 2026 г.; той не е текуща складова система.',
					'За актуална наличност, цена и оглед използвайте публикувания телефон 0888 000 055. Сайтът не прави автоматична резервация и не потвърждава покупка.'
				)
			},
			{
				id: 'financing-documents',
				question: 'Какви са условията за финансиране?',
				toggleClass: 'flat-toggle',
				answer: answer('Дилърът посочва финансиране чрез банка, а не собствен лизинг. Необходими документи, лихви, такси и решение за одобрение се уточняват с конкретния кредитор. Тук няма публикувана действаща кредитна оферта.')
			},
			{
				id: 'reserve',
				question: 'Мога ли да резервирам през сайта?',
				toggleClass: 'flat-toggle bg-white',
				answer: answer('Не. Демо действията не запазват автомобил, не приемат капаро и не изпращат заявка към дилъра. Условията за евентуална резервация се потвърждават директно с DANGER AUTO.')
			},
			{
				id: 'payment-methods',
				question: 'Какво означават показаните цени?',
				toggleClass: 'flat-toggle bg-white',
				answer: answer('Цените са обявените суми за автомобилите в евро към датата на проверката, а не месечни вноски или капаро. Публикуваната данъчна бележка е „Не се начислява ДДС“. Актуалната цена и начинът на плащане се потвърждават с продавача.')
			},
			{
				id: 'test-drive',
				question: 'Как се уговаря оглед или тестово шофиране?',
				toggleClass: 'flat-toggle bg-white',
				answer: answer('Обадете се на 0888 000 055 с конкретния модел или номера на обявата. Уточнете къде е автомобилът, удобен час и дали е възможно тестово шофиране; тази възможност не се гарантира от демото.')
			}
		]
	},
	{
		id: 'exchanges',
		containerClass: 'container mb-60',
		headingClass: 'h3 mb-20 text-center capitalize',
		heading: 'Продажба и евентуална замяна',
		items: [
			{
				id: 'trade-in-accepted',
				question: 'Приема ли се автомобил за замяна?',
				toggleClass: 'flat-toggle bg-white',
				answer: answer('В този демо проект няма потвърдена обща услуга за бартер от DANGER AUTO. Попитайте директно дилъра за конкретен автомобил; наличието на страница за продажба не означава приемане на замяна.')
			},
			{
				id: 'trade-in-valuation',
				question: 'Прави ли сайтът оценка на автомобила ми?',
				toggleClass: 'flat-toggle',
				answer: answer('Не. Въвеждането на данни в демо форма не е експертна оценка или оферта за изкупуване. Няма конфигурирана услуга, която да получава тези данни от името на дилъра.')
			},
			{
				id: 'trade-in-topup',
				question: 'Може ли да се доплати разлика при замяна?',
				toggleClass: 'flat-toggle bg-white',
				answer: answer('Това зависи от изрично договорени условия между страните. Демото не потвърждава бартер, сума за доплащане или кредитно одобрение.')
			},
			{
				id: 'trade-in-documents',
				question: 'Трябва ли да качвам лични документи тук?',
				toggleClass: 'flat-toggle bg-white',
				answer: answer('Не изпращайте лични документи в този преглед. Ако уговаряте реална сделка, уточнете необходимите документи и сигурния начин за предоставянето им директно с дилъра.')
			}
		]
	},
	{
		id: 'refund',
		containerClass: 'container',
		headingClass: 'h3 mb-18 text-center capitalize',
		heading: 'Състояние, документи и предаване',
		items: [
			{
				id: 'warranty',
				question: 'Обещава ли този сайт гаранция?',
				toggleClass: 'flat-toggle bg-white',
				answer: answer('Не е потвърдена обща гаранционна програма за показаните автомобили. За конкретния автомобил поискайте точните писмени условия от продавача; демото не добавя гаранции към обявата.')
			},
			{
				id: 'history-check',
				question: 'Независимо проверени ли са пробегът и историята?',
				toggleClass: 'flat-toggle',
				answer: answer('Не. Пробегът, оборудването и описанието са данни от продавача. Твърденията за сервизна история, предходна употреба или обслужване не са независима проверка; поискайте документи и организирайте подходящ оглед.')
			},
			{
				id: 'delivery',
				question: 'Има ли потвърдена доставка до друг град?',
				toggleClass: 'flat-toggle bg-white',
				answer: answer('В този проект няма потвърдена услуга, тарифа или срок за доставка. Уточнете мястото и условията за предаване на конкретния автомобил директно с DANGER AUTO.')
			}
		]
	}
];
