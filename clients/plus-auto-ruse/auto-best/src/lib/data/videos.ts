import dealer from './dealer-records.json';
export interface FeaturedVideo { id:string; title:string; duration:string; thumbnail:string; href:string; youtubeId?:string; }
// No dealer video channel was verified. The retained media cards use actual listing photographs.
export const featuredVideos:readonly FeaturedVideo[]=dealer.vehicles.slice(0,3).map(v=>({id:v.sourceId,title:v.title,duration:'Снимки',thumbnail:v.images[0],href:`/listing-detail-v1/${v.id}`}));
