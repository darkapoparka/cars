import { daynightContact } from '$lib/data/daynight';

export type AuxeroReviewCard = { avatar: string; id: string; name: string; role: string; stars: number; text: string; };
export type AuxeroReviewsPageData = { facebookHref: string; facebookLabel: string; pageLabel: string; title: string; };
export const auxeroReviewCards: AuxeroReviewCard[] = [];
export const auxeroReviewsPage: AuxeroReviewsPageData = {
	facebookHref: daynightContact.reviewsHref,
	facebookLabel: "Външни отзиви",
	pageLabel: '1',
	title: "В този преглед не са включени потвърдени клиентски отзиви"
};
