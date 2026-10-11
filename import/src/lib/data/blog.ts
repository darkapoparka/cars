export interface BlogPost { slug: string; title: string; category: string; date: string; image: string; excerpt: string; content: string[]; }
export const posts: BlogPost[] = [{
  "slug": "confirm-current-availability",
  "title": "How to confirm current availability at Broadbent Car and Servicing",
  "category": "Dealer information",
  "date": "2026-10-10",
  "image": "/assets/daynight/codex-generated-v2/blog/blog-cover-import-check-v2.webp",
  "excerpt": "Vehicle images are generated illustrations, not photographs of the advertised vehicles. Listing details were observed on 10 October 2026; confirm each original advert, price, condition and availability with the dealership.",
  "content": [
    "Contact the dealership on 07398 540293 and identify the exact vehicle before visiting.",
    "Independent design preview for discussion, not an official dealership website. Forms do not send messages or create reservations."
  ]
}];
export function getPostBySlug(slug: string) { return posts.find((post) => post.slug === slug); }
