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
  accent: "#a46d24",
  address: "ГП4, разклон за с. Тополи",
  city: "Варна",
  district: { bg: "Варна", en: "Варна" },
  sellCategoryAssets: {
    car: "/lead-sell-car-v1.png",
    motorbike: "/lead-sell-motorcycle-v1.png",
    truck: "/lead-sell-truck-v1.png",
    van: "/lead-sell-van-v1.png",
  },
  financingArtworkPath: "/images/services/leasing-red-suv-v2.png",
  contactUrl: "tel:+359895766736",
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
    "https://maps.google.com/maps?q=43.22861,27.8253778&z=15&output=embed",
  mapsUrl:
    "https://www.google.com/maps/search/?api=1&query=43.22861,27.8253778",
  name: "Аутолайф",
  phoneDisplay: "0895 766 736",
  phoneHref: "tel:+359895766736",
  shortName: "Аутолайф",
  slug: "autolife",
  socialLinks: {},
  staticDemoMode: true,
  tagline: "Представителна извадка от 16 публикувани обяви; наличност и цена се потвърждават по телефона.",
};
// LEAD_SITE_CONFIG_END
