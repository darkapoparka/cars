export interface FeaturedVideo {
  id: string;
  title: string;
  duration: string;
  thumbnail: string;
}

// Selected automotive videos from the owner-supplied channel, verified 2026-09-05.
// This is a curated selection, not an automatically refreshed channel feed.
export const featuredVideos = [
  {
    "id": "11786049135297264",
    "title": "Rolls-Royce Ghost",
    "duration": "Обява",
    "thumbnail": "/assets/ivo-auto/vehicle-01-1.webp",
    "url": "https://ivoauto-varna.mobile.bg/obiava-11786049135297264-rolls-royce-ghost"
  },
  {
    "id": "11784822971964926",
    "title": "Audi A4 S-line 4x4 2.0T",
    "duration": "Обява",
    "thumbnail": "/assets/ivo-auto/vehicle-02-1.webp",
    "url": "https://ivoauto-varna.mobile.bg/obiava-11784822971964926-audi-a4-s-line-4x4-2-0t"
  },
  {
    "id": "11775231551222536",
    "title": "Porsche Panamera Turbo 4.8i",
    "duration": "Обява",
    "thumbnail": "/assets/ivo-auto/vehicle-03-1.webp",
    "url": "https://ivoauto-varna.mobile.bg/obiava-11775231551222536-porsche-panamera-turbo-4-8i"
  }
];
