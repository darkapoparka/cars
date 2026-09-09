import { cars } from './daynight-vehicles';
// No published dealer video channel was verified. These cards open real listing galleries.
export const youtubeChannelUrl = '/inventory';
export const homeVideos = cars.slice(0,3).map(car=>({id:car.slug,title:car.shortTitle,duration:'Снимки',thumbnail:car.image,url:`/inventory/${car.slug}`}));
