import { daynightReviews } from '$lib/data/daynight-reviews';
export type DesktopDetailReview = { id: string; name: string; date: string; text: string; avatar?: string; initials?: string };
export const desktopDetailStarIndexes: number[] = [];
export const desktopDetailRatingRows: { id: string; label: string; percent: string }[] = [];
export const desktopDetailReviews: DesktopDetailReview[] = daynightReviews.slice(0,3).map(service => ({id:service.id,name:service.label,date:'Информация за услугата',text:service.text,avatar:service.avatar}));
