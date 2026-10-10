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
  "880002442439": {
    "address": "",
    "languages": "",
    "openingHours": "Contact the dealership before visiting.",
    "years": "",
    "listings": "5",
    "referrals": "",
    "descriptionAccuracy": "",
    "highlights": [],
    "logo": "/dealer-brand/logo.webp",
    "logoWidth": 128
  },
  "178567084197": {
    "address": "",
    "languages": "",
    "openingHours": "Contact the dealership before visiting.",
    "years": "",
    "listings": "5",
    "referrals": "",
    "descriptionAccuracy": "",
    "highlights": [],
    "logo": "/dealer-brand/logo.webp",
    "logoWidth": 128
  },
  "178557630733": {
    "address": "",
    "languages": "",
    "openingHours": "Contact the dealership before visiting.",
    "years": "",
    "listings": "5",
    "referrals": "",
    "descriptionAccuracy": "",
    "highlights": [],
    "logo": "/dealer-brand/logo.webp",
    "logoWidth": 128
  },
  "880001351998": {
    "address": "",
    "languages": "",
    "openingHours": "Contact the dealership before visiting.",
    "years": "",
    "listings": "5",
    "referrals": "",
    "descriptionAccuracy": "",
    "highlights": [],
    "logo": "/dealer-brand/logo.webp",
    "logoWidth": 128
  },
  "178521890896": {
    "address": "",
    "languages": "",
    "openingHours": "Contact the dealership before visiting.",
    "years": "",
    "listings": "5",
    "referrals": "",
    "descriptionAccuracy": "",
    "highlights": [],
    "logo": "/dealer-brand/logo.webp",
    "logoWidth": 128
  }
};
