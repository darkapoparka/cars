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
  "11781342032890584": {
    "address": "Главен път Е2 ВАРНА-СОФИЯ, 400м. след кръговото под Метро! GPS, Варна, България",
    "languages": "",
    "openingHours": "Потвърдете работното време директно с автокъщата.",
    "years": "",
    "listings": "1",
    "referrals": "",
    "descriptionAccuracy": "",
    "highlights": [],
    "logo": "/dealer-brand/v2-677cf4ef1cd99dc1/logo-on-light.webp",
    "logoWidth": 128
  }
};
