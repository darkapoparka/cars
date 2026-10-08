import { defaultLocale, translate, type Locale } from './locale';

export const showroomPlaceholderLogo = '/branding/showroom-placeholder-20261002.webp';

export type ShowroomConfig = {
  name: string;
  logo: string | null;
  phone: string | null;
  email: string | null;
  address: string | null;
  directionsUrl: string | null;
  mapEmbedUrl: string | null;
  socialLinks: readonly { label: string; href: string }[];
  contactPreview: boolean;
  hours: readonly string[];
  /** Stable dealer slug. null retains the standalone template's existing saved data. */
  storageNamespace: string | null;
};

function validNamespace(value: string): boolean {
  return value.length <= 80 && /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(value);
}

/** Never import the template's or another dealer's private drafts into a new dealer. */
export function storageKeysFor(namespace: string | null) {
  if (namespace !== null && !validNamespace(namespace))
    throw new Error('storageNamespace must be a stable lowercase dealer slug (1–80 characters).');
  const key = (legacy: string) =>
    namespace === null ? legacy : 'cars-mobile:' + namespace + ':' + legacy;
  return {
    appState: key('mobile-reference-v1'),
    language: key('cars-mobile-language'),
    serviceRequests: {
      import: key('cars-mobile-service-request-v1:import'),
      sell: key('cars-mobile-service-request-v1:sell'),
    },
    inventoryContext: key('cars-mobile-inventory-context'),
    restoreInventory: key('cars-mobile-restore-inventory'),
  };
}

function validWebUrl(value: string): boolean {
  try {
    const url = new URL(value);
    return url.protocol === 'https:' && !url.username && !url.password;
  } catch {
    return false;
  }
}

/** Fail during build when personalization would produce broken or unsafe contact actions. */
export function defineShowroom(config: ShowroomConfig): Readonly<ShowroomConfig> {
  if (!config.name.trim()) throw new Error('Configure a nonempty showroom name.');
  storageKeysFor(config.storageNamespace);
  const personalized =
    config.name !== 'Your showroom' ||
    config.logo !== showroomPlaceholderLogo ||
    !config.contactPreview ||
    [config.phone, config.email, config.address, config.directionsUrl, config.mapEmbedUrl].some(
      (value) => value !== null,
    ) ||
    config.socialLinks.length > 0 ||
    config.hours.length > 0;
  if (personalized && config.storageNamespace === null)
    throw new Error('A personalized showroom needs its own stable storageNamespace.');
  if (personalized && config.contactPreview)
    throw new Error('Disable contactPreview when personalizing a dealer.');
  for (const field of ['directionsUrl', 'mapEmbedUrl'] as const)
    if (config[field] !== null && !validWebUrl(config[field]))
      throw new Error(field + ' must be a complete HTTPS URL without credentials.');
  if (config.logo !== null) {
    const local = config.logo.startsWith('/') && !config.logo.startsWith('//');
    if (!local && !validWebUrl(config.logo))
      throw new Error('logo must be a local public path or a complete HTTPS URL.');
  }
  if (config.phone !== null) {
    const digits = config.phone.replace(/\D/g, '');
    if (
      !/^\+?[\d ()-]{6,60}$/.test(config.phone) ||
      digits.length < 6 ||
      digits.length > 15 ||
      /^0+$/.test(digits)
    )
      throw new Error('phone must contain a verified telephone number.');
  }
  if (config.email !== null && !/^[^\s@?&#]+@[^\s@?&#]+\.[^\s@?&#]+$/.test(config.email))
    throw new Error('email must contain a valid email address.');
  for (const link of config.socialLinks)
    if (!link.label.trim() || !validWebUrl(link.href))
      throw new Error('Social links need a label and a complete HTTPS URL without credentials.');
  return config;
}

// A neutral template placeholder. Replace only with verified dealer details.
export const showroom = defineShowroom({
  name: 'Your showroom',
  logo: showroomPlaceholderLogo,
  phone: null,
  email: null,
  address: null,
  directionsUrl: null,
  mapEmbedUrl: null,
  socialLinks: [],
  contactPreview: true,
  hours: [],
  storageNamespace: null,
});

export const storageKeys = storageKeysFor(showroom.storageNamespace);

export function showroomTitle(page: string, locale: Locale, name = showroom.name): string {
  return translate(page, locale) + ' — ' + translate(name, locale);
}

export function showroomMetadata(name = showroom.name) {
  return {
    title: {
      default: showroomTitle('Cars', defaultLocale, name),
      template: '%s — ' + translate(name, defaultLocale),
    },
    description:
      'Browse cars, explore showroom services and contact the dealer. Showroom template with sample inventory.',
    robots: { index: false, follow: false },
    applicationName: name === 'Your showroom' ? 'Cars Mobile' : name,
  };
}
