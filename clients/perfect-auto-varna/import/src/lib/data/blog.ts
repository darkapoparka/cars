export interface BlogPost { slug: string; title: string; category: string; date: string; image: string; excerpt: string; content: string[]; }
export const posts: BlogPost[] = [{
  "slug": "confirm-current-availability",
  "title": "Как да потвърдите актуална наличност в Перфект Ауто",
  "category": "Информация за автокъщата",
  "date": "2026-09-10",
  "image": "/assets/daynight/codex-generated-v2/blog/blog-cover-import-check-v2.webp",
  "excerpt": "Представителни обяви към 10.09.2026 г. Потвърдете наличността и условията по телефона.",
  "content": [
    "Свържете се с автокъщата на 0888 802 226 и посочете точния автомобил преди посещение.",
    "Независим демонстрационен преглед. Формите не изпращат съобщения и не създават резервация."
  ]
}];
export function getPostBySlug(slug: string) { return posts.find((post) => post.slug === slug); }
