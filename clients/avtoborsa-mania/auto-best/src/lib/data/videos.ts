export interface FeaturedVideo {
  id: string;
  title: string;
  duration: string;
  thumbnail: string;
}

// No dealer-specific video selection is approved for this demo.
export const featuredVideos: readonly FeaturedVideo[] = [];
