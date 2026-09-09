export type DayNightReview = {
  id: string; text: string; avatar: `/assets/${string}`;
  name: string; label: string; rating: number;
};

// No matched, attributable customer-review set was established for this dealer.
// Do not populate the retained UI with invented people, stars or testimonials.
export const daynightReviews: DayNightReview[] = [];
export const daynightReviewDisclosure = 'За тази демонстрация не са добавени потвърдени клиентски мнения или оценки.';
export const daynightReviewCount = 0;
export const daynightReviewCountLabel = 'Няма потвърдени отзиви';
export const daynightReviewLinkLabel = 'Информация за отзивите';
export const daynightReviewAverage = 0;
export const daynightReviewDistribution = [5, 4, 3, 2, 1].map(rating => ({
  id: `${rating}-star`, label: String(rating), count: 0, percent: '0%'
}));
