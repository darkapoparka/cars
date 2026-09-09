export type BrandConfig = {
  name: string; shortName: string; city: string; addressLine: string; address: string;
  phone: string; phoneHref: `tel:${string}`; appointment: string; logo: `/${string}`;
  youtubeUrl: string; instagramUrl: string; facebookUrl: string;
};

// Public dealer contacts checked 2026-09-09 at https://dangerauto.mobile.bg/contacts
// and the Chevrolet Cruze listing 11788853280325556. No social account is asserted.
const name = 'DANGER AUTO';
const shortName = 'DANGER AUTO';
const city = 'София';
const addressLine = 'бул. Самоковско шосе 1, автоборса Джани до комплекс Боила, Горубляне';

export const brand = {
  name, shortName, city,
  youtubeUrl: '', instagramUrl: '', facebookUrl: '',
  phone: '0878 842 409',
  phoneHref: 'tel:+359878842409',
  secondaryPhone: '0888 000 055',
  secondaryPhoneHref: 'tel:+359888000055',
  addressLine,
  address: `${addressLine}, ${city}`,
  appointment: 'Потвърдете работното време и часа за оглед по телефона',
  logo: '/assets/images/lead/identity-pending.svg',
} as const satisfies BrandConfig & { secondaryPhone: string; secondaryPhoneHref: `tel:${string}` };
