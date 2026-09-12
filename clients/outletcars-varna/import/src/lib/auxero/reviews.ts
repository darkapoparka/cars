import { daynightContact } from '$lib/data/daynight';

export type AuxeroReviewCard = {
	avatar: string;
	id: string;
	name: string;
	role: string;
	stars: number;
	text: string;
};

export type AuxeroReviewsPageData = {
	facebookHref: string;
	facebookLabel: string;
	pageLabel: string;
	title: string;
};

/* Avatars are picked per reviewer so the photo matches the name — cycling the
   consultant headshots paired male names with female photos. */
const baseReviews: Omit<AuxeroReviewCard, 'id' | 'stars'>[] = [];

export const auxeroReviewCards: AuxeroReviewCard[] = baseReviews.map((review) => ({
	...review,
	id: review.name
		.toLowerCase()
		.replaceAll(/[^a-z0-9]+/g, '-')
		.replace(/^-|-$/g, ''),
	stars: 5
}));

export const auxeroReviewsPage: AuxeroReviewsPageData = {
	facebookHref: daynightContact.reviewsHref,
	facebookLabel: 'Facebook',
	pageLabel: '1',
	title: 'Отзиви от клиенти'
};
