export type DayNightReview = {
	id: string;
	text: string;
	avatar: `/assets/${string}`;
	name: string;
	label: string;
};

export const daynightReviews: DayNightReview[] = [];

export const daynightReviewCount = daynightReviews.length;
export const daynightReviewCountLabel = 'Няма публикувани отзиви';
export const daynightReviewLinkLabel = 'Информация за отзиви';
