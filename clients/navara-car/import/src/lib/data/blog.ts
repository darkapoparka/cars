export interface BlogPost { slug: string; title: string; category: string; date: string; image: string; excerpt: string; content: string[]; }
export const posts: BlogPost[] = [{
  "slug": "confirm-current-availability",
  "title": "Как да потвърдите актуална наличност в Navara Car",
  "category": "Информация за автокъщата",
  "date": "2026-09-08",
  "image": "/assets/daynight/codex-generated-v2/blog/blog-cover-import-check-v2.webp",
  "excerpt": "Селекция от обяви към 08.09.2026 г., а не складова наличност в реално време. Потвърдете цената, наличността и данните с продавача.",
  "content": [
    "Свържете се с автокъщата на 0899 192 300 и посочете точния автомобил преди посещение.",
    "Демонстрационен сайт за преглед — не е официален канал на автокъщата."
  ]
}];
export function getPostBySlug(slug: string) { return posts.find((post) => post.slug === slug); }
