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
  address: "Danube Building - 409 Sheikh Zayed Rd - Al Quoz - Al Quoz 1 - Dubai, UAE",
  city: "Dubai",
  district: { bg: "Dubai", en: "Dubai" },
  sellCategoryAssets: {
    car: "/lead-sell-car-v1.png",
    motorbike: "/lead-sell-motorcycle-v1.png",
    truck: "/lead-sell-truck-v1.png",
    van: "/lead-sell-van-v1.png",
  },
  financingArtworkPath: "/images/services/leasing-red-suv-v2.png",
  contactUrl: "tel:+97143201030",
  country: "United Arab Emirates",
  countryCode: "AE",
  currency: "AED",
  email: "info@f1rstmotors.com",
  heroPath: "/lead-hero.jpg",
  locale: "en-AE",
  logoPath: "/assets/brand/logo-on-dark.webp",
  mapsEmbedUrl:
    "https://maps.google.com/maps?q=F1rst%20Motors%2C%20Danube%20Building%20-%20409%20Sheikh%20Zayed%20Rd%20-%20Al%20Quoz%20-%20Al%20Quoz%201%20-%20Dubai%2C%20UAE&z=16&output=embed",
  mapsUrl:
    "https://www.google.com/maps/search/?api=1&query=F1rst%20Motors%2C%20Danube%20Building%20-%20409%20Sheikh%20Zayed%20Rd%20-%20Al%20Quoz%20-%20Al%20Quoz%201%20-%20Dubai%2C%20UAE",
  name: "F1rst Motors",
  phoneDisplay: "+971 4 320 1030",
  phoneHref: "tel:+97143201030",
  shortName: "F1rst Motors",
  slug: "f1rst-motors",
  socialLinks: {},
  staticDemoMode: true,
  tagline: "Dated public stock sample, not a live feed. Confirm price, specifications and availability directly with F1rst Motors. Demo forms do not send messages.",
};
// LEAD_SITE_CONFIG_END
