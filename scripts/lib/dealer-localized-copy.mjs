const countryNames = {
  AE: { en: 'United Arab Emirates', bg: 'Обединени арабски емирства' },
  BG: { en: 'Bulgaria', bg: 'България' },
  GB: { en: 'United Kingdom', bg: 'Обединеното кралство' },
  US: { en: 'United States', bg: 'Съединени щати' }
};

const cityNames = {
  Birmingham: { en: 'Birmingham', bg: 'Бирмингам' },
  Dallas: { en: 'Dallas', bg: 'Далас' },
  Dubai: { en: 'Dubai', bg: 'Дубай' },
  'Pompano Beach': { en: 'Pompano Beach', bg: 'Помпано Бийч' },
  Sharjah: { en: 'Sharjah', bg: 'Шарджа' },
  Варна: { en: 'Varna', bg: 'Варна' },
  Пазарджик: { en: 'Pazardzhik', bg: 'Пазарджик' },
  Пловдив: { en: 'Plovdiv', bg: 'Пловдив' },
  София: { en: 'Sofia', bg: 'София' }
};

const bulgarianDealerEnglish = {
  'asko-96': {
    addressLine: '300 Botevgradsko Shose Blvd.',
    address: '300 Botevgradsko Shose Blvd., Sofia'
  },
  astracar: {
    addressLine: '282 Tsar Osvoboditel Blvd.',
    address: '282 Tsar Osvoboditel Blvd., Varna'
  },
  autolife: {
    addressLine: 'GP4, turnoff for Topoli village',
    address: 'GP4, turnoff for Topoli village, Varna'
  },
  'automarket-varna': {
    addressLine: 'Tsar Osvoboditel Blvd. — 300 m to the right after Doma na Kamiona, towards Varna Airport',
    address: 'Tsar Osvoboditel Blvd. — 300 m to the right after Doma na Kamiona, towards Varna Airport, Varna'
  },
  'avangard-auto': {
    addressLine: '289 Tsar Osvoboditel Blvd.',
    address: '289 Tsar Osvoboditel Blvd., Varna'
  },
  'champion-auto-pro': {
    addressLine: '302 Tsar Osvoboditel Blvd. / Izgi Europe Motor car wash',
    address: '302 Tsar Osvoboditel Blvd. / Izgi Europe Motor car wash, Varna'
  },
  eliqauto: {
    addressLine: 'Svoboda Street, behind the cemetery park',
    address: 'Svoboda Street, behind the cemetery park, Pazardzhik'
  },
  'elit-auto-import': {
    addressLine: '74A Prilep Street, Pchelina area',
    address: '74A Prilep Street, Pchelina area, Varna'
  },
  'excellent-cars': {
    addressLine: 'Yan Hunyadi Blvd., corner with Tsar Osvoboditel Blvd.',
    address: 'Yan Hunyadi Blvd., corner with Tsar Osvoboditel Blvd., Varna'
  },
  'isauto-varna': {
    region: 'Varna Business Park',
    addressLine: 'Varna Business Park, Building B6',
    address: 'Varna Business Park, Building B6, Varna, Bulgaria'
  },
  'ivo-auto': {
    addressLine: '256 Tsar Osvoboditel Blvd.',
    address: '256 Tsar Osvoboditel Blvd., Varna'
  },
  'kg-team-auto': {
    addressLine: 'South Industrial Zone, Ring Road opposite Chiirite Hotel',
    address: 'South Industrial Zone, Ring Road opposite Chiirite Hotel, Plovdiv'
  },
  'legend-auto': {
    addressLine: '289 Tsar Osvoboditel Blvd., opposite MACAO',
    address: '289 Tsar Osvoboditel Blvd., opposite MACAO, Varna'
  },
  'navara-car': {
    addressLine: 'Tsar Osvoboditel Blvd., Kaysieva Gradina',
    address: 'Tsar Osvoboditel Blvd., Kaysieva Gradina, Varna'
  },
  'outletcars-varna': {
    addressLine: '518 Yanosh Hunyadi Blvd., opposite Varna Traffic Police',
    address: '518 Yanosh Hunyadi Blvd., opposite Varna Traffic Police, Varna, Bulgaria'
  },
  'perfect-auto-varna': {
    addressLine: '110 Tsar Osvoboditel Blvd., Pobeda district',
    address: '110 Tsar Osvoboditel Blvd., Pobeda district, Varna'
  },
  priselci: {
    addressLine: '285 Tsar Osvoboditel Blvd.',
    address: '285 Tsar Osvoboditel Blvd., Varna'
  },
  'promosale-varna': {
    addressLine: 'Varna Sea Station',
    address: 'Varna Sea Station, Varna, Bulgaria'
  }
};

