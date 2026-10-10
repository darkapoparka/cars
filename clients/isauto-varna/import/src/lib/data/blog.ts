export interface BlogPost { slug: string; title: string; category: string; date: string; image: string; excerpt: string; content: string[]; }
export const posts: BlogPost[] = [{
  "slug": "confirm-current-availability",
  "title": "Как да потвърдите актуална наличност в IS AUTO",
  "category": "Информация за автокъщата",
  "date": "2026-09-16",
  "image": "/assets/daynight/codex-generated-v2/blog/blog-cover-import-check-v2.webp",
  "excerpt": "Датирана извадка от публичните обяви към 16.09.2026 г.; потвърдете цената и наличността директно с IS AUTO Varna.",
  "content": [
    "Свържете се с автокъщата на 0899 266 666 и посочете точния автомобил преди посещение.",
    "Независим демонстрационен преглед. Формите не изпращат съобщения и не създават резервация."
  ]
}];
export function getPostBySlug(slug: string) { return posts.find((post) => post.slug === slug); }
