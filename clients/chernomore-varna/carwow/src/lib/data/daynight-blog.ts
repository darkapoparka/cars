import dealer from './dealer-stock.json';
import { dealerGuides } from './dealer-editorial';
export type DayNightArticleCategory = 'Новини' | 'Съвети' | 'Финансиране' | 'Документи' | 'Марки' | 'Покупка' | 'Продажба';
export type DayNightArticleKind = 'news' | 'guide';

export type DayNightArticleSection = {
	heading: string;
	paragraphs: string[];
};

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

type DayNightArticleInput = Omit<DayNightArticle, 'body'>;

function article(input: DayNightArticleInput): DayNightArticle {
	return {
		...input,
		body: [
			input.description,
			...input.summary,
			...input.sections.flatMap((section) => section.paragraphs)
		]
	};
}

const retainedArticles = [
  {
    "slug": "dnevni-novini-daynight-auto-obnovena-nalichnost",
    "guideId": 8
  },
  {
    "slug": "novi-avtomobili-v-nalichnost-daynight-auto",
    "guideId": 2
  },
  {
    "slug": "kak-da-kupim-upotrebyavan-avtomobil",
    "guideId": 1
  },
  {
    "slug": "lizing-upotrebyavan-avtomobil-plovdiv",
    "guideId": 3
  },
  {
    "slug": "dokumenti-registratsia-nov-vnos",
    "guideId": 7
  },
  {
    "slug": "bmw-mercedes-audi-upotrebyavani",
    "guideId": 4
  },
  {
    "slug": "dizel-benzin-hibrid-elektricheski",
    "guideId": 10
  },
  {
    "slug": "kak-da-podgotvim-avtomobil-za-prodazhba",
    "guideId": 6
  },
  {
    "slug": "kakvo-oznachava-proveren-avtomobil",
    "guideId": 9
  }
] as const;
export const daynightArticles: DayNightArticle[] = retainedArticles.map(({ slug, guideId }) => {
  const guide = dealerGuides.find(item => item.id === guideId)!;
  const category: DayNightArticleCategory = guide.category === 'Лизинг' ? 'Финансиране'
    : guide.category === 'Внос' ? 'Документи' : guide.category === 'Бартер' ? 'Продажба' : 'Съвети';
  const paragraphs = guide.sections.map(section => section.body.bg);
  return article({
    slug, title: guide.title.bg, description: guide.description.bg, category, kind: 'guide',
    date: dealer.observedAt, author: 'Демо редакция', image: '/dealer/opengraph.png',
    readMinutes: Math.max(1, Math.ceil(paragraphs.join(' ').split(/\s+/).length / 180)),
    summary: [guide.description.bg],
    sections: guide.sections.map(section => ({ heading: section.heading.bg, paragraphs: [section.body.bg] })),
    tags: [guide.category, dealer.city]
  });
});

export const getDayNightArticleBySlug = (slug: string) =>
	daynightArticles.find((article) => article.slug === slug);

export const getDayNightArticleIndex = (slug: string) =>
	daynightArticles.findIndex((article) => article.slug === slug);
