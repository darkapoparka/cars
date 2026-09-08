export type DesktopDetailReview = {
	id: string;
	name: string;
	date: string;
	text: string;
	avatar?: string;
	initials?: string;
};

import { daynightReviews } from '$lib/data/daynight-reviews';
export const desktopDetailStarIndexes: number[] = [];
export const desktopDetailRatingRows: {id:string;label:string;percent:string}[] = [];
export const desktopDetailReviews: DesktopDetailReview[] = daynightReviews.slice(0,3).map(v => ({id:v.id,name:v.name,date:v.label,text:v.text,avatar:v.avatar}));
