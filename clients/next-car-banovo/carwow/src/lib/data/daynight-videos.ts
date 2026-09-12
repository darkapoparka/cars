import stock from './dealer-stock.json';
// No matching public video channel established. These are real listing-photo links.
export const youtubeChannelUrl = '/inventory';
export const homeVideos = stock.vehicles.slice(0, 3).map((vehicle) => ({ id: vehicle.sourceId, title: vehicle.title, duration: 'Снимки по обява', thumbnail: vehicle.image, url: '/inventory/' + vehicle.slug }));
