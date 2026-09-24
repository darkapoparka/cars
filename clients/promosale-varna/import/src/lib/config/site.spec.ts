import { describe, expect, it } from 'vitest';
import { site, validateSiteConfig, resolveSiteLocale, themeStyle, type SiteConfig } from './site';

const fixture = (name = 'North Garage'): SiteConfig => ({
	...structuredClone(site),
	socials: [],
	identity: {
		name,
		displayName: name,
		origin: 'https://north.example.invalid',
		logo: '/brand/north.svg',
		logoOnDark: '/brand/north-dark.svg',
		favicon: '/brand/north-icon.svg'
	},
	contact: {
		phone: '+359 000 000 000',
		phoneHref: 'tel:+359000000000',
		messageHref: 'https://north.example.invalid/contact',
		address: 'Synthetic showroom address',
		contactHref: 'mailto:hello@example.invalid',
		appointment: 'By appointment',
		mapHref: 'https://maps.example.invalid/north'
	}
});
describe('dealer configuration contract', () => {
	it('accepts two independent brands without editing shared components', () => {
		const a = fixture();
		const b = fixture('West Coast Motor Company');
		b.identity.origin = 'https://west.example.invalid';
		b.locale.default = 'en';
		b.theme = { accent: '#124f78', accentHover: '#123e5e', accentContrast: '#ffffff' };
		expect(validateSiteConfig(a).identity.name).toBe('North Garage');
		expect(validateSiteConfig(b).identity.name).toBe('West Coast Motor Company');
		expect(themeStyle(b)).toContain('--bc-accent:#124f78');
		expect(resolveSiteLocale(undefined, b)).toBe('en');
		expect(resolveSiteLocale('bg', b)).toBe('bg');
	});
	it('does not infer a locale that the dealer has disabled', () => {
		const config = fixture();
		config.locale = { ...config.locale, default: 'bg', supported: ['bg'], currency: 'EUR' };
		expect(resolveSiteLocale('en', config)).toBe('bg');
		expect(resolveSiteLocale('unknown', config)).toBe('bg');
	});
	it.each([
		'https://user:secret@example.invalid',
		'http://example.invalid',
		'https://example.invalid/path'
	])('rejects unsafe origin %s', (origin) => {
		const config = fixture();
		config.identity.origin = origin;
		expect(() => validateSiteConfig(config)).toThrow();
	});
	it.each(['//external.invalid/a.svg', '/%2e%2e/private.svg', '/a<svg>.svg', '/a b.svg'])(
		'rejects invalid local asset %s',
		(logo) => {
			const config = fixture();
			config.identity.logo = logo;
			expect(() => validateSiteConfig(config)).toThrow();
		}
	);
	it('rejects script contact links and CSS injection', () => {
		const config = fixture();
		config.contact.messageHref = 'javascript:alert(1)';
		expect(() => validateSiteConfig(config)).toThrow();
		const other = fixture();
		other.theme.accent = '#fff;display:none';
		expect(() => validateSiteConfig(other)).toThrow();
	});
	it.each([NaN, Infinity, -1, 101])('rejects invalid rate %s', (annualRate) => {
		const config = fixture();
		config.finance.annualRate = annualRate;
		expect(() => validateSiteConfig(config)).toThrow();
	});
	it('rejects missing default locale and zero-month finance', () => {
		const config = fixture();
		config.locale = { ...config.locale, default: 'en', supported: ['bg'], currency: 'EUR' };
		expect(() => validateSiteConfig(config)).toThrow();
		config.locale = site.locale;
		config.finance.months = 0;
		expect(() => validateSiteConfig(config)).toThrow();
	});
});

describe('dealer social links', () => {
	it('keeps social links optional and rejects unsafe or duplicate destinations', () => {
		const config = fixture();
		expect(validateSiteConfig(config).socials).toEqual([]);
		config.socials = [
			{ platform: 'instagram', label: 'Instagram', href: 'https://social.example.invalid/garage' }
		];
		expect(validateSiteConfig(config).socials).toHaveLength(1);
		for (const href of [
			'javascript:alert(1)',
			'http://example.invalid',
			'https://user:password@example.invalid'
		]) {
			expect(() =>
				validateSiteConfig({
					...config,
					socials: [{ platform: 'instagram', label: 'Instagram', href }]
				})
			).toThrow();
		}
		expect(() =>
			validateSiteConfig({
				...config,
				socials: [...(config.socials ?? []), ...(config.socials ?? [])]
			})
		).toThrow();
	});
});
