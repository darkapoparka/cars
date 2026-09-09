export type DayNightReview = {
	id: string;
	text: string;
	avatar: `/assets/${string}`;
	name: string;
	label: string;
	/** Preserved sample stars, not a verified customer rating. */
	rating: number;
};

export const daynightReviews: DayNightReview[] = [];

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
