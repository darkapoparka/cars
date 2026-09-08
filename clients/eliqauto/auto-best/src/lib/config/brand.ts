export type BrandConfig = {
  name: string; shortName: string; city: string; addressLine: string; address: string;
  phone: string; phoneHref: `tel:${string}`; appointment: string; logo: `/${string}`;
  youtubeUrl: string; instagramUrl: string; facebookUrl: string;
};

/** Contact fields checked against https://eliqauto.mobile.bg/contacts on 2026-09-08. */
export const brand = {
  name: 'ELIQ AUTO', shortName: 'ELIQ AUTO', city: 'Пазарджик',
  addressLine: 'ул. Свобода, на гърба на Гробищен парк',
  address: 'ул. Свобода, на гърба на Гробищен парк, Пазарджик',
  phone: '0896 781 662', phoneHref: 'tel:+359896781662',
  appointment: 'Пон.–пет. 09:30–19:00 · Съб.–нед. 09:30–17:00 · Потвърдете огледа по телефона',
  logo: '/assets/eliqauto/brand/eliq-auto-wordmark-header.png',
  youtubeUrl: 'https://www.youtube.com/channel/UCGXhr1QYqALiBBQpBYZtpmw',
  instagramUrl: '', facebookUrl: ''
} as const satisfies BrandConfig;
