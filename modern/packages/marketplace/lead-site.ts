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
  accent: "#454b50",
  address: "Showroom 61, Souq Al Haraj, Sharjah, UAE",
  city: "Sharjah",
  district: { bg: "Sharjah", en: "Sharjah" },
  sellCategoryAssets: {
    car: "/variant-2/lead-sell-car-v1.png",
    motorbike: "/variant-2/lead-sell-motorcycle-v1.png",
    truck: "/variant-2/lead-sell-truck-v1.png",
    van: "/variant-2/lead-sell-van-v1.png",
  },
  financingArtworkPath: "/variant-2/images/services/leasing-red-suv-v2.png",
  contactUrl: "tel:+971543422222",
  country: "United Arab Emirates",
  countryCode: "AE",
  currency: "AED",
  email: "admin@albasmamotors.com",
  heroPath: "/variant-2/lead-hero.jpg",
  locale: "en-AE",
  logoPath: "/variant-2/assets/brand/logo-on-dark.webp",
  mapsEmbedUrl:
    "https://maps.google.com/maps?q=Showroom%2061%2C%20Souq%20Al%20Haraj%2C%20Sharjah%2C%20UAE&z=16&hl=en&output=embed",
  mapsUrl:
    "https://www.google.com/maps/search/?api=1&query=Showroom%2061%2C%20Souq%20Al%20Haraj%2C%20Sharjah%2C%20UAE",
  name: "Al Basma Motors",
  phoneDisplay: "+971 54 342 2222",
  phoneHref: "tel:+971543422222",
  shortName: "Al Basma",
  slug: "al-basma-motors",
  socialLinks: {"facebook":"https://www.facebook.com/albasmamotors","instagram":"https://www.instagram.com/albasmamotors"},
  staticDemoMode: true,
  tagline: "Independent, unpublished design concept. Dated listing samples, not a live stock feed. Confirm price, specifications and availability directly with the showroom. Forms only prepare drafts; nothing is delivered.",
};
// LEAD_SITE_CONFIG_END
