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
  "11789979969434970": {
    "address": "бул. Цар Освободител, Варна, България",
    "languages": "",
    "openingHours": "Понеделник 00:00 - 00:00 ч. Вторник 00:00 - 00:00 ч. Сряда 00:00 - 00:00 ч. Четвъртък 00:00 - 00:00 ч. Петък 00:00 - 00:00 ч. Събота 00:00 - 00:00 ч. Неделя 00:00 - 00:00 ч.",
    "years": "",
    "listings": "1",
    "referrals": "",
    "descriptionAccuracy": "",
    "highlights": [],
    "logo": "/dealer-brand/v2-0d604411594c6811/logo-on-light.webp",
    "logoWidth": 128
  }
};
