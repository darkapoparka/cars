import {
  importCountries,
  saleEnquiryTypes,
  type ImportCountry,
  type SaleEnquiryType,
} from './showroom-services';

export type ServiceRequestKind = 'import' | 'sell';

export const serviceRequestLimits = {
  make: 60,
  vin: 17,
  country: 40,
  saleType: 30,
  model: 80,
  year: 4,
  mileage: 12,
  budget: 12,
  price: 12,
  listing: 500,
  condition: 40,
  name: 80,
  email: 254,
  phone: 60,
  message: 2000,
} as const;

export type ServiceRequestField = keyof typeof serviceRequestLimits;
export type ServiceRequestValues = Record<ServiceRequestField, string>;
export type ServiceRequestErrors = Partial<Record<ServiceRequestField, string>>;
export const saleConditions = ['Excellent', 'Good', 'Needs repairs'] as const;
export type ServiceRequestStep = 0 | 1 | 2;
export const serviceRequestSteps = {
  import: [
    { label: 'Car', fields: ['vin', 'make', 'model'] },
    { label: 'Details', fields: ['budget', 'year', 'listing', 'country'] },
    { label: 'Review', fields: ['name', 'phone', 'email', 'message'] },
  ],
  sell: [
    { label: 'Car', fields: ['vin', 'make', 'model', 'year'] },
    { label: 'Details', fields: ['mileage', 'price', 'condition', 'saleType'] },
    { label: 'Review', fields: ['name', 'phone', 'email', 'message'] },
  ],
} as const;

export function emptyServiceRequest(): ServiceRequestValues {
  return {
    make: '',
    vin: '',
    country: '',
    saleType: '',
    model: '',
    year: '',
    mileage: '',
    budget: '',
    price: '',
    listing: '',
    condition: '',
    name: '',
    email: '',
    phone: '',
    message: '',
  };
}

export function normalizeServiceRequest(kind: ServiceRequestKind, input: unknown) {
  const values = emptyServiceRequest();
  if (!input || typeof input !== 'object' || Array.isArray(input)) return values;
  const record = input as Record<string, unknown>;
  for (const key of Object.keys(values) as ServiceRequestField[]) {
    if (typeof record[key] === 'string')
      values[key] = record[key].trim().slice(0, serviceRequestLimits[key]);
  }
  values.vin = values.vin.toUpperCase();
  if (kind === 'import') {
    values.mileage = '';
    values.price = '';
    values.condition = '';
    values.saleType = '';
    if (
      !importCountries.some(
        (country) => country.value !== 'all' && country.value === values.country,
      )
    )
      values.country = '';
  } else {
    values.budget = '';
    values.listing = '';
    values.country = '';
    if (!saleEnquiryTypes.some((type) => type.value === values.saleType)) values.saleType = '';
  }
  return values;
}

export function seedServiceRequest(
  kind: ServiceRequestKind,
  values: ServiceRequestValues,
  context: { country?: ImportCountry; saleType?: SaleEnquiryType },
) {
  return normalizeServiceRequest(kind, {
    ...values,
    ...(kind === 'import' && context.country && context.country !== 'all'
      ? { country: context.country }
      : {}),
    ...(kind === 'sell' && context.saleType ? { saleType: context.saleType } : {}),
  });
}

export function serviceRequestStorageKey(kind: ServiceRequestKind) {
  return 'cars-mobile-service-request-v1:' + kind;
}

export function serializeServiceRequest(kind: ServiceRequestKind, values: ServiceRequestValues) {
  return JSON.stringify({ version: 1, kind, values: normalizeServiceRequest(kind, values) });
}

export function parseServiceRequest(kind: ServiceRequestKind, raw: string | null) {
  try {
    const value = JSON.parse(raw || 'null');
    if (value?.version === 1 && value.kind === kind)
      return normalizeServiceRequest(kind, value.values);
  } catch {
    // Corrupt browser drafts do not prevent a new enquiry.
  }
  return emptyServiceRequest();
}

