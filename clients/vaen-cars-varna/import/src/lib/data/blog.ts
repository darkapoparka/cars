export interface BlogPost { slug: string; title: string; category: string; date: string; image: string; excerpt: string; content: string[]; }
export const posts: BlogPost[] = [{
  "slug": "confirm-current-availability",
  "title": "Как да потвърдите актуална наличност в VAEN CARS",
  "category": "Информация за автокъщата",
  "date": "2026-10-12",
  "image": "/assets/daynight/codex-generated-v2/blog/blog-cover-import-check-v2.webp",
  "excerpt": "Датирани обяви за предварителна поръчка при партньор в Нидерландия; потвърдете срока за доставка, цената и наличността с автокъщата.",
  "content": [
    "Свържете се с автокъщата на 0886039057 и посочете точния автомобил преди посещение.",
    "Независим демонстрационен преглед. Формите не изпращат съобщения и не създават резервация."
  ]
}];
export function getPostBySlug(slug: string) { return posts.find((post) => post.slug === slug); }
