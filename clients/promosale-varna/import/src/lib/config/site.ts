import type { SiteLocaleConfig } from './locale-contract';
import {
	daynightAssets,
	daynightBrand,
	daynightContact,
	mainNavigation,
	dealerTheme,
	dealerLocaleSettings
} from './dealer';

export type SocialPlatform = 'facebook' | 'instagram' | 'tiktok' | 'youtube';
export type SocialLink = { platform: SocialPlatform; label: string; href: string };

export type SiteConfig = {
	socials?: readonly SocialLink[];
	identity: {
		name: string;
		displayName: string;
		origin: string;
		logo: string;
		logoOnDark: string;
		favicon: string;
	};
	contact: {
		phone: string;
		phoneHref: string;
		messageHref: string;
		address: string;
		contactHref: string;
		appointment: string;
		mapHref: string;
	};
	locale: SiteLocaleConfig;
	theme: { accent: string; accentHover: string; accentContrast: string };
	finance: {
		annualRate: number;
		months: number;
		downPaymentPercent: number;
		showEstimates: boolean;
	};
};

/** Validate dealer input before it reaches HTML, links or financial estimates. */
export function validateSiteConfig(config: SiteConfig): SiteConfig {
	const origin = new URL(config.identity.origin);
	if (
		origin.protocol !== 'https:' ||
		origin.pathname !== '/' ||
		origin.search ||
		origin.hash ||
		origin.username ||
		origin.password
	)
		throw new Error('Site origin must be an HTTPS origin without credentials');
	if (!config.identity.name.trim() || !config.identity.displayName.trim())
		throw new Error('Site name is required');
	for (const color of Object.values(config.theme))
		if (!/^#[0-9a-f]{6}$/i.test(color))
			throw new Error('Theme colours must use six-digit hex values');
	for (const asset of [config.identity.logo, config.identity.logoOnDark, config.identity.favicon]) {
		if (
			!asset.startsWith('/') ||
			asset.startsWith('//') ||
			/[\\<>\s]/.test(asset) ||
			decodeURIComponent(asset).split('/').includes('..')
		)
			throw new Error('Identity assets must be local absolute paths');
	}
	if (!/^tel:[+]?[0-9 -]+$/.test(config.contact.phoneHref))
		throw new Error('A valid telephone link is required');
	const links: Array<[string, string[]]> = [
		[config.contact.mapHref, ['https:']],
		[config.contact.contactHref, ['https:', 'mailto:']],
		[config.contact.messageHref, ['https:', 'viber:', 'sms:', 'mailto:']]
	];
	for (const [value, protocols] of links) {
		const url = new URL(value);
		if (!protocols.includes(url.protocol) || url.username || url.password)
			throw new Error('Unsupported contact link');
	}
	const socialPlatforms = new Set<string>();
	for (const link of config.socials ?? []) {
		const url = new URL(link.href);
		if (
			!['facebook', 'instagram', 'tiktok', 'youtube'].includes(link.platform) ||
			!link.label.trim() ||
			url.protocol !== 'https:' ||
			url.username ||
			url.password ||
			socialPlatforms.has(link.platform)
		)
			throw new Error('Social links must use unique supported platforms and HTTPS URLs');
		socialPlatforms.add(link.platform);
	}
	if (!Intl.supportedValuesOf('currency').includes(config.locale.currency))
		throw new Error('Unsupported display currency');
	if (
		!config.locale.supported.length ||
		!config.locale.supported.includes(config.locale.default) ||
		config.locale.supported.some((locale) => locale !== 'bg' && locale !== 'en')
	)
		throw new Error('Default locale must be a supported locale');
	const { annualRate, months, downPaymentPercent } = config.finance;
	if (
		!Number.isFinite(annualRate) ||
		annualRate < 0 ||
		annualRate > 100 ||
		!Number.isInteger(months) ||
		months < 1 ||
		months > 1200 ||
		!Number.isFinite(downPaymentPercent) ||
		downPaymentPercent < 0 ||
		downPaymentPercent > 100
	)
		throw new Error('Invalid illustrative finance policy');
	return config;
}

export const site: SiteConfig = validateSiteConfig({
	socials: (
		[
			{ platform: 'facebook', label: 'Facebook', href: daynightContact.facebookHref },
			{ platform: 'instagram', label: 'Instagram', href: daynightContact.instagramHref },
			{ platform: 'tiktok', label: 'TikTok', href: daynightContact.tiktokHref },
			{ platform: 'youtube', label: 'YouTube', href: daynightContact.youtubeHref }
		] satisfies SocialLink[]
	).filter((link) => Boolean(link.href)),
	identity: {
		name: daynightBrand.name,
		displayName: daynightBrand.displayName,
		origin: `https://${daynightBrand.domain}`,
		logo: daynightAssets.logoDark,
		logoOnDark: daynightAssets.logoLight,
		favicon: '/brand/daynight-favicon.svg'
	},
	contact: {
		phone: daynightContact.primaryPhoneLabel,
		phoneHref: daynightContact.primaryPhoneHref,
		messageHref: daynightContact.viberHref,
		address: daynightContact.addressLabel,
		contactHref: daynightContact.emailHref,
		appointment: daynightContact.appointmentNote,
		mapHref: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(daynightContact.addressLabel)}`
	},
	locale: dealerLocaleSettings,
	theme: dealerTheme,
	// Matches the existing illustrative card policy; this is not a lender offer.
	finance: { annualRate: 0, months: 72, downPaymentPercent: 0, showEstimates: true }
});
export const siteNavigation = mainNavigation;
export const themeStyle = (config: SiteConfig) =>
	`--bc-accent:${config.theme.accent};--bc-accent-hover:${config.theme.accentHover};--bc-accent-contrast:${config.theme.accentContrast};--bc-focus:${config.theme.accent}`;

/** Locale is an explicit URL choice, falling back to this dealer's configured default. */
export function resolveSiteLocale(
	value: string | null | undefined,
	config: SiteConfig = site
): 'bg' | 'en' {
	return config.locale.supported.find((locale) => locale === value) ?? config.locale.default;
}
