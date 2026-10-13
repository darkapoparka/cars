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
  "11789634848837677": {
    "address": "Бул.Цар Освободите 202 до изхода на КАТ, Варна, България",
    "languages": "",
    "openingHours": "Понеделник 09:00 - 19:00 ч. Вторник 09:00 - 19:00 ч. Сряда 09:00 - 19:00 ч. Четвъртък 09:00 - 19:00 ч. Петък 09:00 - 19:00 ч. Събота 09:00 - 19:00 ч. Неделя Почивен ден",
    "years": "",
    "listings": "1",
    "referrals": "",
    "descriptionAccuracy": "",
    "highlights": [],
    "logo": "/dealer-brand/v2-3e890b2aa575f82d/logo-on-light.webp",
    "logoWidth": 128
  }
};
