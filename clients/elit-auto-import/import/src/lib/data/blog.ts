export interface BlogPost { slug: string; title: string; category: string; date: string; image: string; excerpt: string; content: string[]; }
export const posts: BlogPost[] = [{
  "slug": "confirm-current-availability",
  "title": "Как да потвърдите актуална наличност в ELIT AUTO",
  "category": "Информация за автокъщата",
  "date": "2026-09-07",
  "image": "/assets/daynight/codex-generated-v2/blog/blog-cover-import-check-v2.webp",
  "excerpt": "Подбрани текущо рекламирани автомобили. Наличност, състояние, пробег и условия се потвърждават с продавача.",
  "content": [
    "Свържете се с автокъщата на 0887 777 887 и посочете точния автомобил преди посещение.",
    "Независим демонстрационен преглед. Формите не изпращат съобщения и не създават резервация."
  ]
}];
export function getPostBySlug(slug: string) { return posts.find((post) => post.slug === slug); }
