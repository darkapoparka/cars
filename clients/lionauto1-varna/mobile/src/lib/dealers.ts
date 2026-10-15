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
  "11791531218122804": {
    "address": "бул.Цар Освободител третата автокъща в ляво след Италмодо, Варна, България",
    "languages": "",
    "openingHours": "Понеделник 08:30 - 00:00 ч. Вторник 08:30 - 00:00 ч. Сряда 08:30 - 00:00 ч. Четвъртък 08:30 - 00:00 ч. Петък 08:30 - 00:00 ч. Събота 09:00 - 14:00 ч. Неделя Почивен ден",
    "years": "",
    "listings": "1",
    "referrals": "",
    "descriptionAccuracy": "",
    "highlights": [],
    "logo": "/dealer-brand/v2-7ec7821ff2c17bfd/logo-on-light.webp",
    "logoWidth": 128
  }
};
