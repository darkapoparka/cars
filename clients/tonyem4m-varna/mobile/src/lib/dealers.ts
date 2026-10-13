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
  "11764766190100138": {
    "address": "бул. Янош Хуняди 95 ( до Пароцентралата), Варна, България",
    "languages": "",
    "openingHours": "Понеделник 09:00 - 18:00 ч. Вторник 09:00 - 18:00 ч. Сряда 09:00 - 18:00 ч. Четвъртък 09:00 - 18:00 ч. Петък 09:00 - 18:00 ч. Събота 10:00 - 16:00 ч. Неделя Почивен ден",
    "years": "",
    "listings": "1",
    "referrals": "",
    "descriptionAccuracy": "",
    "highlights": [],
    "logo": "/dealer-brand/v2-fec9d8e77eafb4ab/logo-on-light.webp",
    "logoWidth": 128
  }
};
