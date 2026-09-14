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
	title: "Как да потвърдите актуална наличност в АСКО 96",
	description: "Използвайте конкретната обява и се свържете с автокъщата преди пътуване или решение за покупка.",
	category: 'Съвети',
	kind: 'guide',
	date: "2026-09-06",
	author: "Информация за независим преглед",
	image: '/assets/images/blog/post-20.jpg',
	readMinutes: 2,
	summary: ["Подбрани автомобили от публикуваните обяви. Наличностите и условията се потвърждават с АСКО 96.", "Независим демонстрационен преглед. Формите не изпращат съобщения и не създават резервация."],
	sections: [
		{
			heading: "Преди посещение",
			paragraphs: ["Обадете се на 0899 76 96 96 и посочете точния автомобил, който Ви интересува."]
		},
		{
			heading: "Потвърдете публикуваните данни",
			paragraphs: ["Поискайте потвърждение за цена, наличност, пробег, документи и условия за оглед."]
		}
	],
	tags: ["наличност", "София"],
	body: []
};
article.body = [article.description, ...article.summary, ...article.sections.flatMap((section) => section.paragraphs)];
export const daynightArticles: DayNightArticle[] = [article];
export const getDayNightArticleBySlug = (slug: string) => daynightArticles.find((item) => item.slug === slug);
export const getDayNightArticleIndex = (slug: string) => daynightArticles.findIndex((item) => item.slug === slug);
