import {z} from 'zod';

const text = z.string();
const nonempty = text.refine(value => value.trim().length > 0, 'Must not be blank');
const locale = z.enum(['en', 'bg']);
const identity = text.regex(/^[a-zA-Z0-9][a-zA-Z0-9_-]*$/, 'Use a stable URL-safe identifier');
const amount = z.number().nonnegative();
const date = text.refine(value => Number.isFinite(Date.parse(value)), 'Expected a valid date');
const https = text.refine(value => {
  try {const url = new URL(value); return url.protocol === 'https:' && !url.username && !url.password && !url.hostname.includes('*');}
  catch {return false;}
}, 'Expected an HTTPS URL without embedded credentials');
const optionalContact = https.or(z.literal(''));
export const publicAssetSchema = text.refine(value => {
  if (https.safeParse(value).success) return true;
  if (!value.startsWith('/') || value.startsWith('//') || value.includes('\\')) return false;
  try {
    const decoded = decodeURIComponent(value.split(/[?#]/)[0]);
    return !decoded.endsWith('/') && !decoded.includes('\0') && !decoded.includes('\\') && !decoded.startsWith('//') && !decoded.split('/').some(part => part === '.' || part === '..');
  } catch {return false;}
}, 'Expected a public asset path or an HTTPS URL without credentials');

/** Public content only. Unexpected fields are rejected rather than leaked to client props. */
export const dealerSchema = z.strictObject({
  mode: z.enum(['template', 'dealer']), id: identity, name: nonempty, shortName: nonempty,
  logo: z.strictObject({light: publicAssetSchema, dark: publicAssetSchema, icon: publicAssetSchema}),
  defaultLocale: locale, enabledLocales: z.array(locale).min(1),
  country: text.regex(/^[A-Z]{2}$/), currency: text.regex(/^[A-Z]{3}$/),
  city: text, address: text, phoneDisplay: text,
  phoneE164: text.regex(/^\+[1-9]\d{6,14}$/).or(z.literal('')),
  email: z.email().or(z.literal('')), mapsUrl: optionalContact, website: optionalContact,
  whatsappUrl: optionalContact, services: z.array(text), observedAt: date.or(z.literal('')),
  inventoryNotice: text, previewNotice: text,
  referenceClaimsApproved: z.boolean().optional(), welcomeEnabled: z.boolean().optional(),
}).superRefine((dealer, context) => {
  if (!dealer.enabledLocales.includes(dealer.defaultLocale)) context.addIssue({code: 'custom', path: ['defaultLocale'], message: 'Default locale must be enabled'});
  if (new Set(dealer.enabledLocales).size !== dealer.enabledLocales.length) context.addIssue({code: 'custom', path: ['enabledLocales'], message: 'Enabled locales must be unique'});
});
export type DealerConfiguration = z.infer<typeof dealerSchema>;

export const vehicleSchema = z.strictObject({
  slug: identity, year: z.number().int().min(1900).max(2200), make: nonempty, model: nonempty,
  trim: text, price: amount, previousPrice: amount.optional(), monthly: amount,
  mileage: amount, fuel: z.enum(['Petrol', 'Diesel', 'Hybrid', 'Electric', 'Not published']),
  transmission: z.enum(['Automatic', 'Manual', 'Not published']),
  body: z.enum(['SUV', 'Sedan', 'Hatchback', 'Coupe', 'MPV', 'Convertible', 'Pickup', 'Other']),
  location: text, image: publicAssetSchema, color: text, badges: z.array(text), highlights: z.array(text),
  power: text, engine: text, warranty: text, condition: text,
  images: z.array(publicAssetSchema).optional(), sourceUrl: optionalContact.optional(),
  observedAt: date.or(z.literal('')).optional(), listedAt: date.optional(), specifications: text.optional(),
  priceOnRequest: z.boolean().optional(), mileageOnRequest: z.boolean().optional(),
  imagePlaceholder: z.boolean().optional(), proposalBenefits: z.array(text).optional(),
  referenceId: text.optional(), tier: z.enum(['Luxe', 'Prime', 'Lite']).optional(),
  optionsType: text.optional(), originalMileage: amount.optional(),
  cylinders: z.number().int().nonnegative().optional(), zeroDownPayment: z.boolean().optional(),
}).superRefine((vehicle, context) => {
  if (!vehicle.priceOnRequest && vehicle.price === 0) context.addIssue({code: 'custom', path: ['price'], message: 'A missing price must be marked priceOnRequest'});
  if (!vehicle.priceOnRequest && vehicle.previousPrice !== undefined && vehicle.previousPrice < vehicle.price) context.addIssue({code: 'custom', path: ['previousPrice'], message: 'Previous price cannot be lower than the current price'});
});
export type Vehicle = z.infer<typeof vehicleSchema>;
export const inventorySchema = z.array(vehicleSchema).superRefine((vehicles, context) => {
  const slugs = new Set<string>();
  vehicles.forEach((vehicle, index) => {
    if (slugs.has(vehicle.slug)) context.addIssue({code: 'custom', path: [index, 'slug'], message: 'Vehicle slugs must be unique'});
    slugs.add(vehicle.slug);
  });
});
export const importInventorySchema = z.array(z.strictObject({countryCode: text.regex(/^[A-Z]{2}$/), vehicle: vehicleSchema})).superRefine((rows, context) => {
  const slugs = new Set<string>();
  rows.forEach(({vehicle}, index) => {
    if (slugs.has(vehicle.slug)) context.addIssue({code: 'custom', path: [index, 'vehicle', 'slug'], message: 'Import vehicle slugs must be unique'});
    slugs.add(vehicle.slug);
  });
});
