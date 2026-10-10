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
  "1089": {
    "address": "Unit 3 Midland Road, North Walsham NR28 9JR",
    "languages": "",
    "openingHours": "Contact the dealership before visiting.",
    "years": "",
    "listings": "2",
    "referrals": "",
    "descriptionAccuracy": "",
    "highlights": [],
    "logo": "/dealer-brand/logo.webp",
    "logoWidth": 128
  },
  "1090": {
    "address": "Unit 3 Midland Road, North Walsham NR28 9JR",
    "languages": "",
    "openingHours": "Contact the dealership before visiting.",
    "years": "",
    "listings": "2",
    "referrals": "",
    "descriptionAccuracy": "",
    "highlights": [],
    "logo": "/dealer-brand/logo.webp",
    "logoWidth": 128
  }
};
