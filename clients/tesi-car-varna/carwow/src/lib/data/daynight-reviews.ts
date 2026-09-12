export type DayNightReview = {
	id: string;
	text: string;
	avatar: `/assets/${string}`;
	name: string;
	label: string;
	rating: number;
};

export const daynightReviews: DayNightReview[] = [];
export const daynightReviewDisclosure = 'В ограниченото проучване не са добавени потвърдени клиентски отзиви за Теси Кар.';
export const daynightReviewCount = 0;
export const daynightReviewCountLabel = '0 потвърдени отзива';
export const daynightReviewLinkLabel = 'Няма публикувани потвърдени отзиви';
export const daynightReviewAverage = 0;
export const daynightReviewDistribution = [5, 4, 3, 2, 1].map((rating) => ({
	id: `${rating}-star`,
	label: String(rating),
	count: 0,
	percent: '0%'
}));
