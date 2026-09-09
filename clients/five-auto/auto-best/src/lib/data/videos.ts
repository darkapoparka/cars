export interface FeaturedVideo {
  id: string;
  title: string;
  duration: string;
  thumbnail: string;
}

// No corroborated FIVE AUTO video channel is used in this proposal.
export const featuredVideos: readonly FeaturedVideo[] = [];
