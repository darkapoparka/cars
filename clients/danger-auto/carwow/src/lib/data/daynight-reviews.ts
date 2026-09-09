export type DayNightReview = {
	id: string;
	text: string;
	avatar: `/assets/${string}`;
	name: string;
	label: string;
	rating: number;
};

// No verified DANGER AUTO customer reviews were supplied. Do not relabel the
// template's fictional quotations, scores or portraits as this dealer's clients.
export const daynightReviews: DayNightReview[] = [];
export const daynightReviewDisclosure = 'Няма предоставени потвърдени клиентски отзиви за DANGER AUTO. Не показваме измислени мнения, портрети или оценки.';
export const daynightReviewCount = daynightReviews.length;
export const daynightReviewCountLabel = daynightReviewCount
	? `${daynightReviewCount} потвърдени отзива`
	: 'Няма потвърдени отзиви';
export const daynightReviewLinkLabel = daynightReviewCount
	? `Виж всички ${daynightReviewCountLabel}`
	: 'Информация за отзивите';
export const hasVerifiedDaynightReviews = daynightReviewCount > 0;

// Zero is an empty-data calculation sentinel, not a published dealer rating.
// Existing numeric consumers retain their contract; render the label when empty.
export const daynightReviewAverage = daynightReviewCount
	? daynightReviews.reduce((total, review) => total + review.rating, 0) / daynightReviewCount
	: 0;
export const daynightReviewAverageLabel = daynightReviewCount
	? daynightReviewAverage.toFixed(1)
	: 'Без изчислена оценка';
export const daynightReviewDistribution = [5, 4, 3, 2, 1].map((rating) => {
	const count = daynightReviews.filter((review) => review.rating === rating).length;
	return {
		id: `${rating}-star`,
		label: String(rating),
		count,
		percent: `${daynightReviewCount ? Math.round(count / daynightReviewCount * 100) : 0}%`
	};
});
