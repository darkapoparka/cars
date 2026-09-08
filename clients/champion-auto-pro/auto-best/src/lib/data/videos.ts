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
    "id": "https://championautopro.mobile.bg/obiava-11787294758482309-bmw-ix-40xdrive-m-sport-h-k-360",
    "title": "BMW iX 40Xdrive",
    "duration": "Обява",
    "thumbnail": "/assets/champion/vehicle-01-1.webp"
  },
  {
    "id": "https://championautopro.mobile.bg/obiava-11787311251312869-audi-a6-50tdi-quattro",
    "title": "Audi A6 50TDI Quattro",
    "duration": "Обява",
    "thumbnail": "/assets/champion/vehicle-02-1.webp"
  },
  {
    "id": "https://championautopro.mobile.bg/obiava-11784794853353090-smart-forfour-22kw-26000km",
    "title": "Smart Forfour 22kw.-26000км.",
    "duration": "Обява",
    "thumbnail": "/assets/champion/vehicle-03-1.webp"
  }
];
