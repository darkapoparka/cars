export interface BlogPost { slug: string; title: string; category: string; date: string; image: string; excerpt: string; content: string[]; }
export const posts: BlogPost[] = [{
  "slug": "confirm-current-availability",
  "title": "Как да потвърдите актуална наличност в K-G Team Auto",
  "category": "Информация за автокъщата",
  "date": "2026-09-09",
  "image": "/assets/daynight/codex-generated-v2/blog/blog-cover-import-check-v2.webp",
  "excerpt": "Датирани примерни обяви, не потвърдена наличност. Проверете цена, състояние и местоположение при продавача.",
  "content": [
    "Свържете се с автокъщата на +359877346262 и посочете точния автомобил преди посещение.",
    "Unapproved, unpublished prospect concept. No dealer agreement or media permission evidenced."
  ]
}];
export function getPostBySlug(slug: string) { return posts.find((post) => post.slug === slug); }
