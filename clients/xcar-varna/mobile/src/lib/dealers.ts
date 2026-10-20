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
  "11790197858680969": {
    "address": "Север, бул. Владислав Варненчик, Варна, България",
    "languages": "",
    "openingHours": "Понеделник 08:30 - 18:00 ч. Вторник 08:30 - 18:00 ч. Сряда 08:30 - 18:00 ч. Четвъртък 08:30 - 18:00 ч. Петък 08:30 - 18:00 ч. Събота 09:00 - 17:00 ч. Неделя Почивен ден",
    "years": "",
    "listings": "1",
    "referrals": "",
    "descriptionAccuracy": "",
    "highlights": [],
    "logo": "/dealer-brand/v2-70232141a1307631/logo-on-light.webp",
    "logoWidth": 128
  }
};
