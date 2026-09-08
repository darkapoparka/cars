import { daynightArticles } from './daynight-blog';

export interface BlogPost {
	slug: string;
	title: string;
	category: string;
	date: string;
	image: string;
	excerpt: string;
	content: string[];
}

export const posts: BlogPost[] = daynightArticles.map((article) => ({
	slug: article.slug,
	title: article.title,
	category: article.category,
	date: article.date,
	image: article.image,
	excerpt: article.description,
	content: article.body
}));

export function getPostBySlug(slug: string) {
	return posts.find((post) => post.slug === slug);
}
