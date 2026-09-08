import { existsSync, rmSync } from 'node:fs';
import path from 'node:path';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import {
	readCmsCollection,
	resetCmsPersistenceForTests,
	saveCmsUploadFiles
} from './cms-persistence';
import { mergeListingUploads } from './cms-listing-form';
import {
	archiveInventoryListing,
	createInventoryListing,
	duplicateInventoryListing,
	listInventoryForAdmin,
	updateInventoryListingStatus,
	updateInventoryListing
} from './inventory';
import { getPublicVehicleBySlug, listPublishedCmsVehicles } from './public-vehicles';

const testDataRoot = () =>
	path.join(process.cwd(), '.tmp', 'eliqauto-cms-vitest', String(process.pid));
const testUploadsRoot = () => path.join(process.cwd(), 'static', 'uploads', 'cms', 'spec-listing');

const resetCmsState = () => {
	resetCmsPersistenceForTests();
	rmSync(testUploadsRoot(), { force: true, recursive: true });
};

describe('CMS listing persistence', () => {
	beforeEach(resetCmsState);
	afterEach(resetCmsState);

	it('stores full admin listings in durable local JSON', () => {
		const listing = createInventoryListing({
			bodyType: 'SUV',
			brand: 'BMW',
			color: 'Sophisto Grey',
			description: 'Documented Canadian import with service history.',
			doors: 5,
			engine: '3.0 diesel',
			features: ['Head-up display', 'Adaptive cruise'],
			fuel: 'Diesel',
			galleryImages: ['/uploads/cms/spec-listing/gallery/front.webp'],
			location: 'Sofia, Bulgaria',
			mileage: '91000 km',
			model: 'X5',
			previewImage: '/uploads/cms/spec-listing/preview/front.webp',
			price: '42000',
			sourceUrl: 'https://example.com/source',
			status: 'published',
			stockNumber: 'BOH-X5-001',
			title: 'Spec BMW X5 xDrive',
			transmission: 'Automatic',
			vin: 'SPEC-BMW-X5',
			year: 2022
		});
		const records = readCmsCollection('inventory-listings');
		const filePath = path.join(testDataRoot(), 'inventory-listings.json');

		expect(existsSync(filePath)).toBe(true);
		expect(records).toHaveLength(1);
		expect(records[0]).toMatchObject({
			bodyType: 'SUV',
			brand: 'BMW',
			documents: [],
			features: ['Head-up display', 'Adaptive cruise'],
			id: listing.id,
			mileage: 91000,
			price: 42000,
			slug: 'spec-bmw-x5-xdrive',
			status: 'published',
			vin: 'SPEC-BMW-X5'
		});
	});

	it('updates and archives CMS listings without removing static inventory rows', () => {
		const listing = createInventoryListing({
			doors: 5,
			mileage: 28500,
			price: 68900,
			seats: 7,
			status: 'draft',
			title: 'Archive Test Audi Q7',
			vin: 'ARCHIVE-Q7',
			year: 2023
		});
		const mediaUpdated = updateInventoryListing(listing.id, {
			previewImage: '/uploads/cms/archive-test/preview/q7.webp'
		});
		const updated = updateInventoryListing(listing.id, {
			priceLabel: '51 000 EUR',
			status: 'published',
			title: 'Updated Archive Test Audi Q7'
		});
		const archived = archiveInventoryListing(listing.id);
		const visibleRows = listInventoryForAdmin();
		const archivedRows = listInventoryForAdmin({ includeArchived: true });

		expect(mediaUpdated).toMatchObject({
			doors: 5,
			mileage: 28500,
			price: 68900,
			seats: 7,
			year: 2023
		});
		expect(updated?.title).toBe('Updated Archive Test Audi Q7');
		expect(updated?.priceLabel).toBe('51 000 EUR');
		expect(archived?.status).toBe('archived');
		expect(visibleRows.some((row) => row.id === listing.id)).toBe(false);
		expect(archivedRows.some((row) => row.id === listing.id && row.status === 'archived')).toBe(
			true
		);
		expect(visibleRows.some((row) => row.source === 'static-vehicle')).toBe(true);
	});

	it('duplicates CMS listings and supports the expanded status workflow', () => {
		const listing = createInventoryListing({
			brand: 'Mercedes-Benz',
			model: 'GLE',
			status: 'intake',
			title: 'Workflow Test Mercedes GLE',
			vin: 'WORKFLOW-GLE'
		});
		const mediaReady = updateInventoryListingStatus(listing.id, 'media-ready');
		const sold = updateInventoryListingStatus(listing.id, 'sold');
		const duplicate = duplicateInventoryListing(listing.id);
		const staticDuplicate = duplicateInventoryListing('bmw-x5-40i-m-sport-shadow-line');

		expect(mediaReady?.status).toBe('media_ready');
		expect(sold?.status).toBe('sold');
		expect(duplicate).toMatchObject({
			brand: 'Mercedes-Benz',
			model: 'GLE',
			status: 'draft',
			title: 'Workflow Test Mercedes GLE Copy',
			vin: 'WORKFLOW-GLE'
		});
		expect(duplicate?.id).not.toBe(listing.id);
		expect(duplicate?.slug).not.toBe(listing.slug);
		expect(staticDuplicate).toBeUndefined();
	});

	it('validates and stores listing media with safe public paths', async () => {
		const formData = new FormData();
		formData.append('previewImage', new File(['preview'], 'Hero Car.JPG', { type: 'image/jpeg' }));
		formData.append(
			'galleryImages',
			new File(['gallery'], 'left angle.webp', { type: 'image/webp' })
		);
		formData.append(
			'documents',
			new File(['pdf'], 'Service History.PDF', { type: 'application/pdf' })
		);

		const uploads = await saveCmsUploadFiles({ formData, recordId: 'spec-listing' });

		expect(uploads.previewImage).toMatch(
			/^\/uploads\/cms\/spec-listing\/preview\/[a-z0-9-]+-hero-car\.jpg$/
		);
		expect(uploads.galleryImages[0]).toMatch(
			/^\/uploads\/cms\/spec-listing\/gallery\/[a-z0-9-]+-left-angle\.webp$/
		);
		expect(uploads.documents[0]).toMatchObject({
			mimeType: 'application/pdf',
			originalName: 'Service History.PDF',
			url: expect.stringMatching(
				/^\/uploads\/cms\/spec-listing\/documents\/[a-z0-9-]+-service-history\.pdf$/
			)
		});
	});

	it('updates listing media references when staff select preview and remove files', async () => {
		const listing = createInventoryListing({
			documents: [
				{
					filename: 'service.pdf',
					id: 'document-service',
					mimeType: 'application/pdf',
					originalName: 'Service history.pdf',
					size: 100,
					uploadedAt: '2026-06-08T00:00:00.000Z',
					url: '/uploads/cms/media/documents/service.pdf'
				}
			],
			galleryImages: [
				'/uploads/cms/media/gallery/front.webp',
				'/uploads/cms/media/gallery/rear.webp'
			],
			previewImage: '/uploads/cms/media/preview/old.webp',
			status: 'draft',
			title: 'Media Workflow BMW X3',
			vin: 'MEDIA-X3'
		});
		const formData = new FormData();

		formData.append('selectedPreviewImage', '/uploads/cms/media/gallery/rear.webp');
		formData.append('removeGalleryImages', '/uploads/cms/media/gallery/front.webp');
		formData.append('removeDocumentIds', 'document-service');

		const mediaPatch = await mergeListingUploads({
			existing: listing,
			formData,
			recordId: listing.id
		});
		const updated = updateInventoryListing(listing.id, mediaPatch);

		expect(updated?.previewImage).toBe('/uploads/cms/media/gallery/rear.webp');
		expect(updated?.galleryImages).toEqual(['/uploads/cms/media/gallery/rear.webp']);
		expect(updated?.documents).toEqual([]);
	});

	it('maps public CMS listing statuses into public inventory while excluding drafts and sold', () => {
		const published = createInventoryListing({
			brand: 'Porsche',
			model: 'Macan',
			priceLabel: '58 000 EUR',
			status: 'published',
			title: 'Public CMS Porsche Macan',
			vin: 'PUBLIC-MACAN',
			year: 2023
		});
		const draft = createInventoryListing({
			brand: 'Audi',
			model: 'A6',
			status: 'draft',
			title: 'Hidden Draft Audi A6',
			vin: 'DRAFT-A6'
		});
		const reserved = createInventoryListing({
			brand: 'BMW',
			model: 'X7',
			status: 'reserved',
			title: 'Reserved CMS BMW X7',
			vin: 'RESERVED-X7'
		});
		const sold = createInventoryListing({
			brand: 'Mercedes-Benz',
			model: 'S500',
			status: 'sold',
			title: 'Sold CMS Mercedes S500',
			vin: 'SOLD-S500'
		});
		const publicVehicle = getPublicVehicleBySlug(published.slug);

		expect(publicVehicle).toMatchObject({
			brand: 'Porsche',
			priceLabel: '58 000 EUR',
			slug: published.slug,
			title: 'Public CMS Porsche Macan',
			vin: 'PUBLIC-MACAN'
		});
		expect(getPublicVehicleBySlug(draft.slug)).toBeUndefined();
		expect(getPublicVehicleBySlug(reserved.slug)?.title).toBe('Reserved CMS BMW X7');
		expect(getPublicVehicleBySlug(sold.slug)).toBeUndefined();
		expect(listPublishedCmsVehicles().some((vehicle) => vehicle.slug === published.slug)).toBe(
			true
		);
	});
});
