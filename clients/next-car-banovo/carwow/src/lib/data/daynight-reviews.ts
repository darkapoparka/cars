export type DayNightReview = {
	id: string;
	text: string;
	avatar: string;
	name: string;
	label: string;
	/** Preserved sample stars, not a verified customer rating. */
	rating: number;
};

// No customer testimonials or ratings have been established for this proposal.
export const daynightReviews: DayNightReview[] = [];
export const daynightReviewDisclosure = 'Не са добавени непотвърдени отзиви, оценки или клиентски портрети. Информацията по-долу е за огледа на автомобила, не клиентско мнение.';
export const daynightReviewCount = 0;
export const daynightReviewCountLabel = 'Без добавени клиентски отзиви';
export const daynightReviewLinkLabel = 'Информация за отзивите';
export const daynightReviewAverage = 0;
export const daynightReviewDistribution = [5, 4, 3, 2, 1].map((rating) => ({ id: String(rating) + '-star', label: String(rating), count: 0, percent: '0%' }));
export const reviewGuidance: DayNightReview[] = [
 { id: 'source-not-review', name: 'Публикувани обяви', label: 'Източник, не клиентски отзив', rating: 0, avatar: '/brand/logo.png', text: 'Снимките и данните са свързани с конкретна публична обява. Проверете актуалната цена и наличност с продавача.' },
 { id: 'viewing-not-review', name: 'Преди оглед', label: 'Практическа информация', rating: 0, avatar: '/brand/logo.png', text: 'Уточнете часа по телефона и поискайте документите и историята на избрания автомобил. Посетете адреса след потвърждение.' },
 { id: 'terms-not-review', name: 'Конкретни условия', label: 'Без обещания за резултат', rating: 0, avatar: '/brand/logo.png', text: 'ДДС, бартер, финансиране и допълнителни разходи се уточняват за конкретната обява. Демото не представлява оферта за кредит.' }
];
