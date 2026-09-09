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

export const daynightReviewDisclosure = "В този демонстрационен преглед не са включени клиентски мнения или оценки. Не е направено твърдение за реалния брой отзиви на автосалона.";

export const daynightReviewCount = daynightReviews.length;
export const daynightReviewCountLabel = "Без включени клиентски отзиви";
export const daynightReviewLinkLabel = "За клиентските мнения";

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
