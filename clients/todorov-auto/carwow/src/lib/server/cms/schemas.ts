import { z } from 'zod';

const text = (max = 500) => z.string().trim().min(1).max(max);
const optionalText = (max = 500) => z.string().trim().max(max).optional().nullable();
const optionalInt = z.coerce.number().int().nonnegative().optional().nullable();
const emailAddress = z.string().trim().email();
const emptyToNull = (value: unknown) => (value === '' || value === null ? null : value);
const optionalEmail = z.preprocess(emptyToNull, z.string().trim().email().nullable());
const optionalFormInt = z.preprocess(emptyToNull, z.coerce.number().int().nonnegative().nullable());
const checkboxBoolean = z.preprocess(
	(value) => value === 'on' || value === 'true' || value === '1',
	z.boolean()
);
const currentYear = new Date().getFullYear();

export const loginSchema = z.object({
	email: z
		.string()
		.trim()
		.min(1)
		.max(254)
		.refine((value) => value.toLowerCase() === 'admin' || emailAddress.safeParse(value).success, {
			message: 'Enter admin or a valid email.'
		}),
	password: z.string().min(6).max(200)
});

// Honeypot: a field real users never fill (kept visually hidden in the form). A
// non-empty value means an automated submission and is dropped server-side.
const honeypot = z.string().trim().max(200).optional();

export const leadRequestSchema = z.object({
	dealerSlug: z.string().trim().min(1).max(80).optional(),
	vehicleId: z.string().uuid().optional().nullable(),
	customerName: text(140),
	contact: text(180),
	email: optionalEmail,
	phone: optionalText(80),
	source: z.string().trim().min(1).max(80).default('website'),
	message: z.string().trim().max(4000).default(''),
	value: optionalInt,
	companyWebsite: honeypot
});

export const importRequestSchema = z
	.object({
		dealerSlug: z.string().trim().min(1).max(80).optional(),
		customerName: text(140),
		contact: text(180),
		email: optionalEmail,
		phone: optionalText(80),
		originCountry: z.string().trim().length(2).default('CA'),
		destinationCountry: z.string().trim().length(2).default('BG'),
		desiredMake: optionalText(120),
		desiredModel: optionalText(120),
		desiredYearMin: optionalInt,
		desiredYearMax: optionalInt,
		budgetMin: optionalInt,
		budgetMax: optionalInt,
		fuel: optionalText(80),
		transmission: optionalText(80),
		notes: z.string().trim().max(4000).default(''),
		companyWebsite: honeypot
	})
	.refine(
		(data) =>
			!data.desiredYearMin || !data.desiredYearMax || data.desiredYearMin <= data.desiredYearMax,
		{
			message: 'Minimum year must be before maximum year.',
			path: ['desiredYearMin']
		}
	)
	.refine((data) => !data.budgetMin || !data.budgetMax || data.budgetMin <= data.budgetMax, {
		message: 'Minimum budget must be below maximum budget.',
		path: ['budgetMin']
	});

export type LeadRequestInput = z.infer<typeof leadRequestSchema>;
export type ImportRequestInput = z.infer<typeof importRequestSchema>;

export const chatStartSchema = z.object({
	dealerSlug: z.string().trim().min(1).max(80).optional(),
	name: z.string().trim().max(140).optional().nullable(),
	email: optionalEmail.optional(),
	phone: optionalText(80),
	message: z.string().trim().max(1200).optional().default('')
});

export const chatMessageSchema = z.object({
	message: z.string().trim().min(1).max(1200)
});

export type ChatStartInput = z.infer<typeof chatStartSchema>;
export type ChatMessageInput = z.infer<typeof chatMessageSchema>;

export const vehicleStatuses = ['draft', 'published', 'sold', 'archived'] as const;
export const vehicleConditions = ['used', 'new'] as const;
export const postStatuses = ['draft', 'published', 'archived'] as const;
export const postTypes = ['news', 'blog'] as const;

export const vehicleStatusSchema = z.enum(vehicleStatuses);
export const postStatusSchema = z.enum(postStatuses);
export const postTypeSchema = z.enum(postTypes);

