export interface FeaturedVideo { id: string; title: string; duration: string; thumbnail: string }
// ELIQ source selection retained from templates/showroom/src/lib/data/eliqauto-media.ts.
// These are curated external videos, not an automatically refreshed feed.
export const featuredVideos: readonly FeaturedVideo[] = [
  { id: 'WK_2HFbtxrs', title: 'Откриването на новия шоурум', duration: '10:14', thumbnail: 'https://i.ytimg.com/vi/WK_2HFbtxrs/hqdefault.jpg' },
  { id: 'd4AK0HnNADU', title: 'Предаване на BMW 740', duration: '11:02', thumbnail: 'https://i.ytimg.com/vi/d4AK0HnNADU/hqdefault.jpg' },
  { id: 'G5SeKj8JZro', title: 'Porsche Panamera Turbo', duration: '5:45', thumbnail: 'https://i.ytimg.com/vi/G5SeKj8JZro/hqdefault.jpg' }
];
