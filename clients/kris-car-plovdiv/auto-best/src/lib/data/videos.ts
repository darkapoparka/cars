// Same editorial gallery slots, using real listing photographs rather than another dealer video channel.
export interface FeaturedVideo { id:string;title:string;duration:string;thumbnail:string;href:string; }
export const featuredVideos: readonly FeaturedVideo[] = [
  {
    "id": "11788863173361582",
    "title": "Toyota Camry 2.5 Hybrid Comfort",
    "duration": "4 снимки",
    "thumbnail": "/dealer/stock/11788863173361582-1.webp",
    "href": "/listing-detail-v1/1"
  },
  {
    "id": "21788856265448667",
    "title": "SEAT Ateca 4x4 2.0 TDI",
    "duration": "4 снимки",
    "thumbnail": "/dealer/stock/21788856265448667-1.webp",
    "href": "/listing-detail-v1/2"
  },
  {
    "id": "21781080017250424",
    "title": "Volkswagen Tiguan Elegance 4x4",
    "duration": "4 снимки",
    "thumbnail": "/dealer/stock/21781080017250424-1.webp",
    "href": "/listing-detail-v1/3"
  }
];
