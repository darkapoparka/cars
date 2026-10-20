export interface BlogPost { slug: string; title: string; category: string; date: string; image: string; excerpt: string; content: string[]; }
export const posts: BlogPost[] = [{
  "slug": "confirm-current-availability",
  "title": "Как да потвърдите актуална наличност в К&K AUTO",
  "category": "Информация за автокъщата",
  "date": "2026-10-12",
  "image": "/assets/daynight/codex-generated-v2/blog/blog-cover-import-check-v2.webp",
  "excerpt": "Показаните демонстрационни автомобили са илюстративни и не представляват наличности на автокъщата. За действителните оферти и наличности се свържете директно с нея.",
  "content": [
    "Свържете се с автокъщата на 0899818608 и посочете точния автомобил преди посещение.",
    "Независим демонстрационен преглед. Формите не изпращат съобщения и не създават резервация."
  ]
}];
export function getPostBySlug(slug: string) { return posts.find((post) => post.slug === slug); }
