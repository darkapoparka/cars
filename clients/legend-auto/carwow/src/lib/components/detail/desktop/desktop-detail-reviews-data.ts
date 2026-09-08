export type DesktopDetailReview = {
	id: string;
	name: string;
	date: string;
	text: string;
	avatar?: string;
	initials?: string;
};

export const desktopDetailStarIndexes: number[] = [];
export const desktopDetailRatingRows: {id: string; label: string; percent: string}[] = [];
export const desktopDetailReviews: DesktopDetailReview[] = [];