const transliteration = {
  А: 'A', Б: 'B', В: 'V', Г: 'G', Д: 'D', Е: 'E', Ж: 'Zh', З: 'Z', И: 'I', Й: 'Y',
  К: 'K', Л: 'L', М: 'M', Н: 'N', О: 'O', П: 'P', Р: 'R', С: 'S', Т: 'T', У: 'U',
  Ф: 'F', Х: 'H', Ц: 'Ts', Ч: 'Ch', Ш: 'Sh', Щ: 'Sht', Ъ: 'A', Ь: '', Ю: 'Yu', Я: 'Ya',
  а: 'a', б: 'b', в: 'v', г: 'g', д: 'd', е: 'e', ж: 'zh', з: 'z', и: 'i', й: 'y',
  к: 'k', л: 'l', м: 'm', н: 'n', о: 'o', п: 'p', р: 'r', с: 's', т: 't', у: 'u',
  ф: 'f', х: 'h', ц: 'ts', ч: 'ch', ш: 'sh', щ: 'sht', ъ: 'a', ь: '', ю: 'yu', я: 'ya'
};

const nonEmpty = (...values) => values.find((value) => typeof value === 'string' && value.trim())?.trim() || '';
const transliterate = (value) => [...String(value || '')].map((character) => transliteration[character] ?? character).join('');
const normalizeQuotes = (value) => String(value || '').replace(/[„“”]/g, '').replace(/\s+/g, ' ').trim();

function fallbackEnglishAddress(value) {
  return transliterate(normalizeQuotes(value))
    .replace(/\bbul\.\s*/gi, '')
    .replace(/\bul\.\s*/gi, '')
    .replace(/\bkv\.\s*/gi, '')
    .replace(/\bm-t\s*/gi, '')
    .replace(/\s+,/g, ',')
    .trim();
}

function appointmentEnglish(value) {
  const source = String(value || '').trim();
  const exact = {
    'Посещения с предварителна уговорка.': 'Visits by appointment.',
    'Обадете се за работно време и оглед.': 'Call to confirm opening hours and arrange a viewing.',
    'За работно време се обадете предварително.': 'Call ahead to confirm opening hours.',
    'За работно време и оглед се обадете предварително.': 'Call ahead to confirm opening hours and a viewing.',
    'Обадете се преди посещение': 'Call before visiting.',
    'Работното време се уточнява по телефона.': 'Call to confirm opening hours.',
    'Свържете се за работно време и оглед.': 'Contact the dealership to confirm opening hours and arrange a viewing.',
    'Работното време не е публикувано. Потвърдете по телефона преди посещение.': 'Opening hours are not published. Confirm by phone before visiting.'
  };
  if (exact[source]) return exact[source];
  let translated = source
    .replace(/Понеделник\s*[–-]\s*петък/gi, 'Monday–Friday')
    .replace(/Пон\.\s*[–-]\s*пет\./gi, 'Mon–Fri')
    .replace(/Събота/gi, 'Saturday')
    .replace(/Съб\./gi, 'Sat')
    .replace(/Неделя/gi, 'Sunday')
    .replace(/Нед\./gi, 'Sun')
    .replace(/почивни дни/gi, 'closed')
    .replace(/почивен ден/gi, 'closed')
    .replace(/Потвърдете огледа по телефона/gi, 'Confirm the viewing by phone')
    .replace(/по телефона/gi, 'by phone');
  return /[\u0400-\u04ff]/.test(translated)
    ? 'Viewings by appointment. Please call before visiting.'
    : translated || 'Viewings by appointment. Please call before visiting.';
}

function appointmentBulgarian(value) {
  const source = String(value || '').trim();
  const exact = {
    'Contact the showroom before travelling': 'Свържете се с шоурума преди пътуване.',
    'Please confirm opening hours and arrange your visit with the dealership.': 'Потвърдете работното време и уговорете посещение с автокъщата.',
    'Contact the dealership before visiting.': 'Свържете се с автокъщата преди посещение.',
    'Monday–Saturday 10 AM–6 PM; Sunday closed': 'Понеделник–събота 10:00–18:00; неделя почивен ден',
    'Mon-Thu 10:00-21:00; Friday 14:00-21:00; Saturday 10:00-21:00; Sunday Closed': 'Понеделник–четвъртък 10:00–21:00; петък 14:00–21:00; събота 10:00–21:00; неделя почивен ден'
  };
  if (exact[source]) return exact[source];
  if (!source) return 'Огледи с предварителна уговорка. Обадете се преди посещение.';
  return 'Огледи с предварителна уговорка. Обадете се преди посещение.';
}

