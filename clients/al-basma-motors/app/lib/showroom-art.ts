export type BannerTheme = 'black' | 'blue';

function artwork(theme: BannerTheme) {
  const base = theme === 'black' ? '/showroom/black' : '/showroom';
  const heroVersion = theme === 'black' ? 'v1' : 'v3';
  return {
    heroes: {
      buy: `${base}/home-hero-${heroVersion}.png`,
      sell: `${base}/sell-hero-${heroVersion}.png`,
      finance: `${base}/finance-hero-${heroVersion}.png`,
      service: `${base}/service-hero-${heroVersion}.png`,
    },
    highlights: {
      collection: `${base}/home-collection-v1.png`,
      finance: `${base}/home-finance-v1.png`,
      exchange: `${base}/home-exchange-v1.png`,
      visit: `${base}/home-visit-v1.png`,
    },
    campaigns: {
      sell: `${base}/sell-campaign-v1.png`,
      care: `${base}/service-care-v1.png`,
      finance: `${base}/finance-valuation-v1.png`,
    },
    ownership: `${base}/ownership-v1.png`,
    servicePackages: {
      routine: '/showroom/black/service-routine-header-v1.png',
      comprehensive: '/showroom/black/service-comprehensive-header-v1.png',
    },
    detail: {
      service: '/showroom/black/pdp-service-v1.png',
      finance: '/showroom/black/pdp-finance-v1.png',
      videoTour: '/showroom/black/pdp-video-tour-v1.png',
    },
    financeBenefits: [1, 2, 3, 4].map(index => theme === 'black'
      ? `/showroom/black/finance-benefit-${index}-v1.png`
      : `/reference-assets/finance-benefit-${index}.png`),
    selling: {
      direct: `${base}/sell-direct-v1.png`,
      exchange: `${base}/sell-exchange-v1.png`,
      valuation: `${base}/sell-valuation-tool-v1.png`,
      history: `${base}/sell-history-tool-v1.png`,
      photos: `${base}/sell-photo-tool-v1.png`,
    },
  };
}

export const bannerArtwork = {black: artwork('black'), blue: artwork('blue')};
