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
  "11787740471095305": {
    "address": "до кръстовището на бул. Цар Освободител и бул. Константин и Фружин, под Джъмбо, Варна, България",
    "languages": "",
    "openingHours": "Понеделник–събота 09:00–17:30; неделя почивен ден.",
    "years": "",
    "listings": "1",
    "referrals": "",
    "descriptionAccuracy": "",
    "highlights": [],
    "logo": "/dealer-brand/v2-6e825dd569a75b95/logo-on-light.webp",
    "logoWidth": 128
  }
};