function foreignAddressBulgarian(value) {
  return String(value || '')
    .replace(/\bShowroom\b/gi, 'Шоурум')
    .replace(/\bBuilding\b/gi, 'сграда')
    .replace(/\bIndustrial Area\b/gi, 'индустриална зона')
    .replace(/\bSuite\b/gi, 'офис')
    .replace(/\bUnited Arab Emirates\b|\bUAE\b/gi, 'ОАЕ')
    .trim();
}

function mergeLocale(base, override) {
  const result = { ...base };
  if (override && typeof override === 'object') {
    for (const key of Object.keys(result)) result[key] = nonEmpty(override[key], result[key]);
  }
  return result;
}

/**
 * Creates the bounded dealer-owned EN/BG copy used by all template adapters.
 * Explicit dealer facts win. The generated fallback is deterministic and is
 * intentionally limited to identity, place, appointment and neutral tagline copy.
 */
export function dealerLocalizedCopy(profile) {
  const business = profile.business;
  const country = countryNames[business.countryCode] || {
    en: nonEmpty(business.country, business.countryCode),
    bg: nonEmpty(business.country, business.countryCode)
  };
  const city = cityNames[business.city] || {
    en: business.countryCode === 'BG' ? transliterate(business.city) : business.city,
    bg: business.countryCode === 'BG' ? business.city : business.city
  };
  const explicit = business.raw?.localizedCopy || business.raw?.dealerLocalizedText || {};
  const englishOverride = bulgarianDealerEnglish[business.slug] || {};
  const englishName = nonEmpty(business.latinName, business.shortName, transliterate(business.name), business.name);
  const bgName = business.name;
  const bgAddressLine = nonEmpty(business.addressLine, business.address, business.city);
  const bgAddress = nonEmpty(business.address, business.addressLine, business.city);
  const enAddressLine = business.countryCode === 'BG'
    ? nonEmpty(englishOverride.addressLine, fallbackEnglishAddress(business.addressLine), city.en)
    : nonEmpty(business.addressLine, business.address, city.en);
  const enAddress = business.countryCode === 'BG'
    ? nonEmpty(englishOverride.address, fallbackEnglishAddress(business.address), enAddressLine)
    : nonEmpty(business.address, business.addressLine, city.en);
  const enRegion = business.countryCode === 'BG'
    ? nonEmpty(englishOverride.region, transliterate(business.region), city.en)
    : nonEmpty(business.region, city.en);
  const bgRegion = business.countryCode === 'BG'
    ? nonEmpty(business.region, business.city)
    : nonEmpty(city.bg, foreignAddressBulgarian(business.region));

  const base = {
    en: {
      name: englishName,
      city: city.en,
      country: country.en,
      region: enRegion,
      addressLine: enAddressLine,
      address: enAddress,
      locationShort: [enRegion && enRegion !== city.en ? enRegion : '', city.en].filter(Boolean).join(', ') || city.en,
      appointment: business.countryCode === 'BG' ? appointmentEnglish(business.hours) : business.hours,
      tagline: `${englishName} — vehicles and dealer support in ${city.en}.`
    },
    bg: {
      name: bgName,
      city: city.bg,
      country: country.bg,
      region: bgRegion,
      addressLine: business.countryCode === 'BG' ? bgAddressLine : foreignAddressBulgarian(bgAddressLine),
      address: business.countryCode === 'BG' ? bgAddress : foreignAddressBulgarian(bgAddress),
      locationShort: [bgRegion && bgRegion !== city.bg ? bgRegion : '', city.bg].filter(Boolean).join(', ') || city.bg,
      appointment: business.countryCode === 'BG' ? business.hours : appointmentBulgarian(business.hours),
      tagline: `${bgName} — автомобили и съдействие в ${city.bg}.`
    }
  };

  return {
    en: mergeLocale(base.en, explicit.en),
    bg: mergeLocale(base.bg, explicit.bg)
  };
}

export const dealerLocalizedCopyInternals = {
  appointmentBulgarian,
  appointmentEnglish,
  fallbackEnglishAddress,
  foreignAddressBulgarian,
  transliterate
};
