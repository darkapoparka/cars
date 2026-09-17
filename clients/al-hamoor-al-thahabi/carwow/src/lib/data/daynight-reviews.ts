export type DayNightReview = {
	id: string;
	text: string;
	avatar: string;
	name: string;
	label: string;
	rating: number;
};

export const daynightReviews: DayNightReview[] = [];
export const daynightReviewDisclosure = "No verified customer reviews are included in this Contact the showroom before travelling and confirm availability." as const;
export const daynightReviewCount = 0;
export const daynightReviewCountLabel = "No verified reviews";
export const daynightReviewLinkLabel = daynightReviewCountLabel;
export const daynightReviewAverage = 0;
export const daynightReviewDistribution = [5, 4, 3, 2, 1].map((rating) => ({
	id: `${rating}-star`,
	label: String(rating),
	count: 0,
	percent: '0%'
}));
