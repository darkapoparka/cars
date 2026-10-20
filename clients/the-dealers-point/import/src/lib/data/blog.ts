export interface BlogPost { slug: string; title: string; category: string; date: string; image: string; excerpt: string; content: string[]; }
export const posts: BlogPost[] = [{
  "slug": "confirm-current-availability",
  "title": "How to confirm current availability at Dealers Point",
  "category": "Dealer information",
  "date": "2026-09-09",
  "image": "/assets/daynight/codex-generated-v2/blog/blog-cover-import-check-v2.webp",
  "excerpt": "Dated public stock sample, not a live feed. Confirm price, specifications and availability directly with The Dealers Point. Demo forms do not send messages.",
  "content": [
    "Contact the dealership on +971 55 187 5094 and identify the exact vehicle before visiting.",
    "Proposal refresh and concept stock artwork for unpublished owner review; not represented as official source artwork."
  ]
}];
export function getPostBySlug(slug: string) { return posts.find((post) => post.slug === slug); }
