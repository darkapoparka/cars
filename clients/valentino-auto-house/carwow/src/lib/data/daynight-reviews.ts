export type DayNightReview = {
  id: string; text: string; avatar: `/assets/${string}`; name: string; label: string; rating: number;
};
// No fictional customer transactions, portraits or ratings are attributed to this dealer.
export const daynightReviews: DayNightReview[] = [];
export const daynightReviewDisclosure = 'В това демо няма включени проверени клиентски отзиви. Това не означава, че автокъщата няма отзиви в други източници.';
export const daynightReviewCount = daynightReviews.length;
export const daynightReviewCountLabel = 'Няма включени проверени отзиви';
export const daynightReviewLinkLabel = 'Информация за отзивите';
export const daynightReviewAverage = 0;
export const daynightReviewDistribution = [5, 4, 3, 2, 1].map((rating) => ({
  id: `${rating}-star`, label: String(rating), count: 0, percent: '0%'
}));
