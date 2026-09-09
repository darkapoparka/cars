export type DayNightReview = {
  id: string;
  text: string;
  avatar: `/assets/${string}`;
  name: string;
  label: string;
  rating: number;
};

// No customer reviews or ratings have been supplied for this proposal.
export const daynightReviews: DayNightReview[] = [];
export const daynightReviewDisclosure = 'В тази демонстрация не са публикувани клиентски отзиви или оценки. Не се представят измислени мнения.';
export const daynightReviewCount = daynightReviews.length;
export const daynightReviewCountLabel = 'Няма публикувани отзиви в демото';
export const daynightReviewLinkLabel = 'Информация за отзивите';
export const daynightReviewAverage = daynightReviewCount
  ? daynightReviews.reduce((sum, review) => sum + review.rating, 0) / daynightReviewCount : 0;
export const daynightReviewDistribution = [5, 4, 3, 2, 1].map((rating) => ({
  id: `${rating}-star`, label: String(rating), count: 0, percent: '0%'
}));
