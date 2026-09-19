import { listReturn } from '$data/journeys';
import { error } from '@sveltejs/kit';
import { blogCategories, blogPosts } from '$data/editorial';
import type { PageLoad } from './$types';

export const load: PageLoad = ({ params, url }) => {
  const isCanonicalId = /^[1-9]\d*$/.test(params.id);
  const postId = Number(params.id);

  if (!isCanonicalId || !Number.isSafeInteger(postId)) {
    error(404, 'Материалът не е намерен.');
  }

  const post = blogPosts.find((item) => item.id === postId);
  if (!post) {
    error(404, 'Материалът не е намерен.');
  }

  const related = blogPosts
    .filter((item) => item.id !== post.id)
    .sort((a, b) => Number(b.category === post.category) - Number(a.category === post.category))
    .slice(0, 3);

  const categories = blogCategories.map((category) => ({
    category,
    count: blogPosts.filter((item) => item.category === category).length
  }));

  const tags = [...new Set(blogPosts.map((item) => item.tag))];

  return { returnTo: listReturn(url.searchParams.get('return'), '/blog'), post, related, categories, tags };
};
