export interface FeaturedVideo {
  id: string;
  title: string;
  duration: string;
  thumbnail: string;
}

// No official channel or dealer video was verified. The retained video section is not exposed.
export const featuredVideos: readonly FeaturedVideo[] = [];
