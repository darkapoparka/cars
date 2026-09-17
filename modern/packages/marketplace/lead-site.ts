export type LeadSiteCurrency = "AED" | "BGN" | "EUR" | "USD";

export interface LeadSiteConfig {
  readonly accent: string;
  readonly address: string;
  readonly city: string;
  readonly contactUrl: string;
  readonly country: string;
  readonly countryCode: string;
  readonly currency: LeadSiteCurrency;
  readonly district: { readonly bg: string; readonly en: string };
  readonly email: string;
  readonly financingArtworkPath: string;
  readonly heroPath: string;
  readonly locale: string;
  readonly logoPath: string;
  readonly mapsEmbedUrl: string;
  readonly mapsUrl: string;
  readonly name: string;
  readonly phoneDisplay: string;
  readonly phoneHref: string;
  readonly sellCategoryAssets: Readonly<
    Record<"car" | "motorbike" | "truck" | "van", string>
  >;
  readonly shortName: string;
  readonly slug: string;
  readonly socialLinks?: Partial<
    Record<"youtube" | "instagram" | "facebook" | "tiktok", string>
  >;
  readonly staticDemoMode: boolean;
  readonly tagline: string;
}

// LEAD_SITE_CONFIG_START
export const leadSite: LeadSiteConfig = {
  accent: "#c40101",
  address: "10511 Olympic Drive, Dallas, TX 75220",
  city: "Dallas",
  district: { bg: "Texas", en: "Texas" },
  sellCategoryAssets: {
    car: "/variant-2/lead-sell-car-v1.png",
    motorbike: "/variant-2/lead-sell-motorcycle-v1.png",
    truck: "/variant-2/lead-sell-truck-v1.png",
    van: "/variant-2/lead-sell-van-v1.png",
  },
  financingArtworkPath: "/variant-2/images/services/leasing-red-suv-v2.png",
  contactUrl: "tel:+12149723233",
  country: "United States",
  countryCode: "US",
  currency: "USD",
  email: "",
  heroPath: "/variant-2/lead-hero.jpg",
  locale: "en-US",
  logoPath: "/variant-2/assets/brand/logo-on-dark.webp",
  mapsEmbedUrl:
    "https://maps.google.com/maps?q=Texas%20Drive%20Auto%2C%2010511%20Olympic%20Drive%2C%20Dallas%2C%20TX%2075220&z=16&output=embed",
  mapsUrl:
    "https://www.google.com/maps/search/?api=1&query=Texas%20Drive%20Auto%2C%2010511%20Olympic%20Drive%2C%20Dallas%2C%20TX%2075220",
  name: "Texas Drive Auto",
  phoneDisplay: "(214) 972-3233",
  phoneHref: "tel:+12149723233",
  shortName: "Texas Drive Auto",
  slug: "texas-drive-auto",
  socialLinks: {},
  staticDemoMode: true,
  tagline: "Dated listing samples; confirm price and availability directly with the dealership.",
};
// LEAD_SITE_CONFIG_END
