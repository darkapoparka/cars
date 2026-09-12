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
    title: 'The most wanted car in Bulgaria | Lamborghini Urus',
    duration: '23:19',
    thumbnail: '/assets/images/lead/day-night-video-urus.jpg'
  },
  {
    id: 'zG6rjLpT4u8',
    title: 'I sold the latest Panamera',
    duration: '14:33',
    thumbnail: '/assets/images/lead/day-night-video-panamera.jpg'
  },
  {
    id: 'w_XaGmIWJFM',
    title: 'What is the difference between the G-Class models',
    duration: '23:03',
    thumbnail: '/assets/images/lead/day-night-video-g-class.jpg'
  }
];
