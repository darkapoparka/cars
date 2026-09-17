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
	title: "Как да потвърдите актуална наличност в AVANGARD AUTO",
	description: "Използвайте конкретната обява и се свържете с автокъщата преди пътуване или решение за покупка.",
	category: 'Съвети',
	kind: 'guide',
	date: "2026-09-06",
	author: "Информация за независим преглед",
	image: '/assets/images/blog/post-20.jpg',
	readMinutes: 2,
	summary: ["Датирана извадка от обяви; потвърдете цената и наличността директно с автокъщата.", "Свържете се с автокъщата преди посещение и потвърдете наличността."],
	sections: [
		{
			heading: "Преди посещение",
			paragraphs: ["Обадете се на 0877 800 921 и посочете точния автомобил, който Ви интересува."]
		},
		{
			heading: "Потвърдете публикуваните данни",
			paragraphs: ["Поискайте потвърждение за цена, наличност, пробег, документи и условия за оглед."]
		}
	],
	tags: ["наличност", "Варна"],
	body: []
};
article.body = [article.description, ...article.summary, ...article.sections.flatMap((section) => section.paragraphs)];
export const daynightArticles: DayNightArticle[] = [article];
export const getDayNightArticleBySlug = (slug: string) => daynightArticles.find((item) => item.slug === slug);
export const getDayNightArticleIndex = (slug: string) => daynightArticles.findIndex((item) => item.slug === slug);
