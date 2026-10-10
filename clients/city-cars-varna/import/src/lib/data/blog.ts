export interface BlogPost { slug: string; title: string; category: string; date: string; image: string; excerpt: string; content: string[]; }
export const posts: BlogPost[] = [{
  "slug": "confirm-current-availability",
  "title": "Как да потвърдите актуална наличност в Сити Карс",
  "category": "Информация за автокъщата",
  "date": "2026-10-10",
  "image": "/assets/daynight/codex-generated-v2/blog/blog-cover-import-check-v2.webp",
  "excerpt": "Датирана извадка от публични обяви, не складова система в реално време. Потвърдете цената, ДДС и наличността. Обявите за очакван внос не означават наличен автомобил във Варна.",
  "content": [
    "Свържете се с автокъщата на 0899867804 и посочете точния автомобил преди посещение.",
    "Независим демонстрационен преглед. Формите не изпращат съобщения и не създават резервация."
  ]
}];
export function getPostBySlug(slug: string) { return posts.find((post) => post.slug === slug); }
