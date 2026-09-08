import { eliqautoContact } from '$lib/data/eliqauto';

export type AuxeroReviewCard = {
	avatar: string;
	id: string;
	name: string;
	role: string;
	stars: number;
	text: string;
};

export type AuxeroReviewsPageData = {
	facebookHref: string;
	facebookLabel: string;
	pageLabel: string;
	title: string;
};

/* Avatars are picked per reviewer so the photo matches the name — cycling the
   consultant headshots paired male names with female photos. */
const baseReviews = [
	{
		avatar: '/assets/images/avatar/avatar-1.webp',
		name: 'Aleksandar Vytev',
		role: 'Препоръка във Facebook',
		text: 'Процесът по покупка и доставка следваше плана, който беше обяснен преди да започнем.'
	},
	{
		avatar: '/assets/images/avatar/avatar-2.webp',
		name: 'Krasimir Georgiev',
		role: 'Предаване на клиентски автомобил',
		text: 'Колата, която купих чрез Eliqauto, дойде точно както беше уговорено. Бих ги избрал отново.'
	},
	{
		avatar: '/assets/images/avatar/avatar-5.webp',
		name: 'Zhivko Zaimov',
		role: 'Клиент с внос и лизинг 100%',
		text: 'Всяка стъпка беше обяснена ясно: снимки преди покупка, Carfax контекст и без скрити такси.'
	},
	{
		avatar: '/assets/images/avatar/avatar-3.webp',
		name: 'Asen Hristov',
		role: 'Потвърден купувач',
		text: 'Това, което поръчах, е това, което пристигна. Важното беше автомобил без скрити проблеми.'
	},
	{
		avatar: '/assets/images/avatar/avatar-6.webp',
		name: 'Stanislav Stefanov Kyumyurdzhiev',
		role: 'Отзив за доставка',
		text: 'Получих автомобила в уговорения срок и без изненадващи такси.'
	},
	{
		avatar: '/assets/images/avatar/client-3.webp',
		name: 'Eliqauto client',
		role: 'Оглед по уговорка',
		text: 'Документите, сервизният контекст и състоянието на автомобила бяха готови, когато дойдох да видя колата.'
	}
] as const;

export const auxeroReviewCards: AuxeroReviewCard[] = baseReviews.map((review) => ({
	...review,
	id: review.name
		.toLowerCase()
		.replaceAll(/[^a-z0-9]+/g, '-')
		.replace(/^-|-$/g, ''),
	stars: 5
}));

export const auxeroReviewsPage: AuxeroReviewsPageData = {
	facebookHref: eliqautoContact.reviewsHref,
	facebookLabel: 'Facebook',
	pageLabel: '1',
	title: 'Отзиви от клиенти'
};
