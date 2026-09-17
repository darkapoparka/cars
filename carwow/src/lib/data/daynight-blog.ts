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
	title: "How to confirm current availability at Al Hamoor Al Thahabi",
	description: "Use the listing reference and contact the dealership before travelling or making a decision.",
	category: 'Съвети',
	kind: 'guide',
	date: "2026-09-09",
	author: "Independent preview information",
	image: '/variant-3/assets/images/blog/post-20.jpg',
	readMinutes: 2,
	summary: ["Dated listing samples; confirm price and availability directly with the dealership.", "Contact the showroom before travelling and confirm availability."],
	sections: [
		{
			heading: "Before visiting",
			paragraphs: ["Call +971 54 555 5204 and identify the exact vehicle you are interested in."]
		},
		{
			heading: "Confirm the published details",
			paragraphs: ["Ask the dealership to confirm price, availability, mileage, documents, and viewing arrangements."]
		}
	],
	tags: ["availability", "Sharjah"],
	body: []
};
article.body = [article.description, ...article.summary, ...article.sections.flatMap((section) => section.paragraphs)];
export const daynightArticles: DayNightArticle[] = [article];
export const getDayNightArticleBySlug = (slug: string) => daynightArticles.find((item) => item.slug === slug);
export const getDayNightArticleIndex = (slug: string) => daynightArticles.findIndex((item) => item.slug === slug);
