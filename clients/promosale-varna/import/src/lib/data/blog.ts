export interface BlogPost { slug: string; title: string; category: string; date: string; image: string; excerpt: string; content: string[]; }
export const posts: BlogPost[] = [{
  "slug": "confirm-current-availability",
  "title": "Как да потвърдите актуална наличност в Promosale Varna",
  "category": "Информация за автокъщата",
  "date": "2026-09-09",
  "image": "/assets/daynight/codex-generated-v2/blog/blog-cover-import-check-v2.webp",
  "excerpt": "Датирана извадка от обяви; потвърдете цената и наличността директно с автокъщата.",
  "content": [
    "Свържете се с автокъщата на 0892 020 208 и посочете точния автомобил преди посещение.",
    "Независим демонстрационен преглед. Формите не изпращат съобщения и не създават резервация."
  ]
}];
export function getPostBySlug(slug: string) { return posts.find((post) => post.slug === slug); }
