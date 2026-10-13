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
  "11746086011937446": {
    "address": "ж.к. Вл. Варненчик, ул. Янко Мустаков, срещу бл. 303, вх.15, спирка Вихрен, Варна, България",
    "languages": "",
    "openingHours": "Потвърдете работното време директно с автокъщата.",
    "years": "",
    "listings": "1",
    "referrals": "",
    "descriptionAccuracy": "",
    "highlights": [],
    "logo": "/dealer-brand/v2-e98f380293081082/logo-on-light.webp",
    "logoWidth": 128
  }
};
