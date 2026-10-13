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
  "11778841437368042": {
    "address": "Ул. Тодор Радев Пенев 5Д, 9009, Варна, България",
    "languages": "",
    "openingHours": "Понеделник 09:00 - 17:00 ч. Вторник 09:00 - 17:00 ч. Сряда 09:00 - 17:00 ч. Четвъртък 09:00 - 17:00 ч. Петък 09:00 - 17:00 ч. Събота 00:00 - 00:00 ч. Неделя 00:00 - 00:00 ч.",
    "years": "",
    "listings": "1",
    "referrals": "",
    "descriptionAccuracy": "",
    "highlights": [],
    "logo": "/dealer-brand/v2-26972c6239c76e5f/logo-on-light.webp",
    "logoWidth": 128
  }
};
