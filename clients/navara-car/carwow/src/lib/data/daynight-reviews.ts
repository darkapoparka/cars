export type DayNightReview = {
  id: string; text: string; avatar: `/assets/${string}`; name: string; label: string; rating: number;
};
// No verified customer reviews, names, portraits or scores were collected for Navara Car.
export const daynightReviews: DayNightReview[] = [];
export const daynightReviewDisclosure = 'Не са включени потвърдени клиентски отзиви в тази демонстрация. Това не означава, че автокъщата няма отзиви.';
export const daynightReviewCount = daynightReviews.length;
export const daynightReviewCountLabel = 'Няма потвърдени отзиви в този преглед';
export const daynightReviewLinkLabel = 'Информация за отзивите';
// Zero is an internal empty-state sentinel, never a rating to advertise.
export const daynightReviewAverage = 0;
export const daynightReviewDistribution: { id: string; label: string; count: number; percent: string }[] = [];
