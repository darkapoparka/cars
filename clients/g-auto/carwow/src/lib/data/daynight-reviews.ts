export type DayNightReview = {
	id: string;
	text: string;
	avatar: `/assets/${string}`;
	name: string;
	label: string;
	/** Preserved sample stars, not a verified customer rating. */
	rating: number;
};

export const daynightReviews = [] as DayNightReview[];

export const daynightReviewDisclosure = "Потвърдени клиентски отзиви не са предоставени за това демо. Не показваме примерни оценки като реални.";

export const daynightReviewCount = daynightReviews.length;
export const daynightReviewCountLabel = "Няма потвърдени отзиви";
export const daynightReviewLinkLabel = "Информация за отзивите";

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
