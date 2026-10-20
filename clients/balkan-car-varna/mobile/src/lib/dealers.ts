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
  "11775920728897115": {
    "address": "бул. Цар Освободител 548 (на светофара под Джъмбо), Варна, България",
    "languages": "",
    "openingHours": "Потвърдете работното време директно с автокъщата.",
    "years": "",
    "listings": "2",
    "referrals": "",
    "descriptionAccuracy": "",
    "highlights": [],
    "logo": "/dealer-brand/v2-61bdc4dc5ce603e8/logo-on-light.webp",
    "logoWidth": 128
  },
  "21790309618806312": {
    "address": "бул. Цар Освободител 548 (на светофара под Джъмбо), Варна, България",
    "languages": "",
    "openingHours": "Потвърдете работното време директно с автокъщата.",
    "years": "",
    "listings": "2",
    "referrals": "",
    "descriptionAccuracy": "",
    "highlights": [],
    "logo": "/dealer-brand/v2-61bdc4dc5ce603e8/logo-on-light.webp",
    "logoWidth": 128
  }
};
