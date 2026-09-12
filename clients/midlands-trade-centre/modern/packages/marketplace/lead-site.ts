export type LeadSiteCurrency = "AED" | "BGN" | "EUR" | "USD" | "GBP";

export interface LeadSiteConfig {
  readonly logoDarkPath: string;
  readonly distanceUnit: string;
  readonly previewNotice: string;
  readonly locationNote: string;
  readonly priceNotice: string;
  readonly hours: string;
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
  "accent": "#377c58",
  "address": "1198 Coventry Road, Yardley, Birmingham, B25 8DA",
  "city": "Birmingham",
  "contactUrl": "tel:+447780008222",
  "country": "United Kingdom",
  "countryCode": "GB",
  "currency": "GBP",
  "email": "",
  "heroPath": "/dealer/inventory/202601169196000-1.webp",
  "locale": "en-GB",
  "logoPath": "/dealer/logo-light.png",
  "logoDarkPath": "/dealer/logo-dark.png",
  "mapsEmbedUrl": "https://maps.google.com/maps?q=Midlands+Trade+Centre+1198+Coventry+Road+Birmingham+B25+8DA&output=embed",
  "mapsUrl": "https://www.google.com/maps/search/?api=1&query=Midlands+Trade+Centre+1198+Coventry+Road+Birmingham+B25+8DA",
  "name": "Midlands Trade Centre Limited",
  "phoneDisplay": "07780 008222",
  "phoneHref": "tel:+447780008222",
  "shortName": "Midlands Trade Centre",
  "slug": "midlands-trade-centre",
  "socialLinks": {},
  "staticDemoMode": true,
  "tagline": "Used vehicles in Yardley, Birmingham. Viewings by appointment.",
  "distanceUnit": "mi",
  "previewNotice": "Independent design preview with dated advertised samples, not a live stock feed. Confirm availability, condition and final terms directly. No dealership approval or message delivery is implied.",
  "locationNote": "All viewings are by prior appointment. Call or text to confirm the selected vehicle and the time of arrival before travelling.",
  "priceNotice": "Confirm the advertised price and final terms directly with the dealership.",
  "hours": "Monday–Friday 09:00–19:00; Saturday 10:00–18:00; Sunday by appointment. All viewings require a prior appointment."
};
// LEAD_SITE_CONFIG_END
