export type DayNightReview = { id: string; text: string; avatar: `/assets/${string}`; name: string; label: string; rating: number; };
export const daynightReviews: DayNightReview[] = [];
export const daynightReviewDisclosure = 'Няма публикувани или внесени клиентски оценки в този демонстрационен сайт.';
export const daynightReviewCount = 0;
export const daynightReviewCountLabel = 'Няма добавени отзиви';
export const daynightReviewLinkLabel = daynightReviewCountLabel;
export const daynightReviewAverage = 0;
export const daynightReviewDistribution = [5, 4, 3, 2, 1].map((rating) => ({ id: `${rating}-star`, label: String(rating), count: 0, percent: '0%' }));
