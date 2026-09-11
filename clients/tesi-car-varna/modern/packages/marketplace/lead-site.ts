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
  readonly socialLinks?: Partial<
    Record<"youtube" | "instagram" | "facebook" | "tiktok", string>
  >;
  readonly staticDemoMode: boolean;
  readonly tagline: string;
}

// LEAD_SITE_CONFIG_START
export const leadSite: LeadSiteConfig = {
  accent: "#bd272c",
  address: "\u0431\u0443\u043b. \u201e\u0426\u0430\u0440 \u041e\u0441\u0432\u043e\u0431\u043e\u0434\u0438\u0442\u0435\u043b\u201c, \u043f\u043e\u0441\u043e\u043a\u0430 \u0410\u043a\u0441\u0430\u043a\u043e\u0432\u043e, \u043f\u043e\u0441\u043b\u0435\u0434\u0435\u043d \u0432\u043b\u044f\u0432\u043e",
  city: "\u0412\u0430\u0440\u043d\u0430",
  contactUrl: "tel:+359898694330",
  country: "\u0411\u044a\u043b\u0433\u0430\u0440\u0438\u044f",
  countryCode: "BG",
  currency: "EUR",
  email: "",
  heroPath: "/dealer/inventory/21783937913461083-1.webp",
  locale: "bg-BG",
  logoPath: "/dealer/logo.png",
  mapsEmbedUrl: "https://maps.google.com/maps?q=Tesi%20Car%20Varna%20Tsar%20Osvoboditel%20Aksakovo&output=embed",
  mapsUrl: "https://www.google.com/maps/search/?api=1&query=Tesi%20Car%20Varna%20Tsar%20Osvoboditel%20Aksakovo",
  name: "\u0422\u0435\u0441\u0438 \u041a\u0430\u0440",
  phoneDisplay: "0898 694 330",
  phoneHref: "tel:+359898694330",
  shortName: "\u0422\u0435\u0441\u0438 \u041a\u0430\u0440",
  slug: "tesi-car-varna",
  socialLinks: {},
  staticDemoMode: true,
  tagline: "\u0412\u043d\u043e\u0441 \u043e\u0442 \u0428\u0432\u0435\u0439\u0446\u0430\u0440\u0438\u044f, \u043b\u0438\u0437\u0438\u043d\u0433 \u043f\u043e \u0442\u0435\u043a\u0443\u0449\u0438\u0442\u0435 \u043e\u0431\u044f\u0432\u0438 \u0438 \u0441\u044a\u0434\u0435\u0439\u0441\u0442\u0432\u0438\u0435 \u043f\u0440\u0438 \u0440\u0435\u0433\u0438\u0441\u0442\u0440\u0430\u0446\u0438\u044f \u0432\u044a\u0432 \u0412\u0430\u0440\u043d\u0430.",
};
// LEAD_SITE_CONFIG_END
