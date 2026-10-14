export interface BlogPost { slug: string; title: string; category: string; date: string; image: string; excerpt: string; content: string[]; }
export const posts: BlogPost[] = [{
  "slug": "confirm-current-availability",
  "title": "How to confirm current availability at Al Hamoor Al Thahabi",
  "category": "Dealer information",
  "date": "2026-09-09",
  "image": "/assets/daynight/codex-generated-v2/blog/blog-cover-import-check-v2.webp",
  "excerpt": "Dated listing samples; confirm price and availability directly with the dealership.",
  "content": [
    "Contact the dealership on +971 54 555 5204 and identify the exact vehicle before visiting.",
    "Independent design preview. Dated listing samples, not a live stock feed. Confirm availability, price, vehicle condition and location directly. No dealership approval or form delivery is implied."
  ]
}];
export function getPostBySlug(slug: string) { return posts.find((post) => post.slug === slug); }