export function validateServiceRequest(
  kind: ServiceRequestKind,
  values: ServiceRequestValues,
  currentYear = new Date().getFullYear(),
) {
  const errors: ServiceRequestErrors = {};
  if (values.vin && !/^[A-Z0-9]{17}$/i.test(values.vin)) errors.vin = 'Enter a 17-character VIN.';
  if (!values.make.trim()) errors.make = 'Enter a make.';
  if (!values.model.trim()) errors.model = 'Enter a model.';
  if (values.year || kind === 'sell') {
    const year = Number(values.year);
    if (!/^\d{4}$/.test(values.year) || year < 1900 || year > currentYear + 1)
      errors.year = 'Enter a valid year.';
  }
  const positive = (value: string) =>
    value.trim() !== '' && Number.isFinite(Number(value)) && Number(value) > 0;
  if (kind === 'import') {
    if (
      values.country &&
      !importCountries.some(
        (country) => country.value !== 'all' && country.value === values.country,
      )
    )
      errors.country = 'Choose an import country.';
    if (!positive(values.budget)) errors.budget = 'Enter a budget greater than zero.';
    if (values.listing) {
      try {
        const url = new URL(values.listing);
        if (url.protocol !== 'http:' && url.protocol !== 'https:')
          errors.listing = 'Enter a website link.';
      } catch {
        errors.listing = 'Enter a complete website link.';
      }
    }
  } else {
    if (values.saleType && !saleEnquiryTypes.some((type) => type.value === values.saleType))
      errors.saleType = 'Choose a sale type.';
    if (!/^\d+$/.test(values.mileage) || !Number.isSafeInteger(Number(values.mileage)))
      errors.mileage = 'Enter the mileage in kilometres.';
    if (values.price && !positive(values.price)) errors.price = 'Enter a price greater than zero.';
    if (values.condition && !saleConditions.some((condition) => condition === values.condition))
      errors.condition = 'Choose a condition.';
  }
  if (values.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email))
    errors.email = 'Enter a valid email address.';
  return errors;
}

export function validateServiceRequestStep(
  kind: ServiceRequestKind,
  step: ServiceRequestStep,
  values: ServiceRequestValues,
  currentYear = new Date().getFullYear(),
) {
  const allErrors = validateServiceRequest(kind, values, currentYear);
  const errors: ServiceRequestErrors = {};
  for (const field of serviceRequestSteps[kind][step].fields) {
    if (allErrors[field]) errors[field] = allErrors[field];
  }
  return errors;
}

export function serviceRequestErrorStep(kind: ServiceRequestKind, errors: ServiceRequestErrors) {
  const first = serviceRequestSteps[kind].findIndex(({ fields }) =>
    fields.some((field) => Boolean(errors[field])),
  );
  return (first < 0 ? 0 : first) as ServiceRequestStep;
}

export function serviceRequestMessage(kind: ServiceRequestKind, values: ServiceRequestValues) {
  const fields = normalizeServiceRequest(kind, values);
  const rows: [string, string][] = [
    ['VIN', fields.vin],
    ['Make', fields.make],
    ['Model', fields.model],
    [kind === 'import' ? 'Minimum year' : 'Year', fields.year],
    ...(kind === 'import'
      ? ([
          [
            'Import country',
            importCountries.find((country) => country.value === fields.country)?.label || '',
          ],
          ['Maximum budget (EUR)', fields.budget],
          ['Listing link', fields.listing],
        ] as [string, string][])
      : ([
          [
            'Sale type',
            saleEnquiryTypes.find((type) => type.value === fields.saleType)?.label || '',
          ],
          ['Mileage (km)', fields.mileage],
          ['Expected price (EUR)', fields.price],
          ['Condition', fields.condition],
        ] as [string, string][])),
    ['Name', fields.name],
    ['Email', fields.email],
    ['Phone', fields.phone],
    ['Message', fields.message],
  ];
  return [
    kind === 'import' ? 'Car import enquiry' : 'Car sale / buyout enquiry',
    ...rows.filter(([, value]) => value).map(([label, value]) => label + ': ' + value),
  ].join('\n');
}
