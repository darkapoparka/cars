export interface BlogPost { slug: string; title: string; category: string; date: string; image: string; excerpt: string; content: string[]; }
export const posts: BlogPost[] = [{
  "slug": "confirm-current-availability",
  "title": "Как да потвърдите актуална наличност в Exclusive Auto",
  "category": "Информация за автокъщата",
  "date": "2026-09-09",
  "image": "/assets/daynight/codex-generated-v2/blog/blog-cover-import-check-v2.webp",
  "excerpt": "Подбрани публични обяви, наблюдавани на 9 септември 2026 г. Потвърдете актуалната наличност, цена и условия с продавача.",
  "content": [
    "Свържете се с автокъщата на 0895 303 009 и посочете точния автомобил преди посещение.",
    "Демонстрационен проект за обсъждане. Не е официалният сайт на автокъщата."
  ]
}];
export function getPostBySlug(slug: string) { return posts.find((post) => post.slug === slug); }
