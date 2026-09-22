export type DayNightReview = {
	id: string;
	text: string;
	avatar: string;
	name: string;
	label: string;
	rating: number;
};

export const daynightReviews: DayNightReview[] = [];
export const daynightReviewDisclosure =
	'Демонстрационни отзиви и оценки. Не са потвърдени клиентски мнения.' as const;
export const daynightReviewCount = 0;
export const daynightReviewCountLabel = "Няма потвърдени отзиви";
export const daynightReviewLinkLabel = daynightReviewCountLabel;
export const daynightReviewAverage = 0;
export const daynightReviewDistribution = [5, 4, 3, 2, 1].map((rating) => ({
	id: `${rating}-star`,
	label: String(rating),
	count: 0,
	percent: '0%'
}));
