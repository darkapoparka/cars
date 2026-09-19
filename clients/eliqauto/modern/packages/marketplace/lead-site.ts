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
  accent: "#c40101",
  address: "ул. Свобода, на гърба на Гробищен парк, Пазарджик",
  city: "Пазарджик",
  district: { bg: "Пазарджик", en: "Пазарджик" },
  sellCategoryAssets: {
    car: "/lead-sell-car-v1.png",
    motorbike: "/lead-sell-motorcycle-v1.png",
    truck: "/lead-sell-truck-v1.png",
    van: "/lead-sell-van-v1.png",
  },
  financingArtworkPath: "/images/services/leasing-red-suv-v2.png",
  contactUrl: "tel:+359896781662",
  country: "Bulgaria",
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
    "https://maps.google.com/maps?q=ELIQ%20AUTO%2C%20%D1%83%D0%BB.%20%D0%A1%D0%B2%D0%BE%D0%B1%D0%BE%D0%B4%D0%B0%2C%20%D0%BD%D0%B0%20%D0%B3%D1%8A%D1%80%D0%B1%D0%B0%20%D0%BD%D0%B0%20%D0%93%D1%80%D0%BE%D0%B1%D0%B8%D1%89%D0%B5%D0%BD%20%D0%BF%D0%B0%D1%80%D0%BA%2C%20%D0%9F%D0%B0%D0%B7%D0%B0%D1%80%D0%B4%D0%B6%D0%B8%D0%BA&z=16&output=embed",
  mapsUrl:
    "https://www.google.com/maps/search/?api=1&query=ELIQ%20AUTO%2C%20%D1%83%D0%BB.%20%D0%A1%D0%B2%D0%BE%D0%B1%D0%BE%D0%B4%D0%B0%2C%20%D0%BD%D0%B0%20%D0%B3%D1%8A%D1%80%D0%B1%D0%B0%20%D0%BD%D0%B0%20%D0%93%D1%80%D0%BE%D0%B1%D0%B8%D1%89%D0%B5%D0%BD%20%D0%BF%D0%B0%D1%80%D0%BA%2C%20%D0%9F%D0%B0%D0%B7%D0%B0%D1%80%D0%B4%D0%B6%D0%B8%D0%BA",
  name: "ELIQ AUTO",
  phoneDisplay: "0896 781 662",
  phoneHref: "tel:+359896781662",
  shortName: "ELIQ AUTO",
  slug: "eliqauto",
  socialLinks: {"youtube":"https://www.youtube.com/channel/UCGXhr1QYqALiBBQpBYZtpmw"},
  staticDemoMode: true,
  tagline: "Датирана извадка от обяви; потвърдете цената и наличността директно с автокъщата.",
};
// LEAD_SITE_CONFIG_END
