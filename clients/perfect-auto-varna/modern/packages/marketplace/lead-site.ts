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
  readonly logoOnLight: string;
  readonly logoOnDark: string;
  readonly logoOnAccent: string;
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
  accent: "#a50f15",
  address: "бул. Цар Освободител 110, кв. Победа",
  city: "Варна",
  district: { bg: "Варна", en: "Варна" },
  sellCategoryAssets: {
    car: "/lead-sell-car-v1.png",
    motorbike: "/lead-sell-motorcycle-v1.png",
    truck: "/lead-sell-truck-v1.png",
    van: "/lead-sell-van-v1.png",
  },
  financingArtworkPath: "/images/services/leasing-red-suv-v2.png",
  contactUrl: "tel:+359888802226",
  country: "България",
  countryCode: "BG",
  currency: "EUR",
  email: "",
  heroPath: "/lead-hero.jpg",
  locale: "bg-BG",
  logoPath: "/dealer-brand/logo-on-dark.webp",
  logoOnLight: "/dealer-brand/logo-on-light.webp",
  logoOnDark: "/dealer-brand/logo-on-dark.webp",
  logoOnAccent: "/dealer-brand/logo-on-accent.webp",
  mapsEmbedUrl:
    "https://maps.google.com/maps?q=бул.%20Цар%20Освободител%20110,%20кв.%20Победа%20Варна&output=embed",
  mapsUrl:
    "https://www.google.com/maps/search/?api=1&query=%D0%9F%D0%B5%D1%80%D1%84%D0%B5%D0%BA%D1%82%20%D0%90%D1%83%D1%82%D0%BE%2C%20%D0%B1%D1%83%D0%BB.%20%D0%A6%D0%B0%D1%80%20%D0%9E%D1%81%D0%B2%D0%BE%D0%B1%D0%BE%D0%B4%D0%B8%D1%82%D0%B5%D0%BB%20110%2C%20%D0%BA%D0%B2.%20%D0%9F%D0%BE%D0%B1%D0%B5%D0%B4%D0%B0",
  name: "Перфект Ауто",
  phoneDisplay: "0888 802 226",
  phoneHref: "tel:+359888802226",
  shortName: "Перфект Ауто",
  slug: "perfect-auto-varna",
  socialLinks: {},
  staticDemoMode: true,
  tagline: "Представителни обяви към 10.09.2026 г. Потвърдете наличността и условията по телефона.",
};
// LEAD_SITE_CONFIG_END
