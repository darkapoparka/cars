export interface BlogPost { slug: string; title: string; category: string; date: string; image: string; excerpt: string; content: string[]; }
export const posts: BlogPost[] = [{
  "slug": "confirm-current-availability",
  "title": "How to confirm current availability at F1rst Motors",
  "category": "Dealer information",
  "date": "2026-09-09",
  "image": "/assets/daynight/codex-generated-v2/blog/blog-cover-import-check-v2.webp",
  "excerpt": "Dated public stock sample, not a live feed. Confirm price, specifications and availability directly with F1rst Motors. Demo forms do not send messages.",
  "content": [
    "Contact the dealership on +971 4 320 1030 and identify the exact vehicle before visiting.",
    "F1rst Motors terms state that site logos/images/content require prior written consent. The committed branding and stock illustrations are internal proposal concepts, not copied official assets."
  ]
}];
export function getPostBySlug(slug: string) { return posts.find((post) => post.slug === slug); }
