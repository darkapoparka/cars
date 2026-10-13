export type CapturedDealer = {
  address: string;
  languages: string;
  openingHours: string;
  years: string;
  listings: string;
  referrals: string;
  descriptionAccuracy: string;
  highlights: string[];
  logo: string;
  logoWidth?: number;
};
/** Static reference facts from Android captures 204 and 205, not live dealer data. */
export const capturedDealers: Record<string, CapturedDealer> = {
  "11790770761188035": {
    "address": "ул. Мусала11, Варна, България",
    "languages": "",
    "openingHours": "Потвърдете работното време директно с автокъщата.",
    "years": "",
    "listings": "2",
    "referrals": "",
    "descriptionAccuracy": "",
    "highlights": [],
    "logo": "/dealer-brand/v2-a84102ff5de00699/logo-on-light.webp",
    "logoWidth": 128
  },
  "11790767561385627": {
    "address": "ул. Мусала11, Варна, България",
    "languages": "",
    "openingHours": "Потвърдете работното време директно с автокъщата.",
    "years": "",
    "listings": "2",
    "referrals": "",
    "descriptionAccuracy": "",
    "highlights": [],
    "logo": "/dealer-brand/v2-a84102ff5de00699/logo-on-light.webp",
    "logoWidth": 128
  }
};
