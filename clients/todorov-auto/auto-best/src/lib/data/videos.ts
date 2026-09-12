export interface FeaturedVideo {
  id: string;
  title: string;
  duration: string;
  thumbnail: string;
}

// Selected automotive videos from the owner-supplied channel, verified 2026-09-05.
// This is a curated selection, not an automatically refreshed channel feed.
export const featuredVideos: readonly FeaturedVideo[] = [] as FeaturedVideo[];
