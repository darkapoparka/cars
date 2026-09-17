import { fail } from '@sveltejs/kit';
import { eq } from 'drizzle-orm';
import type { Actions, PageServerLoad } from './$types';
import { dealerSettingsSchema } from '$lib/server/cms/schemas';
import { dealers } from '$lib/server/db/schema';
import { requireAdminDealer } from '$lib/server/repositories/admin';
import type { DealerSettingsInput } from '$lib/server/cms/schemas';
import type { Json } from '$lib/types/database';

type DealerSettingsValues = Record<keyof DealerSettingsInput, string>;
type DealerSettingsErrors = Partial<Record<keyof DealerSettingsInput, string[]>>;

const emptySettingsErrors: DealerSettingsErrors = {};

const settingsKeys = [
	'name',
	'brandName',
	'legalName',
	'websiteUrl',
	'sourceInventoryUrl',
	'phone',
	'phoneLabel',
	'email',
	'address',
	'city',
	'countryCode',
	'timezone',
	'defaultLocale',
	'currencyCode',
	'logoLightUrl',
	'logoDarkUrl',
	'facebookUrl',
	'instagramUrl',
	'tiktokUrl',
	'seoTitle',
	'seoDescription',
	'feedMobileBgXml',
	'feedCarsBgCsv',
	'feedPublic',
	'feedAutoSync'
] as const satisfies Array<keyof DealerSettingsInput>;

function readText(formData: FormData, key: keyof DealerSettingsInput) {
	const value = formData.get(key);
	return typeof value === 'string' ? value : '';
}

function readSettingsValues(formData: FormData): DealerSettingsValues {
	return Object.fromEntries(
		settingsKeys.map((key) => [key, readText(formData, key)])
	) as DealerSettingsValues;
}

function isJsonRecord(value: Json | undefined): value is Record<string, Json> {
	return Boolean(value && typeof value === 'object' && !Array.isArray(value));
}

function readJsonString(record: Record<string, Json>, key: string) {
	const value = record[key];
	return typeof value === 'string' ? value : '';
}

function readJsonBoolean(record: Record<string, Json>, key: string, fallback = false) {
	const value = record[key];
	return typeof value === 'boolean' ? value : fallback;
}

function normalizeDealerSettings(settings: Json | undefined) {
	const root = isJsonRecord(settings) ? settings : {};
	const social = isJsonRecord(root.social) ? root.social : {};
	const seo = isJsonRecord(root.seo) ? root.seo : {};
	const feeds = isJsonRecord(root.feeds) ? root.feeds : {};
	const feedExports = isJsonRecord(root.feedExports) ? root.feedExports : {};

	return {
		social: {
			facebookUrl: readJsonString(social, 'facebookUrl'),
			instagramUrl: readJsonString(social, 'instagramUrl'),
			tiktokUrl: readJsonString(social, 'tiktokUrl')
		},
		seo: {
			title: readJsonString(seo, 'title'),
			description: readJsonString(seo, 'description')
		},
		feeds: {
			mobileBgXml: readJsonBoolean(feedExports, 'mobileBgXml', true),
			carsBgCsv: readJsonBoolean(feedExports, 'carsBgCsv', true),
			public: readJsonBoolean(feeds, 'public', true),
			autoSync: readJsonBoolean(feeds, 'autoSync')
		}
	};
}

function mergeDealerSettings(settings: Json | undefined, input: DealerSettingsInput): Json {
	const root = isJsonRecord(settings) ? { ...settings } : {};
	const social = isJsonRecord(root.social) ? { ...root.social } : {};
	const seo = isJsonRecord(root.seo) ? { ...root.seo } : {};
	const feeds = isJsonRecord(root.feeds) ? { ...root.feeds } : {};
	const feedExports = isJsonRecord(root.feedExports) ? { ...root.feedExports } : {};

	return {
		...root,
		social: {
			...social,
			facebookUrl: input.facebookUrl || null,
			instagramUrl: input.instagramUrl || null,
			tiktokUrl: input.tiktokUrl || null
		},
		seo: {
			...seo,
			title: input.seoTitle || null,
			description: input.seoDescription || null
		},
		feeds: {
			...feeds,
			public: input.feedPublic,
			autoSync: input.feedAutoSync
		},
		feedExports: {
			...feedExports,
			mobileBgXml: input.feedMobileBgXml,
			carsBgCsv: input.feedCarsBgCsv
		}
	};
}

export const load: PageServerLoad = async ({ locals, parent }) => {
	const layout = await parent();

	if (!locals.db || !layout.dealer?.id) {
		return {
			dealerSettings: null,
			settingsProfile: normalizeDealerSettings(undefined)
		};
	}

	const [dealerSettings] = await locals.db
		.select({
			id: dealers.id,
			slug: dealers.slug,
			name: dealers.name,
			brand_name: dealers.brand_name,
			legal_name: dealers.legal_name,
			website_url: dealers.website_url,
			source_inventory_url: dealers.source_inventory_url,
			phone: dealers.phone,
			phone_label: dealers.phone_label,
			email: dealers.email,
			address: dealers.address,
			city: dealers.city,
			country_code: dealers.country_code,
			timezone: dealers.timezone,
			default_locale: dealers.default_locale,
			currency_code: dealers.currency_code,
			logo_light_url: dealers.logo_light_url,
			logo_dark_url: dealers.logo_dark_url,
			settings: dealers.settings,
			status: dealers.status,
			updated_at: dealers.updated_at
		})
		.from(dealers)
		.where(eq(dealers.id, layout.dealer.id))
		.limit(1);

	return {
		dealerSettings,
		settingsProfile: normalizeDealerSettings(dealerSettings?.settings)
	};
};

export const actions: Actions = {
	default: async ({ locals, request }) => {
		const values = readSettingsValues(await request.formData());
		const parsed = dealerSettingsSchema.safeParse(values);

		if (!parsed.success) {
			return fail(400, {
				error: 'Fix the highlighted settings before saving.',
				values,
				errors: parsed.error.flatten().fieldErrors
			});
		}

		const { db, dealerId, capabilities } = await requireAdminDealer(locals);
		if (!capabilities.settings) {
			return fail(403, {
				error: 'This account cannot manage dealer settings.',
				values,
				errors: emptySettingsErrors
			});
		}

		const [existingDealer] = await db
			.select({ settings: dealers.settings })
			.from(dealers)
			.where(eq(dealers.id, dealerId))
			.limit(1);

		await db
			.update(dealers)
			.set({
				name: parsed.data.name,
				brand_name: parsed.data.brandName,
				legal_name: parsed.data.legalName || null,
				website_url: parsed.data.websiteUrl || null,
				source_inventory_url: parsed.data.sourceInventoryUrl || null,
				phone: parsed.data.phone || null,
				phone_label: parsed.data.phoneLabel || null,
				email: parsed.data.email || null,
				address: parsed.data.address || null,
				city: parsed.data.city || null,
				country_code: parsed.data.countryCode.toUpperCase(),
				timezone: parsed.data.timezone,
				default_locale: parsed.data.defaultLocale,
				currency_code: parsed.data.currencyCode.toUpperCase(),
				logo_light_url: parsed.data.logoLightUrl || null,
				logo_dark_url: parsed.data.logoDarkUrl || null,
				settings: mergeDealerSettings(existingDealer?.settings, parsed.data)
			})
			.where(eq(dealers.id, dealerId));

		return {
			success: 'Dealer settings saved.'
		};
	}
};
