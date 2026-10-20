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
  "21771946973449498": {
    "address": "Кръстовището на бул. Цар Освободител и бул. Константин и Фружин, Варна, България",
    "languages": "",
    "openingHours": "Потвърдете работното време директно с автокъщата.",
    "years": "",
    "listings": "2",
    "referrals": "",
    "descriptionAccuracy": "",
    "highlights": [],
    "logo": "/dealer-brand/v2-f6b69418c0cdebde/logo-on-light.webp",
    "logoWidth": 128
  },
  "11779358576885782": {
    "address": "Кръстовището на бул. Цар Освободител и бул. Константин и Фружин, Варна, България",
    "languages": "",
    "openingHours": "Потвърдете работното време директно с автокъщата.",
    "years": "",
    "listings": "2",
    "referrals": "",
    "descriptionAccuracy": "",
    "highlights": [],
    "logo": "/dealer-brand/v2-f6b69418c0cdebde/logo-on-light.webp",
    "logoWidth": 128
  }
};
