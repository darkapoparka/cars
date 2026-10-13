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
  "21765547669329836": {
    "address": "Бул. Цар Освободител 277, Варна, България",
    "languages": "",
    "openingHours": "Понеделник 08:30 - 17:00 ч. Вторник 08:30 - 17:00 ч. Сряда 08:30 - 17:00 ч. Четвъртък 08:30 - 17:00 ч. Петък 08:30 - 17:00 ч. Събота Почивен ден Неделя Почивен ден",
    "years": "",
    "listings": "1",
    "referrals": "",
    "descriptionAccuracy": "",
    "highlights": [],
    "logo": "/dealer-brand/v2-d858e68d227bc130/logo-on-light.webp",
    "logoWidth": 128
  }
};
