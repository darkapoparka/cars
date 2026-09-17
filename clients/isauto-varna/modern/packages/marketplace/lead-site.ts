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
  accent: "#d71920",
  address: "Бизнес парк Варна, сграда B6, Варна, България",
  city: "Варна",
  district: { bg: "Бизнес парк Варна", en: "Бизнес парк Варна" },
  sellCategoryAssets: {
    car: "/lead-sell-car-v1.png",
    motorbike: "/lead-sell-motorcycle-v1.png",
    truck: "/lead-sell-truck-v1.png",
    van: "/lead-sell-van-v1.png",
  },
  financingArtworkPath: "/images/services/leasing-red-suv-v2.png",
  contactUrl: "tel:+359899266666",
  country: "България",
  countryCode: "BG",
  currency: "EUR",
  email: "varna@isauto.net",
  heroPath: "/lead-hero.jpg",
  locale: "bg-BG",
  logoPath: "/assets/brand/logo-on-dark.webp",
  mapsEmbedUrl:
    "https://maps.google.com/maps?q=IS%20AUTO%20Varna%2C%20%D0%91%D0%B8%D0%B7%D0%BD%D0%B5%D1%81%20%D0%BF%D0%B0%D1%80%D0%BA%20%D0%92%D0%B0%D1%80%D0%BD%D0%B0%2C%20%D1%81%D0%B3%D1%80%D0%B0%D0%B4%D0%B0%20B6%2C%20%D0%92%D0%B0%D1%80%D0%BD%D0%B0%2C%20%D0%91%D1%8A%D0%BB%D0%B3%D0%B0%D1%80%D0%B8%D1%8F&z=16&output=embed",
  mapsUrl:
    "https://www.google.com/maps/search/?api=1&query=IS%20AUTO%20Varna%2C%20%D0%91%D0%B8%D0%B7%D0%BD%D0%B5%D1%81%20%D0%BF%D0%B0%D1%80%D0%BA%20%D0%92%D0%B0%D1%80%D0%BD%D0%B0%2C%20%D1%81%D0%B3%D1%80%D0%B0%D0%B4%D0%B0%20B6%2C%20%D0%92%D0%B0%D1%80%D0%BD%D0%B0%2C%20%D0%91%D1%8A%D0%BB%D0%B3%D0%B0%D1%80%D0%B8%D1%8F",
  name: "IS AUTO Varna",
  phoneDisplay: "0899 266 666",
  phoneHref: "tel:+359899266666",
  shortName: "IS AUTO",
  slug: "isauto-varna",
  socialLinks: {"facebook":"https://www.facebook.com/isauto1","instagram":"https://www.instagram.com/is__auto/?hl=bg"},
  staticDemoMode: true,
  tagline: "Датирана извадка от публичните обяви към 16.09.2026 г.; потвърдете цената и наличността директно с IS AUTO Varna.",
};
// LEAD_SITE_CONFIG_END
