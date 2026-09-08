// Official dealer content: https://eliqauto.com/za-nas and its about.js, retrieved 2026-09-06.
// Company details are as published by the dealer; the registered office is not the showroom address.
export const eliqAboutCompany = {
	name: '„ЕЛИЯ АУТО 1“ ЕООД',
	eik: '205920887',
	vat: 'BG205920887',
	registeredAddress: 'гр. Пазарджик 4400, ул. Свобода № 6',
	manager: 'Коста Леонидов Узунов',
	since: 2017,
	hours: ['Понеделник–събота: 09:30–19:00', 'Неделя: 10:00–16:00'],
	mapHref: 'https://maps.app.goo.gl/yJxnoqaLU1Frpouq9',
	mapEmbedUrl:
		'https://www.openstreetmap.org/export/embed.html?bbox=24.3067,42.1978,24.3187,42.2053&layer=mapnik&marker=42.2015364,24.3126771',
	locationNote:
		'Шоурумът е извън уличната мрежа на Пазарджик. Използвайте картата за точно упътване.',
	thirdPhone: '0899 73 87 50',
	thirdPhoneHref: 'tel:+359899738750',
	viberHref: 'viber://chat?number=%2B359896781662',
	regions: ['Пазарджик', 'Ставропол']
};

export const eliqAboutActivities = [
	{
		title: 'Продажба на автомобили',
		description: 'Налични автомобили с публикувани снимки, оборудване и цени.',
		icon: 'car',
		href: '/inventory'
	},
	{
		title: 'Изкупуване',
		description: 'Оценка на вашия автомобил и съдействие с продажбата и документите.',
		icon: 'key',
		href: '/sell-your-car'
	},
	{
		title: 'Собствен лизинг',
		description: 'Финансиране със собствени средства. Обсъдете условията за избрания автомобил.',
		icon: 'wallet',
		href: '/contact'
	},
	{
		title: 'Бартер',
		description: 'Вашият автомобил като първоначална вноска или замяна с доплащане.',
		icon: 'swap',
		href: '/contact'
	},
	{
		title: 'Внос по поръчка',
		description: 'Подбор в чужбина, участие в търгове и доставка до България.',
		icon: 'globe',
		href: '/contact'
	},
	{
		title: 'Цялостно съдействие',
		description: 'Регистрация, нотариус, митница, застраховка, сервиз и транспорт.',
		icon: 'check',
		href: '/services'
	}
] as const;

export const eliqAboutServiceGroups = [
	{
		title: 'Покупка и документи',
		services: [
			'Изкупуване на автомобили',
			'Бартер',
			'Регистрация в КАТ',
			'Нотариални услуги',
			'Митнически услуги',
			'Застрахователни услуги',
			'Участие в онлайн търгове'
		]
	},
	{
		title: 'Транспорт и доставка',
		services: [
			'Вътрешен транспорт',
			'Доставка от чужбина',
			'Спедиторски услуги',
			'Доставка до адрес',
			'Репатриране',
			'Пътна помощ'
		]
	},
	{
		title: 'Проверка и сервиз',
		services: [
			'Проверка на автомобила',
			'Гаранционен сервиз',
			'Извънгаранционен сервиз',
			'Оторизиран сервиз',
			'Смяна и баланс на гуми',
			'Съдействие за ТЕХНОТЕСТ',
			'Технически прегледи'
		]
	},
	{
		title: 'Още услуги',
		services: [
			'Автомобили под наем',
			'Специализирана техника под наем',
			'Автомивка',
			'Автокозметични услуги',
			'Онлайн консултации и проверки',
			'Авто услуги',
			'Заложна къща'
		]
	}
];

export const eliqAboutAmenities = [
	{
		title: 'Заведение на място',
		description: 'Храна, докато оглеждате или чакате документите.',
		icon: 'food'
	},
	{
		title: 'Кафе и напитки',
		description: 'Място за спокоен разговор за вашия автомобил.',
		icon: 'coffee'
	},
	{
		title: 'PlayStation зона',
		description: 'Развлечения за вас и децата по време на посещението.',
		icon: 'game'
	},
	{
		title: 'Wi-Fi и клиентска зона',
		description: 'Удобни места за сядане и интернет за гостите.',
		icon: 'wifi'
	}
] as const;

export const eliqAboutGallery = [
	['IMG_6736', 'Шоурумът отвън'],
	['IMG_6721', 'Изложбената зала'],
	['IMG_6732', 'Зоната за клиенти'],
	['IMG_6729', 'Автомобилите в залата'],
	['IMG_6737', 'Лаундж зоната'],
	['IMG_6734', 'Изложбената зала'],
	['IMG_6719', 'Кът за сядане'],
	['IMG_6738', 'Входът'],
	['IMG_6735', 'Залата отблизо'],
	['IMG_6739', 'Мека мебел'],
	['IMG_6733', 'Детайли на входа'],
	['IMG_6740', 'Кът с телевизор'],
	['IMG_6731', 'Залата откъм входа'],
	['IMG_6718', 'Кът за преговори'],
	['IMG_6741', 'Лаундж'],
	['IMG_6720', 'Интериор']
].map(([id, caption]) => ({
	id,
	caption,
	src: `/assets/eliqauto/about/gallery/${id}.webp`,
	thumbnail: `/assets/eliqauto/about/gallery/thumbnails/${id}.webp`
}));
