export type DayNightArticleCategory =
	| 'Новини'
	| 'Съвети'
	| 'Финансиране'
	| 'Документи'
	| 'Марки'
	| 'Покупка'
	| 'Продажба';
export type DayNightArticleKind = 'news' | 'guide';
export type DayNightArticleSection = { heading: string; paragraphs: string[]; };
export type DayNightArticle = {
	slug: string;
	title: string;
	description: string;
	category: DayNightArticleCategory;
	kind: DayNightArticleKind;
	date: string;
	author: string;
	image: string;
	readMinutes: number;
	summary: string[];
	sections: DayNightArticleSection[];
	tags: string[];
	body: string[];
};

const article: DayNightArticle = {
	slug: 'confirm-current-availability',
	title: "How to confirm current availability at Dealers Point",
	description: "Use the listing reference and contact the dealership before travelling or making a decision.",
	category: 'Съвети',
	kind: 'guide',
	date: "2026-09-09",
	author: "Independent preview information",
	image: '/assets/images/blog/post-20.jpg',
	readMinutes: 2,
	summary: ["Dated public stock sample, not a live feed. Confirm price, specifications and availability directly with The Dealers Point. Demo forms do not send messages.", "Contact the showroom before travelling and confirm availability. Proposal refresh and concept stock artwork for unpublished owner review; not represented as official source artwork."],
	sections: [
		{
			heading: "Before visiting",
			paragraphs: ["Call +971 55 187 5094 and identify the exact vehicle you are interested in."]
		},
		{
			heading: "Confirm the published details",
			paragraphs: ["Ask the dealership to confirm price, availability, mileage, documents, and viewing arrangements."]
		}
	],
	tags: ["availability", "Dubai"],
	body: []
};
article.body = [article.description, ...article.summary, ...article.sections.flatMap((section) => section.paragraphs)];
export const daynightArticles: DayNightArticle[] = [article];
export const getDayNightArticleBySlug = (slug: string) => daynightArticles.find((item) => item.slug === slug);
export const getDayNightArticleIndex = (slug: string) => daynightArticles.findIndex((item) => item.slug === slug);
