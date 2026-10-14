export interface BlogPost { slug: string; title: string; category: string; date: string; image: string; excerpt: string; content: string[]; }
export const posts: BlogPost[] = [{
  "slug": "confirm-current-availability",
  "title": "How to confirm current availability at Al Basma",
  "category": "Dealer information",
  "date": "2026-09-08",
  "image": "/assets/daynight/codex-generated-v2/blog/blog-cover-import-check-v2.webp",
  "excerpt": "Independent, unpublished design concept. Dated listing samples, not a live stock feed. Confirm price, specifications and availability directly with the showroom. Forms only prepare drafts; nothing is delivered.",
  "content": [
    "Contact the dealership on +971 54 342 2222 and identify the exact vehicle before visiting.",
    "Independent preview. Forms do not send messages and no reservation is created."
  ]
}];
export function getPostBySlug(slug: string) { return posts.find((post) => post.slug === slug); }
