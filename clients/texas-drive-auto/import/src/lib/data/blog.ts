export interface BlogPost { slug: string; title: string; category: string; date: string; image: string; excerpt: string; content: string[]; }
export const posts: BlogPost[] = [{
  "slug": "confirm-current-availability",
  "title": "How to confirm current availability at Texas Drive Auto",
  "category": "Dealer information",
  "date": "2026-09-09",
  "image": "/assets/daynight/codex-generated-v2/blog/blog-cover-import-check-v2.webp",
  "excerpt": "Dated listing samples; confirm price and availability directly with the dealership.",
  "content": [
    "Contact the dealership on (214) 972-3233 and identify the exact vehicle before visiting.",
    "Independent preview. Forms do not send messages and no reservation is created."
  ]
}];
export function getPostBySlug(slug: string) { return posts.find((post) => post.slug === slug); }
