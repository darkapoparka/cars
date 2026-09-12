export interface FeaturedVideo {
  id: string;
  title: string;
  duration: string;
  thumbnail: string;
}

// Selected automotive videos from the owner-supplied channel, verified 2026-09-05.
// This is a curated selection, not an automatically refreshed channel feed.
export const featuredVideos: readonly FeaturedVideo[] = [
  {
    id: '6S3dLIgeAT8',
    title: 'Най-желаната кола в България | Lamborghini Urus',
    duration: '23:19',
    thumbnail: '/assets/images/lead/day-night-video-urus.webp'
  },
  {
    id: 'zG6rjLpT4u8',
    title: 'Продадох най-новата Панамера',
    duration: '14:33',
    thumbnail: '/assets/images/lead/day-night-video-panamera.webp'
  },
  {
    id: 'w_XaGmIWJFM',
    title: 'Каква е разликата в G-класите',
    duration: '23:03',
    thumbnail: '/assets/images/lead/day-night-video-g-class.webp'
  }
];
