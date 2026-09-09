export interface FeaturedVideo {
  id: string;
  title: string;
  duration: string;
  thumbnail: string;
}

// No confirmed dealer video channel is included.
export const featuredVideos: readonly FeaturedVideo[] = [];
