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
  'bmw-540': {
    address: 'Weseler Straße 655\nDE-48163 Münster',
    languages:
      'العربية, Deutsch, Pусский, English, Italiano, Français, Polski, Română, Español, Türkçe',
    openingHours:
      'Mon - Fri 08:00 h - 19:00 h\nSat 09:00 h - 14:00 h\nSun 10:00 h - 17:00 h (Viewing day)',
    years: '12 Years',
    listings: '180',
    referrals: '64%',
    descriptionAccuracy: '75%',
    highlights: [],
    logo: '/images/dealer-weller.webp',
    logoWidth: 128,
  },

  'bmw-x3': {
    address: 'Einsteinstrasse 30\nDE-53757 Sankt Augustin',
    languages: 'Deutsch, English',
    openingHours: 'Mon - Fri 08:30 h - 18:00 h\nSat 09:00 h - 13:00 h',
    years: '23 Years',
    listings: '112',
    referrals: '85%',
    descriptionAccuracy: '91%',
    highlights: [],
    logo: '/images/dealer-hakvoort.webp',
    logoWidth: 128,
  },
  'bmw-120': {
    address: 'Beimoorkamp 2\nDE-22926 Ahrensburg',
    languages: 'Deutsch, English',
    openingHours: 'Mon - Fri 07:30 h - 18:00 h\nSat 09:00 h - 13:00 h',
    years: '18 Years',
    listings: '72',
    referrals: '100%',
    descriptionAccuracy: '100%',
    highlights: ['Very friendly', 'Good advice', 'Quick response'],
    logo: '/images/dealer-may-olde.webp',
    logoWidth: 128,
  },
  'bmw-x6': {
    address: 'Manchinger Straße 110\nDE-85053 Ingolstadt',
    languages: 'Deutsch, English',
    openingHours:
      'Mon - Fri 08:00 h - 18:00 h\nSat 09:00 h - 13:00 h\nSun 11:00 h - 16:00 h (Viewing day)',
    years: '24 Years',
    listings: '127',
    referrals: '99%',
    descriptionAccuracy: '99%',
    highlights: ['Very friendly', 'Good advice', 'Quick response'],
    logo: '/images/dealer-hofmann.webp',
  },
};
