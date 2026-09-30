export interface FeaturedVideo {
  id: string;
  title: string;
  duration: string;
  thumbnail: string;
}

// Dealer builds add verified videos from their own channel here.
export const featuredVideos: readonly FeaturedVideo[] = [];
