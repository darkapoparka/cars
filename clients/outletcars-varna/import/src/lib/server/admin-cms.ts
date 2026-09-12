import { posts } from '$lib/data/blog';
import type { DayNightCmsDocument } from '$lib/types/account';
import { listManagedAgents } from './agents';
import { listInquiriesForRole } from './inquiries';
import { listInventoryForAdmin, listVehicleSubmissions } from './inventory';
import { listMessagesForRole } from './messages';
import { listManagedUsers } from './users';
import {
	cmsListingStatusLabel,
	scoreInventoryCompleteness,
	type CmsCompleteness
} from './cms-workflow';

export type AdminInventoryRow = {
	bodyType: string;
	brand: string;
	color: string;
	completeness: CmsCompleteness;
	createdAt: string;
	description: string;
	documentCount: number;
	documents: DayNightCmsDocument[];
	doors: number;
	engine: string;
	features: string[];
	fuel: string;
	galleryImages: string[];
	id: string;
	image: string;
	location: string;
	mileage: string;
	mileageValue: number;
	mediaCount: number;
	model: string;
	previewImage: string;
	price: number;
	priceLabel: string;
	routePath: string;
	seats: number;
	slug: string;
	source: 'admin-listing' | 'static-vehicle';
	sourceUrl: string;
	status: string;
	statusLabel: string;
	stockNumber: string;
	title: string;
	transmission: string;
	updatedAt: string;
	vin: string;
	year: number | string;
};

export type AdminRecentWorkHref = '/admin/imports' | '/admin/inquiries' | '/admin/messages';

export type AdminRecentWorkItem = {
	body: string;
	createdAt: string;
	href: AdminRecentWorkHref;
	id: string;
	label: string;
	meta: string;
	status: string;
	type: 'Import' | 'Inquiry' | 'Message';
};

const fallbackImage = '/assets/images/card/card-1.jpg';
const km = (value: number) =>
	value > 0 ? `${value.toLocaleString('fr-FR').replace(/\u202f/g, ' ')} km` : 'On request';

const statusIsOpen = (status: string) => !['closed', 'archived', 'published'].includes(status);

export function getAdminInventoryRows({
	includeArchived = false
}: { includeArchived?: boolean } = {}): AdminInventoryRow[] {
	return listInventoryForAdmin({ includeArchived }).map((record) => {
		const row = {
			bodyType: record.bodyType,
			brand: record.brand,
			color: record.color,
			createdAt: record.createdAt,
			description: record.description,
			documents: record.documents,
			doors: record.doors,
			engine: record.engine,
			features: record.features,
			fuel: record.fuel,
			galleryImages: record.galleryImages,
			id: record.id,
			image: record.previewImage || record.galleryImages[0] || fallbackImage,
			location: record.location,
			mileage: km(record.mileage),
			mileageValue: record.mileage,
			model: record.model,
			previewImage: record.previewImage,
			price: record.price,
			priceLabel: record.priceLabel,
			routePath: record.routePath,
			seats: record.seats,
			slug: record.slug,
			sourceUrl: record.sourceUrl,
			source: record.source,
			stockNumber: record.stockNumber,
			status: record.status,
			title: record.title,
			transmission: record.transmission,
			updatedAt: record.updatedAt,
			vin: record.vin,
			year: record.year || 'Draft'
		};

		return {
			...row,
			completeness: scoreInventoryCompleteness(row),
			documentCount: row.documents.length,
			mediaCount: [row.previewImage, ...row.galleryImages].filter(Boolean).length,
			statusLabel: cmsListingStatusLabel(row.status)
		};
	});
}

export function getAdminInventoryRow(id: string) {
	let decodedId = id;

	try {
		decodedId = decodeURIComponent(id);
	} catch {
		decodedId = id;
	}

	return getAdminInventoryRows({ includeArchived: true }).find(
		(row) =>
			row.id === id ||
			row.id === decodedId ||
			row.slug === id ||
			row.slug === decodedId ||
			row.routePath.endsWith(`/${id}`) ||
			row.routePath.endsWith(`/${decodedId}`)
	);
}

export function getAdminCmsOverview() {
	const inventory = getAdminInventoryRows();
	const inquiries = listInquiriesForRole('admin');
	const messages = listMessagesForRole('admin');
	const agents = listManagedAgents();
	const users = listManagedUsers();
	const imports = listVehicleSubmissions();
	const liveInventory = inventory.filter((row) => row.status === 'published');
	const draftInventory = inventory.filter((row) => row.status === 'draft');
	const openInquiries = inquiries.filter((inquiry) => statusIsOpen(inquiry.status));
	const openMessages = messages.filter((message) => statusIsOpen(message.status));
	const openMessageThreadCount = new Set(openMessages.map((message) => message.threadId)).size;
	const activeImports = imports.filter((submission) => submission.status !== 'published');
	const recentWork: AdminRecentWorkItem[] = [
		...openInquiries.slice(0, 3).map((inquiry) => ({
			body: inquiry.message,
			createdAt: inquiry.createdAt,
			href: '/admin/inquiries' as const,
			id: inquiry.id,
			label: inquiry.contactName,
			meta: inquiry.vehicleTitle ?? inquiry.source,
			status: inquiry.status,
			type: 'Inquiry' as const
		})),
		...activeImports.slice(0, 2).map((submission) => ({
			body: submission.message,
			createdAt: submission.createdAt,
			href: '/admin/imports' as const,
			id: submission.id,
			label: submission.contactName,
			meta: submission.title,
			status: submission.status,
			type: 'Import' as const
		})),
		...openMessages.slice(0, 2).map((message) => ({
			body: message.message,
			createdAt: message.createdAt,
			href: '/admin/messages' as const,
			id: message.id,
			label: message.authorName,
			meta: message.threadId,
			status: message.status,
			type: 'Message' as const
		}))
	]
		.sort((left, right) => Date.parse(right.createdAt) - Date.parse(left.createdAt))
		.slice(0, 6);

	return {
		agents,
		analytics: [
			{ label: 'Inventory coverage', value: inventory.length, status: 'Records' },
			{ label: 'Published stock', value: liveInventory.length, status: 'Live' },
			{
				label: 'Open work',
				value: openInquiries.length + openMessages.length + activeImports.length,
				status: 'Queue'
			},
			{ label: 'CMS content', value: posts.length, status: 'Posts' }
		],
		imports,
		inquiries,
		inventory,
		kpis: {
			activeImports: activeImports.length,
			activeUsers: users.filter((user) => user.status === 'active').length,
			agents: agents.length,
			draftListings: draftInventory.length,
			liveListings: liveInventory.length,
			openConversations: openMessageThreadCount,
			openLeads: openInquiries.length,
			publishedPosts: posts.length,
			totalUsers: users.length
		},
		messages,
		posts: posts.map((post) => ({
			...post,
			status: 'published' as const
		})),
		recentInventory: inventory.slice(0, 6),
		recentWork,
		settings: [
			{
				description: 'Prototype sessions are available for admin, agent, and customer role checks.',
				status: 'Active',
				title: 'Access control'
			},
			{
				description:
					'Inventory CRUD uses local OUTLETCARS.BG — Варна server state before the Supabase migration.',
				status: 'Prototype',
				title: 'Inventory persistence'
			},
			{
				description: 'Public Auxero pages remain outside the shadcn admin CSS scope.',
				status: 'Protected',
				title: 'Visual isolation'
			}
		],
		users
	};
}
