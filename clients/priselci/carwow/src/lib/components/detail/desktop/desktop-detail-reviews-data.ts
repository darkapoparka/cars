export type DesktopDetailReview = {
	id: string;
	name: string;
	date: string;
	text: string;
	avatar?: string;
	initials?: string;
};

export const desktopDetailStarIndexes = [1, 2, 3, 4, 5] as const;

export const desktopDetailRatingRows = [
	{ id: '5-star', label: '5', percent: '0%' },
	{ id: '4-star', label: '4', percent: '0%' },
	{ id: '3-star', label: '3', percent: '0%' },
	{ id: '2-star', label: '2', percent: '0%' },
	{ id: '1-star', label: '1', percent: '0%' }
] as const;

export const desktopDetailReviews: DesktopDetailReview[] = [];
