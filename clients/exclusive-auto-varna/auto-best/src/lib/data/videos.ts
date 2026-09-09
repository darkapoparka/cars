export interface FeaturedVideo {
  id: string;
  title: string;
  duration: string;
  thumbnail: string;
}

// No corroborated Exclusive Auto video channel was found. Do not reuse another dealer's clips.
export const featuredVideos: readonly FeaturedVideo[] = [];
