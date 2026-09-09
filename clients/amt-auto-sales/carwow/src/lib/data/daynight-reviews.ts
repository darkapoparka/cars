export type DayNightReview = {
	id: string;
	text: string;
	avatar: `/assets/${string}`;
	name: string;
	label: string;
	/** Preserved sample stars, not a verified customer rating. */
	rating: number;
};

export const daynightReviews = [
	{
		id: 'clear-info',
		text: 'Получих ясна информация за автомобила, документите и следващите стъпки. Огледът беше организиран спокойно, без натиск и без излишни обещания.',
		avatar: '/assets/images/avatar/avatar-4.png',
		name: 'Клиент на Day Night Auto',
		rating: 5,
		label: 'Оглед и документи'
	},
	{
		id: 'budget',
		text: 'Екипът ми помогна да сравня няколко автомобила и да преценя бюджета с вариант за разсрочено плащане.',
		avatar: '/assets/images/avatar/avatar-1.png',
		name: 'Клиент от София',
		rating: 5,
		label: 'Сравнение и разсрочване'
	},
	{
		id: 'condition',
		text: 'Автомобилът беше представен коректно, със снимки, цена и обяснение за състоянието. Сделката мина бързо и подредено.',
		avatar: '/assets/images/avatar/avatar-2.png',
		name: 'Клиент на Day Night Auto',
		rating: 5,
		label: 'Коректна сделка'
	},
	{
		id: 'listing-details',
		text: 'Обявата беше достатъчно подробна, а на място получих отговори за пробег, обслужване и регистрация.',
		avatar: '/assets/images/pages/sale-agent-3.jpg',
		name: 'Клиент на Day Night Auto',
		rating: 5,
		label: 'Подробна обява'
	},
	{
		id: 'documents',
		text: 'Съдействието при документите и регистрацията спести време. Хареса ми, че условията бяха казани предварително.',
		avatar: '/assets/images/pages/sale-agent-2.jpg',
		name: 'Клиент от София',
		rating: 5,
		label: 'Документи и регистрация'
	},
	{
		id: 'choice',
		text: 'Лесно избрах подходящ автомобил и получих съдействие за оглед, документи и финансиране.',
		avatar: '/assets/images/pages/sale-agent-1.jpg',
		name: 'Клиент от София',
		rating: 5,
		label: 'Избор и финансиране'
	},
	{
		id: 'inventory',
		text: 'Наличните автомобили са подредени ясно, а екипът помага с реални съвети според бюджета и нуждите.',
		avatar: '/assets/images/pages/sale-agent-4.jpg',
		name: 'Клиент на Day Night Auto',
		rating: 5,
		label: 'Съвет по бюджет'
	},
	{
		id: 'fast-response',
		text: 'Получих бърз отговор на въпросите си и ясни стъпки за оглед и покупка.',
		avatar: '/assets/images/pages/sale-agent-6.jpg',
		name: 'Клиент от София',
		rating: 5,
		label: 'Бърза комуникация'
	},
	{
		id: 'organized',
		text: 'Процесът беше прозрачен и добре организиран от първото обаждане до финалните документи.',
		avatar: '/assets/images/pages/sale-agent-8.jpg',
		name: 'Клиент от София',
		rating: 5,
		label: 'Прозрачен процес'
	}
] satisfies DayNightReview[];

export const daynightReviewDisclosure = 'Демонстрационни отзиви и оценки. Не са потвърдени клиентски мнения.';

export const daynightReviewCount = daynightReviews.length;
export const daynightReviewCountLabel = `${daynightReviewCount} примерни отзива`;
export const daynightReviewLinkLabel = `Виж всички ${daynightReviewCountLabel}`;

export const daynightReviewAverage = daynightReviewCount
	? daynightReviews.reduce((total, review) => total + review.rating, 0) / daynightReviewCount
	: 0;
export const daynightReviewDistribution = [5, 4, 3, 2, 1].map((rating) => {
	const count = daynightReviews.filter((review) => review.rating === rating).length;
	return {
		id: `${rating}-star`,
		label: String(rating),
		count,
		percent: `${daynightReviewCount ? Math.round(count / daynightReviewCount * 100) : 0}%`
	};
});