export const vehicleFormSchema = z.object({
	slug: z.string().trim().max(160).optional().nullable(),
	title: z.string().trim().max(240).optional().nullable(),
	shortTitle: z.string().trim().max(140).optional().nullable(),
	brand: text(80),
	model: text(120),
	year: z.coerce
		.number()
		.int()
		.min(1900)
		.max(currentYear + 2),
	status: vehicleStatusSchema.default('draft'),
	condition: z.enum(vehicleConditions).default('used'),
	price: z.coerce.number().int().nonnegative(),
	priceEur: z.string().trim().max(80).optional().nullable(),
	priceBgn: z.string().trim().max(80).optional().nullable(),
	monthly: z.string().trim().max(120).optional().nullable(),
	mileageValue: z.coerce.number().int().nonnegative(),
	mileageText: z.string().trim().max(80).optional().nullable(),
	fuel: z.string().trim().max(80).optional().nullable(),
	transmission: z.string().trim().max(80).optional().nullable(),
	body: z.string().trim().max(80).optional().nullable(),
	doors: optionalFormInt,
	engine: z.string().trim().max(80).optional().nullable(),
	power: z.string().trim().max(80).optional().nullable(),
	drive: z.string().trim().max(80).optional().nullable(),
	color: z.string().trim().max(80).optional().nullable(),
	image: z.string().trim().max(1000).optional().nullable(),
	lot: z.string().trim().max(80).optional().nullable(),
	sourceUrl: z.string().trim().max(1000).optional().nullable(),
	conditionLine: z.string().trim().max(240).optional().nullable(),
	description: z.string().trim().max(5000).optional().nullable(),
	features: z.string().trim().max(2000).optional().nullable(),
	highlights: z.string().trim().max(1000).optional().nullable(),
	badges: z.string().trim().max(1000).optional().nullable()
});

export type VehicleFormInput = z.infer<typeof vehicleFormSchema>;

export const postFormSchema = z.object({
	slug: z.string().trim().max(160).optional().nullable(),
	type: postTypeSchema.default('blog'),
	status: postStatusSchema.default('draft'),
	title: text(180),
	excerpt: z.string().trim().max(600).optional().nullable(),
	body: z.string().trim().max(20000).optional().nullable(),
	coverUrl: z.string().trim().max(1000).optional().nullable(),
	category: z.string().trim().max(120).optional().nullable(),
	tags: z.string().trim().max(1000).optional().nullable(),
	author: z.string().trim().max(140).optional().nullable(),
	readMinutes: z.coerce.number().int().min(1).max(90).default(4)
});

export type PostFormInput = z.infer<typeof postFormSchema>;

export const dealerSettingsSchema = z.object({
	name: text(160),
	brandName: text(160),
	legalName: z.string().trim().max(180).optional().nullable(),
	websiteUrl: z.string().trim().max(1000).optional().nullable(),
	sourceInventoryUrl: z.string().trim().max(1000).optional().nullable(),
	phone: z.string().trim().max(80).optional().nullable(),
	phoneLabel: z.string().trim().max(120).optional().nullable(),
	email: optionalEmail,
	address: z.string().trim().max(240).optional().nullable(),
	city: z.string().trim().max(120).optional().nullable(),
	countryCode: z.string().trim().min(2).max(2).default('BG'),
	timezone: z.string().trim().max(80).default('Europe/Бургас'),
	defaultLocale: z.string().trim().max(20).default('bg-BG'),
	currencyCode: z.string().trim().min(3).max(3).default('EUR'),
	logoLightUrl: z.string().trim().max(1000).optional().nullable(),
	logoDarkUrl: z.string().trim().max(1000).optional().nullable(),
	facebookUrl: z.string().trim().max(1000).optional().nullable(),
	instagramUrl: z.string().trim().max(1000).optional().nullable(),
	tiktokUrl: z.string().trim().max(1000).optional().nullable(),
	seoTitle: z.string().trim().max(180).optional().nullable(),
	seoDescription: z.string().trim().max(320).optional().nullable(),
	feedMobileBgXml: checkboxBoolean.default(false),
	feedCarsBgCsv: checkboxBoolean.default(false),
	feedPublic: checkboxBoolean.default(false),
	feedAutoSync: checkboxBoolean.default(false)
});

export type DealerSettingsInput = z.infer<typeof dealerSettingsSchema>;
