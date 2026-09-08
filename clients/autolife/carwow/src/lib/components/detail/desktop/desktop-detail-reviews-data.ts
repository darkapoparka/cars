export type DesktopDetailReview = {
	id: string;
	name: string;
	date: string;
	text: string;
	avatar?: string;
	initials?: string;
};

export const desktopDetailStarIndexes = [1, 2, 3, 4, 5] as const;

export const desktopDetailRatingRows = [
	{ id: '5-star', label: '5', percent: '60%' },
	{ id: '4-star', label: '4', percent: '20%' },
	{ id: '3-star', label: '3', percent: '10%' },
	{ id: '2-star', label: '2', percent: '7%' },
	{ id: '1-star', label: '1', percent: '3%' }
] as const;

export const desktopDetailReviews: DesktopDetailReview[] = [
	{
		id: 'ivan-petrov',
		name: 'Иван Петров',
		date: '13 август 2025',
		avatar: '/assets/images/avatar/coment-avatar-1.png',
		text: 'Получих точна информация за автомобила, документите и възможностите за оглед. Екипът беше коректен и не ме притискаше с решение.'
	},
	{
		id: 'maria-georgieva',
		name: 'Мария Георгиева',
		date: '22 август 2025',
		initials: 'МГ',
		text: 'Съдействието за финансиране и прехвърляне беше спокойно и ясно. Хареса ми, че всичко беше обяснено предварително.'
	},
	{
		id: 'daynight-client',
		name: 'Клиент на Аутолайф',
		date: '18 август 2025',
		avatar: '/assets/images/avatar/coment-avatar-2.png',
		text: 'Коректно съдействие при огледа, документите и избора на автомобил. Получих ясна информация за състояние, цена и следващи стъпки.'
	}
];
