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
  address: "Plot No. 364-0442, Al Quoz Industrial Area 1, Dubai, UAE",
  city: "Dubai",
  district: { bg: "Dubai", en: "Dubai" },
  sellCategoryAssets: {
    car: "/variant-2/lead-sell-car-v1.png",
    motorbike: "/variant-2/lead-sell-motorcycle-v1.png",
    truck: "/variant-2/lead-sell-truck-v1.png",
    van: "/variant-2/lead-sell-van-v1.png",
  },
  financingArtworkPath: "/variant-2/images/services/leasing-red-suv-v2.png",
  contactUrl: "tel:+971551875094",
  country: "United Arab Emirates",
  countryCode: "AE",
  currency: "AED",
  email: "sales@tdp.ae",
  heroPath: "/variant-2/lead-hero.jpg",
  locale: "en-AE",
  logoPath: "/variant-2/assets/brand/logo-on-dark.webp",
  mapsEmbedUrl:
    "https://maps.google.com/maps?q=The%20Dealers%20Point%2C%20Plot%20No.%20364-0442%2C%20Al%20Quoz%20Industrial%20Area%201%2C%20Dubai%2C%20UAE&z=16&output=embed",
  mapsUrl:
    "https://www.google.com/maps/search/?api=1&query=The%20Dealers%20Point%2C%20Plot%20No.%20364-0442%2C%20Al%20Quoz%20Industrial%20Area%201%2C%20Dubai%2C%20UAE",
  name: "The Dealers Point",
  phoneDisplay: "+971 55 187 5094",
  phoneHref: "tel:+971551875094",
  shortName: "Dealers Point",
  slug: "the-dealers-point",
  socialLinks: {},
  staticDemoMode: true,
  tagline: "Dated public stock sample, not a live feed. Confirm price, specifications and availability directly with The Dealers Point. Demo forms do not send messages.",
};
// LEAD_SITE_CONFIG_END
