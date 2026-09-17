export type SiteAssetPath = `/${string}`;

type RouteHeroAsset = 'cars' | 'keys' | 'guide' | 'silver' | 'graphite' | 'portrait' | 'phone' | 'showroom' | 'email';
type RouteHeroVariant = 'cars' | 'keys' | 'guide' | 'about' | 'contact' | 'sell';
type VehicleArtworkKey = 'silver' | 'graphite' | 'gclass' | 'urus' | 'golf' | 'a45' | 'porsche' | 'amggt' | 'm5' | 'e63' | 'm4' | 'rs5';
type HeroVehiclePair = 'home' | 'inventory' | 'about' | 'blog' | 'contact';

type LeadSiteConfig = {
  theme: {
    accent: string;
    accentHover: string;
    accentRgb: string;
    workflowCanvas: string;
    heroSurface: string;
    heroSurfaceDeep: string;
    heroSurfaceMid: string;
    heroAccentDeep: string;
    contactSurface: string;
    contactSurfaceEnd: string;
    campaignSurface: string;
    campaignAccent: string;
    blogHeroSurface: string;
    actionTones: {
      blue: readonly [string, string];
      red: readonly [string, string];
      ice: readonly [string, string];
      iceInk: string;
      dark: readonly [string, string];
    };
  };
  artwork: {
    contactHero: { desktop: SiteAssetPath; sellMobile: SiteAssetPath; importMobile: SiteAssetPath; support: SiteAssetPath };
    blogHero: SiteAssetPath;
    editorialBanner: SiteAssetPath;
    home: { collection: SiteAssetPath; sell: SiteAssetPath; sellCompact: SiteAssetPath; import: SiteAssetPath };
    routeHero: {
      standard: Record<RouteHeroAsset, SiteAssetPath>;
      colored: Partial<Record<RouteHeroAsset, SiteAssetPath>>;
      pairs: Record<RouteHeroVariant, readonly [RouteHeroAsset, RouteHeroAsset]>;
    };
    vehicleCutouts: Record<VehicleArtworkKey, SiteAssetPath>;
    heroVehiclePairs: Record<HeroVehiclePair, readonly [VehicleArtworkKey, VehicleArtworkKey]>;
    mobileHero: { car: SiteAssetPath; sell: SiteAssetPath; import: SiteAssetPath; home: SiteAssetPath };
    inventoryDemo: Record<'stock01' | 'stock02' | 'stock03' | 'stock04' | 'stock05' | 'stock06', SiteAssetPath>;
    videos: Record<'urus' | 'panamera' | 'gclass', SiteAssetPath>;
    pdp: { importGuide: SiteAssetPath; finance: SiteAssetPath; seller: SiteAssetPath };
  };
};

const collection = '/assets/images/lead/day-night-collection-banner-v2.webp' as const;
const mobileSell = '/assets/images/lead/day-night-mobile-sell-v1.webp' as const;
const mobileImport = '/assets/images/lead/day-night-mobile-import-v1.webp' as const;

const vehicleCutouts = {
  silver: '/assets/images/lead/day-night-cutout-silver-v1.webp?v=profile-1',
  graphite: '/assets/images/lead/day-night-cutout-graphite-v1.webp?v=profile-1',
  gclass: '/assets/images/lead/day-night-cutout-gclass-v1.webp?v=profile-1',
  urus: '/assets/images/lead/day-night-cutout-urus-v1.webp?v=profile-1',
  golf: '/assets/images/lead/day-night-cutout-golf-v1.webp?v=profile-1',
  a45: '/assets/images/lead/day-night-cutout-a45-v1.webp?v=profile-1',
  porsche: '/assets/images/lead/day-night-cutout-porsche-v1.webp?v=profile-1',
  amggt: '/assets/images/lead/day-night-cutout-amggt-v1.webp?v=profile-1',
  m5: '/assets/images/lead/day-night-cutout-m5-v1.webp?v=profile-1',
  e63: '/assets/images/lead/day-night-cutout-e63-v1.webp?v=profile-1',
  m4: '/assets/images/lead/day-night-cutout-m4-v1.webp?v=profile-1',
  rs5: '/assets/images/lead/day-night-cutout-rs5-v1.webp?v=profile-1'
} as const satisfies Record<VehicleArtworkKey, SiteAssetPath>;

