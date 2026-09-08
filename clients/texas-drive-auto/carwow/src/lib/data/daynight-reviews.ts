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

export const daynightReviewDisclosure = "Customer reviews and ratings are not included or verified in this preview.";

export const daynightReviewCount = daynightReviews.length;
export const daynightReviewCountLabel = "Reviews not included";
export const daynightReviewLinkLabel = "About review availability";

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
