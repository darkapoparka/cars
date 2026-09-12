import { daynightReviews, daynightReviewDistribution } from '$lib/data/daynight-reviews';

export const desktopDetailStarIndexes = [1, 2, 3, 4, 5] as const;
export const desktopDetailRatingRows = daynightReviewDistribution;
export const desktopDetailReviews = daynightReviews.slice(0, 3);
