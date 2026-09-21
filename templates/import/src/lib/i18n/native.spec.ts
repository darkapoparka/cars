import { bgVehicleCountNoun } from './messages';
import { aboutVideos } from '$lib/data/about-videos';
import * as services from '$lib/content/services';
import * as contact from '$lib/content/contact';
import * as selling from '$lib/content/sell-your-car';
import { auxeroAboutContent } from '$lib/auxero/about';
import { auxeroFaqGroups } from '$lib/auxero/faqs';
import { auxeroReviewCards } from '$lib/auxero/reviews';
import { homeFiveReviewItems } from '$lib/auxero/home-five';
import { posts } from '$lib/data/blog';
import { templatePolicies } from '$lib/data/template-policies';
import { describe, it, expect } from 'vitest';
import { nativeBg, nativeEn } from './native';
import { en, bg } from '$lib/locale/messages';
import { contentBg, contentEn, localizedCopy } from '$lib/content/localized';
import { inventoryCopy, inventorySourceKeys } from '$lib/content/inventory-localized';
import { cleanDayNightDescription } from '$lib/data/daynight';
import feed from '$lib/data/daynight-listings.json';
import { importCriteriaFromParams, importCriteriaSummary } from '$lib/data/import-criteria';
describe('native bilingual coverage and stable business values', () => {
	it('has complete nonempty pairs in every typed catalog', () => {
		for (const [left, right] of [
			[nativeBg, nativeEn],
			[contentBg, contentEn],
			[en, bg]
		]) {
			expect(Object.keys(left).sort()).toEqual(Object.keys(right).sort());
			for (const value of Object.values(right)) expect(value.trim().length).toBeGreaterThan(0);
		}
		for (const value of Object.values(inventoryCopy)) {
			expect(value.en.trim()).not.toBe('');
			expect(value.bg.trim()).not.toBe('');
		}
	});
	it('covers every published listing description, feature and color without mutating stock', () => {
		const original = JSON.stringify(feed);
		for (const vehicle of feed.listings) {
			for (const source of [
				cleanDayNightDescription(vehicle.shortDescription),
				...vehicle.features,
				vehicle.color
			])
				expect(inventorySourceKeys[source], source).toBeDefined();
		}
		expect(JSON.stringify(feed)).toBe(original);
	});
	it('preserves identifiers, user values, prices, currency and assets at editorial boundaries', () => {
		const data = {
			title: 'Контакт',
			id: 'Контакт',
			value: 'Контакт',
			name: 'Контакт',
			price: 12345,
			currency: 'EUR',
			image: '/assets/car.webp'
		};
		expect(localizedCopy(data, 'en')).toEqual({ ...data, title: 'Contact' });
		expect(data.title).toBe('Контакт');
	});
	it('changes only import enum display labels, keeping parsed values identical', () => {
		const params = new URLSearchParams('origin=DE&fuel=Бензин&transmission=Автомат&maxPrice=30000');
		const criteria = importCriteriaFromParams(params);
		const saved = JSON.stringify(criteria);
		expect(importCriteriaSummary(criteria, 'en')).toContain('Petrol');
		expect(importCriteriaSummary(criteria, 'bg')).toContain('Бензин');
		expect(JSON.stringify(criteria)).toBe(saved);
	});
});

it('covers every immutable native editorial boundary with no silent English fallback', () => {
	const sources = {
		aboutVideos,
		services,
		contact,
		selling,
		auxeroAboutContent,
		auxeroFaqGroups,
		auxeroReviewCards,
		homeFiveReviewItems,
		posts,
		templatePolicies
	};
	const missing: string[] = [];
	const visit = (value: unknown) => {
		if (typeof value === 'string') {
			try {
				localizedCopy({ text: value }, 'en');
			} catch {
				missing.push(value);
			}
		} else if (Array.isArray(value)) value.forEach(visit);
		else if (value && typeof value === 'object')
			for (const [key, item] of Object.entries(value)) {
				if (
					/^(title|text|description|intro|question|answer|body|content|category|date|role|label|placeholder|messageLabel|messagePlaceholder|submitLabel|subtitle|serviceLabel|checklist|response|notice|success|stepsTitle|formTitle|contactLabel|formEyebrow|mobileLabel|mobilePlaceholder|statusMessage|emailLabel|eyebrow|excerpt)$/.test(
						key
					)
				)
					visit(item);
				else if (typeof item === 'object') visit(item);
			}
	};
	visit(sources);
	expect([...new Set(missing)]).toEqual([]);
});

it('uses Bulgarian count forms for 0, 1, 2, 11, 21 and 101', () => {
	expect([0, 1, 2, 11, 21, 101].map(bgVehicleCountNoun)).toEqual([
		'автомобила',
		'автомобил',
		'автомобила',
		'автомобила',
		'автомобила',
		'автомобила'
	]);
});
