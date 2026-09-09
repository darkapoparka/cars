export type LeadSiteCurrency = "AED" | "BGN" | "EUR" | "USD";

export interface LeadSiteConfig {
  readonly accent: string;
  readonly address: string;
  readonly city: string;
  readonly contactUrl: string;
  readonly country: string;
  readonly countryCode: string;
  readonly currency: LeadSiteCurrency;
  readonly email: string;
  readonly heroPath: string;
  readonly locale: string;
  readonly logoPath: string;
  readonly mapsEmbedUrl: string;
  readonly mapsUrl: string;
  readonly name: string;
  readonly phoneDisplay: string;
  readonly phoneHref: string;
  readonly shortName: string;
  readonly slug: string;
  readonly socialLinks?: Partial<Record<"youtube" | "instagram" | "facebook" | "tiktok", string>>;
  readonly staticDemoMode: boolean;
  readonly tagline: string;
}

export const leadSite: LeadSiteConfig = {
  accent: "#b88a16",
  address: "Пловдив · точен адрес при потвърждение",
  city: "Пловдив",
  contactUrl: "tel:+359878979712",
  country: "България",
  countryCode: "BG",
  currency: "EUR",
  email: "",
  heroPath: "/dealer/stock/cla-demo.svg",
  locale: "bg-BG",
  logoPath: "/dealer/brand/logo-light.svg",
  mapsEmbedUrl: "https://www.google.com/maps?q=GoldenDreams%20AUTO%2C%20Plovdiv&z=13&output=embed",
  mapsUrl: "https://www.google.com/maps/search/?api=1&query=GoldenDreams%20AUTO%20Plovdiv",
  name: "GoldenDreams AUTO",
  phoneDisplay: "0878 979 712",
  phoneHref: "tel:+359878979712",
  shortName: "GoldenDreams",
  slug: "golden-dreams-auto",
  socialLinks: {
    facebook: "https://www.facebook.com/people/GoldenDreams-AUTO/61592803643776/",
    instagram: "https://www.instagram.com/goldendreamsauto/"
  },
  staticDemoMode: true,
  tagline: "GoldenDreams AUTO · Пловдив · демонстрационен проект с публично потвърден контакт и примерна обява."
};
