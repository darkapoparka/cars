export interface BlogPost { slug: string; title: string; category: string; date: string; image: string; excerpt: string; content: string[]; }
export const posts: BlogPost[] = [{
  "slug": "confirm-current-availability",
  "title": "Как да потвърдите актуална наличност в ЕВРОПА",
  "category": "Информация за автокъщата",
  "date": "2026-01-01",
  "image": "/assets/daynight/codex-generated-v2/blog/blog-cover-import-check-v2.webp",
  "excerpt": "Демонстрационни автомобили от шаблона, а не наличност на автокъщата. Illustrative template vehicles, not this dealership’s stock.",
  "content": [
    "Свържете се с автокъщата на 0887 600 565 и посочете точния автомобил преди посещение.",
    "Независим демонстрационен преглед; формите не изпращат съобщения и не създават резервации. Independent demonstration: forms do not send enquiries or create reservations."
  ]
}];
export function getPostBySlug(slug: string) { return posts.find((post) => post.slug === slug); }
