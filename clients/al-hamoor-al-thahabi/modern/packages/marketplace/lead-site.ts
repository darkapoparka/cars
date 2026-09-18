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
  accent: "#c13f38",
  address: "Souk Al Haraj, showroom 353, Sharjah",
  city: "Sharjah",
  district: { bg: "Sharjah", en: "Sharjah" },
  sellCategoryAssets: {
    car: "/lead-sell-car-v1.png",
    motorbike: "/lead-sell-motorcycle-v1.png",
    truck: "/lead-sell-truck-v1.png",
    van: "/lead-sell-van-v1.png",
  },
  financingArtworkPath: "/images/services/leasing-red-suv-v2.png",
  contactUrl: "tel:+971545555204",
  country: "United Arab Emirates",
  countryCode: "AE",
  currency: "AED",
  email: "",
  heroPath: "/lead-hero.jpg",
  locale: "en-AE",
  logoPath: "/assets/brand/logo-on-dark.webp",
  mapsEmbedUrl:
    "https://maps.google.com/maps?q=Al+Hamoor+Al+Thahabi+Souk+Al+Haraj+353+Sharjah&output=embed",
  mapsUrl:
    "https://www.google.com/maps/search/?api=1&query=Al+Hamoor+Al+Thahabi+Souk+Al+Haraj+353+Sharjah",
  name: "Al Hamoor Al Thahabi Used Cars",
  phoneDisplay: "+971 54 555 5204",
  phoneHref: "tel:+971545555204",
  shortName: "Al Hamoor Al Thahabi",
  slug: "al-hamoor-al-thahabi",
  socialLinks: {},
  staticDemoMode: true,
  tagline: "Dated listing samples; confirm price and availability directly with the dealership.",
};
// LEAD_SITE_CONFIG_END
