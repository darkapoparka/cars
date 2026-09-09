export interface FeaturedVideo {
  id: string;
  title: string;
  duration: string;
  thumbnail: string;
}

// The inherited source-dealer channel is not a DANGER AUTO channel.
// No matching channel or permitted video set was established in this session.
// Keep the template's video component and playback behavior for a sourced set.
export const featuredVideos: readonly FeaturedVideo[] = [];
