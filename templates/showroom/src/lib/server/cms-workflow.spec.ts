import { describe, expect, it } from 'vitest';
import {
	cmsListingStatusLabel,
	cmsListingStatusOptions,
	normalizeCmsListingStatus,
	publicListingStatuses,
	scoreInventoryCompleteness
} from './cms-workflow';

const completeListing = {
	bodyType: 'SUV',
	brand: 'BMW',
	color: 'Carbon Black',
	description: 'Documented Canadian import with service history and transparent inspection notes.',
	documents: [{ id: 'doc-1' }],
	engine: '3.0 diesel',
	features: ['Head-up display', 'Adaptive cruise', 'Panoramic roof'],
	fuel: 'Diesel',
	galleryImages: ['/front.webp', '/rear.webp', '/interior.webp'],
	location: 'Sofia, Bulgaria',
	mileage: 91000,
	model: 'X5',
	previewImage: '/uploads/cms/x5/preview/front.webp',
	price: 42000,
	priceLabel: '42 000 EUR',
	sourceUrl: 'https://example.com/source',
	status: 'published',
	stockNumber: 'BOH-X5-001',
	title: 'BMW X5 xDrive',
	transmission: 'Automatic',
	vin: 'SPEC-BMW-X5',
	year: 2022
};

describe('CMS listing workflow', () => {
	it('defines the complete Eliqauto listing status workflow', () => {
		expect(cmsListingStatusOptions.map((status) => status.value)).toEqual([
			'draft',
			'intake',
			'media_ready',
			'published',
			'reserved',
			'sold',
			'archived'
		]);
		expect(normalizeCmsListingStatus('media-ready')).toBe('media_ready');
		expect(normalizeCmsListingStatus('unknown')).toBe('draft');
		expect(cmsListingStatusLabel('reserved')).toBe('Reserved');
		expect(publicListingStatuses.has('published')).toBe(true);
		expect(publicListingStatuses.has('reserved')).toBe(true);
		expect(publicListingStatuses.has('sold')).toBe(false);
	});

	it('scores a complete listing as complete', () => {
		const completeness = scoreInventoryCompleteness(completeListing);

		expect(completeness.level).toBe('complete');
		expect(completeness.missing).toEqual([]);
		expect(completeness.score).toBe(100);
	});

	it('reports concrete missing fields for incomplete listings', () => {
		const completeness = scoreInventoryCompleteness({
			...completeListing,
			documents: [],
			features: ['Head-up display'],
			galleryImages: ['/front.webp'],
			previewImage: '/assets/images/card/card-1.jpg',
			sourceUrl: '',
			transmission: 'On request'
		});

		expect(completeness.level).toBe('needs_work');
		expect(completeness.score).toBeLessThan(100);
		expect(completeness.missing).toEqual(
			expect.arrayContaining([
				'at least 3 features',
				'at least 3 gallery images',
				'preview image',
				'transmission'
			])
		);
		expect(completeness.warnings).toEqual(expect.arrayContaining(['documents', 'source URL']));
	});
});
