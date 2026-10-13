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
  "11790662447767037": {
    "address": "Пътя за село Тополи, 200 м след Темпо Бетони в ляво, зад Автосервиз и ГТП Тандем, Варна, България",
    "languages": "",
    "openingHours": "Потвърдете работното време директно с автокъщата.",
    "years": "",
    "listings": "2",
    "referrals": "",
    "descriptionAccuracy": "",
    "highlights": [],
    "logo": "/dealer-brand/v2-d598a334d4a2a896/logo-on-light.webp",
    "logoWidth": 128
  },
  "21780841001174707": {
    "address": "Пътя за село Тополи, 200 м след Темпо Бетони в ляво, зад Автосервиз и ГТП Тандем, Варна, България",
    "languages": "",
    "openingHours": "Потвърдете работното време директно с автокъщата.",
    "years": "",
    "listings": "2",
    "referrals": "",
    "descriptionAccuracy": "",
    "highlights": [],
    "logo": "/dealer-brand/v2-d598a334d4a2a896/logo-on-light.webp",
    "logoWidth": 128
  }
};
