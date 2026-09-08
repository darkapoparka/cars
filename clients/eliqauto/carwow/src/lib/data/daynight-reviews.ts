export type DayNightReview = { id: string; text: string; avatar: `/assets/${string}`; name: string; label: string; rating: number };
// No source-dealer testimonials are presented as ELIQ customer feedback.
export const daynightReviews: DayNightReview[] = [];
export const daynightReviewDisclosure = 'За тази демонстрация не са добавени потвърдени клиентски отзиви.';
export const daynightReviewCount = 0;
export const daynightReviewCountLabel = 'Няма добавени отзиви';
export const daynightReviewLinkLabel = 'Информация за отзивите';
export const daynightReviewAverage = 0;
export const daynightReviewDistribution = [5, 4, 3, 2, 1].map(rating => ({ id: `${rating}-star`, label: String(rating), count: 0, percent: '0%' }));