export const leadSite = {
  theme: {
    accent: '#c40101',
    accentHover: '#a90000',
    accentRgb: '196 1 1',
    workflowCanvas: '#a90f1c',
    heroSurface: '#171a1f',
    heroSurfaceDeep: '#15181d',
    heroSurfaceMid: '#202329',
    heroAccentDeep: '#78000f',
    contactSurface: '#1d1f23',
    contactSurfaceEnd: '#191c20',
    campaignSurface: '#18191c',
    campaignAccent: '#b80024',
    blogHeroSurface: '#f0c84b',
    actionTones: {
      blue: ['#135da8', '#0d3d72'],
      red: ['#d00832', '#9b001f'],
      ice: ['#e8f4ff', '#c8e3f8'],
      iceInk: '#15202c',
      dark: ['#23262b', '#111317']
    }
  },
  artwork: {
    contactHero: {
      desktop: '/assets/images/lead/day-night-contact-hero-v2.webp',
      sellMobile: '/assets/images/lead/day-night-sell-banner-v1.webp',
      importMobile: '/assets/images/lead/day-night-import-banner-v1.webp',
      support: '/assets/images/lead/day-night-contact-phone-red-v1.webp'
    },
    blogHero: '/assets/images/lead/day-night-blog-hero-v2.webp',
    editorialBanner: '/assets/images/lead/day-night-editorial-banner-v2.webp',
    home: {
      collection,
      sell: mobileSell,
      sellCompact: '/assets/images/lead/day-night-sell-banner-v2.webp',
      import: mobileImport
    },
    routeHero: {
      standard: {
        cars: '/assets/images/lead/day-night-studio-cars-v1.webp',
        keys: '/assets/images/lead/day-night-studio-keys-v1.webp',
        guide: '/assets/images/lead/day-night-studio-guide-v1.webp',
        silver: '/assets/images/lead/day-night-hero-silver-v1.webp',
        graphite: '/assets/images/lead/day-night-hero-graphite-v1.webp',
        portrait: '/assets/images/lead/day-night-about-kristian-v1-light.webp',
        phone: '/assets/images/lead/day-night-contact-kristian-phone-v1-light.webp',
        showroom: '/assets/images/lead/day-night-about-showroom-v1-light.webp',
        email: '/assets/images/lead/day-night-contact-email-v1-light.webp'
      },
      colored: {
        silver: '/assets/images/lead/day-night-silver-color-v1.webp',
        graphite: '/assets/images/lead/day-night-graphite-color-v1.webp',
        showroom: '/assets/images/lead/day-night-showroom-color-v1.webp',
        portrait: '/assets/images/lead/day-night-portrait-color-v1.webp',
        guide: '/assets/images/lead/day-night-guide-yellow-v1.webp',
        keys: '/assets/images/lead/day-night-keys-yellow-v1.webp',
        phone: '/assets/images/lead/day-night-contact-phone-red-v1.webp',
        email: '/assets/images/lead/day-night-contact-email-red-v1.webp'
      },
      pairs: {
        cars: ['silver', 'graphite'],
        keys: ['cars', 'keys'],
        guide: ['guide', 'keys'],
        about: ['showroom', 'portrait'],
        contact: ['phone', 'email'],
        sell: ['portrait', 'keys']
      }
    },
    vehicleCutouts,
    heroVehiclePairs: {
      home: ['gclass', 'urus'],
      inventory: ['golf', 'a45'],
      about: ['porsche', 'amggt'],
      blog: ['m5', 'e63'],
      contact: ['m4', 'rs5']
    },
    mobileHero: {
      car: '/assets/images/lead/day-night-urus-front-v1.webp',
      sell: mobileSell,
      import: mobileImport,
      home: collection
    },
    inventoryDemo: {
      stock01: '/assets/images/lead/day-night-stock-01.webp',
      stock02: '/assets/images/lead/day-night-stock-02.webp',
      stock03: '/assets/images/lead/day-night-stock-03.webp',
      stock04: '/assets/images/lead/day-night-stock-04.webp',
      stock05: '/assets/images/lead/day-night-stock-05.webp',
      stock06: '/assets/images/lead/day-night-stock-06.webp'
    },
    videos: {
      urus: '/assets/images/lead/day-night-video-urus.jpg',
      panamera: '/assets/images/lead/day-night-video-panamera.jpg',
      gclass: '/assets/images/lead/day-night-video-g-class.jpg'
    },
    pdp: {
      importGuide: '/assets/images/lead/import-how-generated-v1.webp',
      finance: '/assets/images/lead/pdp-finance-clean-mobile.webp',
      seller: '/assets/images/lead/pdp-seller-clean-mobile.webp'
    }
  }
} as const satisfies LeadSiteConfig;

export type LeadRouteHeroVariant = keyof typeof leadSite.artwork.routeHero.pairs;
export type LeadRouteHeroAsset = keyof typeof leadSite.artwork.routeHero.standard;
export type LeadVehicleArtwork = keyof typeof leadSite.artwork.vehicleCutouts;
export type LeadHeroVehiclePair = keyof typeof leadSite.artwork.heroVehiclePairs;
