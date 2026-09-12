import { dealerGuides } from './dealer-editorial';

export type BlogCategory = 'Оглед' | 'Внос' | 'Лизинг' | 'Насоки' | 'Бартер';

export type BlogPost = {
  id: number;
  title: string;
  text: string;
  category: BlogCategory;
  tag: string;
  image: string;
  sections: Array<{
    title: string;
    paragraphs: string[];
  }>;
};

export type BlogFilters = {
  q: string;
  category: BlogCategory | '';
};

export const blogPosts: BlogPost[] = dealerGuides.filter(guide => guide.id <= 9).map(guide => ({
  id: guide.id, title: guide.title.bg, text: guide.description.bg,
  category: guide.category, tag: guide.category, image: '/dealer/opengraph.png',
  sections: guide.sections.map(section => ({ title: section.heading.bg, paragraphs: [section.body.bg] }))
}));

export const blogCategories: BlogCategory[] = ['Оглед', 'Внос', 'Лизинг', 'Насоки', 'Бартер'];

const isBlogCategory = (value: string | null): value is BlogCategory =>
  Boolean(value && blogCategories.includes(value as BlogCategory));

export const parseBlogFilters = (params: URLSearchParams): BlogFilters => ({
  q: params.get('q')?.trim() ?? '',
  category: isBlogCategory(params.get('category')) ? params.get('category') as BlogCategory : ''
});

const normalize = (value: string) => value.trim().toLocaleLowerCase('bg-BG');

export const filterBlogPosts = (posts: BlogPost[], filters: BlogFilters) => {
  const query = normalize(filters.q);
  return posts.filter((post) => {
    if (filters.category && post.category !== filters.category) return false;
    if (!query) return true;
    return normalize(`${post.title} ${post.text} ${post.category} ${post.tag}`).includes(query);
  });
};

export const blogFilterHref = (filters: BlogFilters, category: BlogCategory | '') => {
  const params = new URLSearchParams();
  if (filters.q) params.set('q', filters.q);
  if (category) params.set('category', category);
  const query = params.toString();
  return query ? `/blog?${query}` : '/blog';
};
