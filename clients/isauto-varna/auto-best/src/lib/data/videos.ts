export interface FeaturedVideo {
  id: string;
  title: string;
  duration: string;
  thumbnail: string;
}

// IS AUTO does not publish a verified YouTube channel.
// Keep the template video surface empty rather than presenting another dealer's media.
export const featuredVideos: readonly FeaturedVideo[] = [];
