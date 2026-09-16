export interface FeaturedVideo {
  id: string;
  title: string;
  duration: string;
  thumbnail: string;
}

// IS AUTO does not publish a verified YouTube channel. Do not inherit another dealer's videos.
export const featuredVideos: readonly FeaturedVideo[] = [];
