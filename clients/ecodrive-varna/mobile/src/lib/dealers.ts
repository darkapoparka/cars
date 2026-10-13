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
  "31791553971693975": {
    "address": "Варна, България",
    "languages": "",
    "openingHours": "Понеделник 11:00 - 18:00 ч. Вторник 11:00 - 18:00 ч. Сряда 11:00 - 18:00 ч. Четвъртък 11:00 - 18:00 ч. Петък 11:00 - 18:00 ч. Събота 11:00 - 18:00 ч. Неделя Почивен ден",
    "years": "",
    "listings": "1",
    "referrals": "",
    "descriptionAccuracy": "",
    "highlights": [],
    "logo": "/dealer-brand/v2-9786c23ceea922da/logo-on-light.webp",
    "logoWidth": 128
  }
};
