import { daynightContact } from '$lib/data/daynight';

export type AuxeroReviewCard = { avatar: string; id: string; name: string; role: string; stars: number; text: string; };
export type AuxeroReviewsPageData = { facebookHref: string; facebookLabel: string; pageLabel: string; title: string; };
export const auxeroReviewCards: AuxeroReviewCard[] = [];
export const auxeroReviewsPage: AuxeroReviewsPageData = {
	facebookHref: daynightContact.reviewsHref,
	facebookLabel: "External reviews",
	pageLabel: '1',
	title: "No verified customer reviews are included in this preview"
};
