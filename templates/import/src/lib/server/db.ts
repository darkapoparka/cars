import { agents } from '$lib/data/agents';
import { daynightContact } from '$lib/data/daynight';
import { getVehicleBySlug, vehicles } from '$lib/data/vehicles';
import type {
	DayNightInquiryRecord,
	DayNightInventoryListingRecord,
	DayNightMessageRecord,
	DayNightPasswordChangeRecord,
	DayNightRole,
	DayNightSessionRecord,
	DayNightUser,
	DayNightUserStatus,
	DayNightVehicleSubmissionRecord
} from '$lib/types/account';
import { readCmsCollection, writeCmsCollection } from './cms-persistence';
import { normalizeCmsListingStatus } from './cms-workflow';

export type {
	DayNightInquiryRecord,
	DayNightInquiryStatus,
	DayNightInventoryListingRecord,
	DayNightInventoryListingStatus,
	DayNightMessageRecord,
	DayNightMessageStatus,
	DayNightPasswordChangeRecord,
	DayNightRole,
	DayNightSessionRecord,
	DayNightUser,
	DayNightUserStatus,
	DayNightVehicleSubmissionRecord,
	DayNightVehicleSubmissionStatus
} from '$lib/types/account';

const stamp = () => new Date().toISOString();

let idSequence = 0;
const nextId = (prefix: string) => `${prefix}-${Date.now().toString(36)}-${++idSequence}`;

const prototypeUsers: DayNightUser[] = [
	{
		email: 'admin@daynight.local',
		id: 'user-admin',
		name: 'Day Night Auto Admin',
		phone: daynightContact.primaryPhoneLabel,
		role: 'admin',
		status: 'active'
	},
	{
		email: 'agent@daynight.local',
		id: 'user-agent',
		name: 'Day Night Auto Agent',
		phone: daynightContact.primaryPhoneLabel,
		role: 'agent',
		status: 'active'
	},
	{
		email: 'customer@daynight.local',
		id: 'user-customer',
		name: 'Day Night Auto Customer',
		phone: daynightContact.marketplacePhoneLabel,
		role: 'customer',
		status: 'active'
	}
];

const seededInquiries: DayNightInquiryRecord[] = vehicles.slice(0, 3).map((vehicle, index) => ({
	assignedAgentSlug: vehicle.agentSlug,
	contactEmail: index === 0 ? 'customer@daynight.local' : daynightContact.emailLabel,
	contactName: ['Europe import lead', 'Sell-your-car submission', 'Document review'][index],
	contactPhone: daynightContact.primaryPhoneLabel,
	createdAt: `2026-05-${20 + index}T09:00:00.000Z`,
	id: `inquiry-seed-${index + 1}`,
	message: [
		'Customer asked for source history, transport steps, and viewing timing.',
		'Seller submitted photos and requested a valuation appointment.',
		'Agent noted registration readiness and pending inspection documents.'
	][index],
	routePath: index === 1 ? '/sell-your-car' : `/inventory/${vehicle.slug}`,
	source: index === 1 ? 'sell-your-car' : 'vehicle-detail',
	status: index === 0 ? 'new' : 'assigned',
	userRole: index === 0 ? 'customer' : 'agent',
	vehicleSlug: vehicle.slug,
	vehicleTitle: vehicle.title
}));

const sessions: DayNightSessionRecord[] = [];
const inquiries: DayNightInquiryRecord[] = [...seededInquiries];
const messages: DayNightMessageRecord[] = [
	{
		authorEmail: 'customer@daynight.local',
		authorName: 'Day Night Auto Customer',
		createdAt: '2026-05-22T10:00:00.000Z',
		id: 'message-seed-1',
		message: 'Please send appointment options and inspection notes.',
		routePath: '/account/messages',
		status: 'open',
		threadId: 'daynight-sales',
		vehicleSlug: vehicles[0]?.slug
	}
];
const seededVehicleSubmissions: DayNightVehicleSubmissionRecord[] = [
	{
		contactEmail: 'seller@daynight.local',
		contactName: 'Client vehicle seller',
		contactPhone: daynightContact.primaryPhoneLabel,
		createdAt: '2026-05-23T11:00:00.000Z',
		expectedPrice: '25 000 EUR',
		id: 'submission-seed-1',
		message: 'Client vehicle submitted with VIN, photos, and service history for review.',
		mileage: '120 000 km',
		routePath: '/sell-your-car',
		source: 'sell-your-car',
		status: 'reviewing',
		title: 'Client BMW evaluation',
		vin: 'CLIENT-BMW-001'
	},
	{
		contactEmail: 'tradein@daynight.local',
		contactName: 'Trade-in customer',
		contactPhone: daynightContact.marketplacePhoneLabel,
		createdAt: '2026-05-24T14:30:00.000Z',
		expectedPrice: 'On request',
		id: 'submission-seed-2',
		message: 'Customer asked whether Day Night Auto can prepare a direct offer or client listing.',
		mileage: '98 000 km',
		routePath: '/account/listings',
		source: 'customer-listing',
		status: 'submitted',
		title: 'Trade-in review request',
		vin: 'TRADE-IN-002'
	}
];
const passwordChanges: DayNightPasswordChangeRecord[] = [];

export const listDayNightUsers = () => prototypeUsers.map((user) => ({ ...user }));

export const findDayNightUserByEmail = (email: string) =>
	prototypeUsers.find((user) => user.email.toLowerCase() === email.trim().toLowerCase());

export const findDayNightUserByRole = (role: DayNightRole) =>
	prototypeUsers.find((user) => user.role === role);

export const createDayNightUserRecord = ({
	email,
	name,
	phone,
	role = 'customer',
	status = 'active'
}: {
	email: string;
	name?: string;
	phone?: string;
	role?: DayNightRole;
	status?: DayNightUserStatus;
}) => {
	const existing = findDayNightUserByEmail(email);

	if (existing) return { ...existing };

	const user: DayNightUser = {
		email: email.trim().toLowerCase(),
		id: nextId('user'),
		name: name?.trim() || 'Day Night Auto Customer',
		phone: phone?.trim() || daynightContact.marketplacePhoneLabel,
		role,
		status
	};

	prototypeUsers.push(user);

	return { ...user };
};

export const updateDayNightUserProfile = ({
	email,
	name,
	phone,
	role
}: {
	email?: string;
	name?: string;
	phone?: string;
	role?: DayNightRole;
}) => {
	const user =
		(email ? findDayNightUserByEmail(email) : undefined) ??
		(role ? findDayNightUserByRole(role) : undefined);

	if (!user) return undefined;

	const nextName = name?.trim();
	const nextPhone = phone?.trim();

	if (nextName) user.name = nextName;
	if (nextPhone) user.phone = nextPhone;

	return { ...user };
};

export const updateDayNightUserRecord = ({
	email,
	id,
	name,
	phone,
	status
}: {
	email?: string;
	id?: string;
	name?: string;
	phone?: string;
	status?: DayNightUserStatus;
}) => {
	const user = prototypeUsers.find(
		(candidate) =>
			(id && candidate.id === id) ||
			(email && candidate.email.toLowerCase() === email.trim().toLowerCase())
	);

	if (!user) return undefined;

	const nextName = name?.trim();
	const nextPhone = phone?.trim();

	if (nextName) user.name = nextName;
	if (nextPhone) user.phone = nextPhone;
	if (status) user.status = status;

	return { ...user };
};

export const createDayNightSessionRecord = (user: DayNightUser): DayNightSessionRecord => {
	const createdAt = stamp();
	const expiresAt = new Date(Date.now() + 1000 * 60 * 60 * 8).toISOString();
	const session = {
		createdAt,
		email: user.email,
		expiresAt,
		name: user.name,
		role: user.role,
		token: nextId('session'),
		userId: user.id
	};

	sessions.unshift(session);

	return session;
};

export const listDayNightSessions = () => [...sessions];

export const findDayNightSessionByToken = (token: string) =>
	sessions.find((session) => session.token === token);

export const deleteDayNightSessionByToken = (token: string) => {
	const index = sessions.findIndex((session) => session.token === token);

	if (index < 0) return false;

	sessions.splice(index, 1);

	return true;
};

export const listDayNightInquiries = () => [...inquiries];

const agentSlugFromRoute = (routePath?: string) => {
	const normalized = routePath?.replace(/^\/+|\/+$/g, '');
	const slug = normalized?.startsWith('agents/') ? normalized.split('/')[1] : undefined;

	return agents.some((agent) => agent.slug === slug) ? slug : undefined;
};

const vehicleSlugFromRoute = (routePath?: string) => {
	const normalized = routePath?.replace(/^\/+|\/+$/g, '');
	const slug = normalized?.startsWith('inventory/') ? normalized.split('/')[1] : undefined;

	return slug && getVehicleBySlug(slug) ? slug : undefined;
};

const normalizeAgentSlug = (slug?: string) => {
	const normalized = slug?.trim();

	return agents.some((agent) => agent.slug === normalized) ? normalized : undefined;
};

export const createDayNightInquiryRecord = (
	input: Partial<DayNightInquiryRecord>
): DayNightInquiryRecord => {
	const routePath = input.routePath ?? '/contact';
	const vehicleSlug = input.vehicleSlug ?? vehicleSlugFromRoute(routePath);
	const vehicle = vehicleSlug ? getVehicleBySlug(vehicleSlug) : undefined;
	const fallbackAgent = agents[0]?.slug ?? 'daynight-sales';
	const record: DayNightInquiryRecord = {
		assignedAgentSlug:
			normalizeAgentSlug(input.assignedAgentSlug) ??
			vehicle?.agentSlug ??
			agentSlugFromRoute(routePath) ??
			fallbackAgent,
		contactEmail: input.contactEmail?.trim() || daynightContact.emailLabel,
		contactName: input.contactName?.trim() || 'Day Night Auto website lead',
		contactPhone: input.contactPhone?.trim() || daynightContact.primaryPhoneLabel,
		createdAt: stamp(),
		id: nextId('inquiry'),
		message: input.message?.trim() || 'Website inquiry queued for Day Night Auto follow-up.',
		routePath,
		source: input.source ?? 'website',
		status: input.status ?? 'new',
		userRole: input.userRole ?? 'customer',
		vehicleSlug: vehicle?.slug ?? input.vehicleSlug,
		vehicleTitle: vehicle?.title ?? input.vehicleTitle
	};

	inquiries.unshift(record);

	return record;
};

export const updateDayNightInquiryRecord = (
	id: string,
	patch: Partial<Pick<DayNightInquiryRecord, 'assignedAgentSlug' | 'message' | 'status'>>
) => {
	const record = inquiries.find((inquiry) => inquiry.id === id);

	if (!record) return undefined;

	const assignedAgentSlug = patch.assignedAgentSlug?.trim();
	const message = patch.message?.trim();

	if (assignedAgentSlug) record.assignedAgentSlug = assignedAgentSlug;
	if (message) record.message = message;
	if (patch.status) record.status = patch.status;

	return { ...record };
};

export const listDayNightMessages = () => [...messages];

export const createDayNightMessageRecord = (
	input: Partial<DayNightMessageRecord>
): DayNightMessageRecord => {
	const record: DayNightMessageRecord = {
		authorEmail: input.authorEmail?.trim() || daynightContact.emailLabel,
		authorName: input.authorName?.trim() || 'Day Night Auto website visitor',
		createdAt: stamp(),
		id: nextId('message'),
		message: input.message?.trim() || 'Message queued for Day Night Auto.',
		routePath: input.routePath ?? '/account/messages',
		status: input.status ?? 'open',
		threadId: input.threadId?.trim() || 'daynight-sales',
		vehicleSlug: input.vehicleSlug
	};

	messages.unshift(record);

	return record;
};

export const updateDayNightMessageRecord = (
	id: string,
	patch: Partial<Pick<DayNightMessageRecord, 'message' | 'status'>>
) => {
	const records = messages.filter((message) => message.id === id || message.threadId === id);

	if (records.length === 0) return undefined;

	const nextMessage = patch.message?.trim();

	for (const record of records) {
		if (nextMessage) record.message = nextMessage;
		if (patch.status) record.status = patch.status;
	}

	return { ...records[0] };
};

const persistedVehicleSubmissions = () => readCmsCollection('vehicle-submissions');

const writePersistedVehicleSubmissions = (records: DayNightVehicleSubmissionRecord[]) =>
	writeCmsCollection('vehicle-submissions', records);

export const listDayNightVehicleSubmissions = () => {
	const persisted = persistedVehicleSubmissions();
	const persistedIds = new Set(persisted.map((submission) => submission.id));

	// Persisted records take precedence: when a seeded submission has been edited it is
	// promoted into the persisted collection (see updateDayNightVehicleSubmissionRecord),
	// so filter the original seed out here to avoid a duplicate id.
	return [
		...persisted,
		...seededVehicleSubmissions.filter((submission) => !persistedIds.has(submission.id))
	];
};

export const listDayNightInventoryListings = ({
	includeArchived = false
}: { includeArchived?: boolean } = {}) =>
	(includeArchived
		? readCmsCollection('inventory-listings')
		: readCmsCollection('inventory-listings').filter((listing) => listing.status !== 'archived')
	).map((listing) => ({ ...listing }));

const slugFromTitle = (title: string) =>
	title
		.toLowerCase()
		.replace(/[^a-z0-9]+/g, '-')
		.replace(/^-+|-+$/g, '')
		.slice(0, 64) || 'daynight-listing';

const numberFromValue = (value: unknown, fallback = 0) => {
	if (typeof value === 'number' && Number.isFinite(value)) return value;
	if (value === undefined || value === null) return fallback;

	const normalized = String(value).replace(/[^\d.-]/g, '');

	if (!normalized.trim()) return fallback;

	const parsed = Number(normalized);

	return Number.isFinite(parsed) ? parsed : fallback;
};

const integerFromValue = (value: unknown, fallback = 0) =>
	Math.max(0, Math.round(numberFromValue(value, fallback)));

const trimmedValue = (value: unknown) => String(value ?? '').trim();

const featuresFromValue = (value: unknown) => {
	if (Array.isArray(value)) return value.map(trimmedValue).filter(Boolean);

	return trimmedValue(value)
		.split(/\r?\n|,/)
		.map((feature) => feature.trim())
		.filter(Boolean);
};

const priceLabelFrom = (price: number, fallback?: string) => {
	const label = trimmedValue(fallback);

	if (label) return label;
	if (price > 0) return `${price.toLocaleString('fr-FR').replace(/\u202f/g, ' ')} EUR`;

	return 'On request';
};

const listingSlugs = (exceptId?: string) =>
	new Set([
		...vehicles.map((vehicle) => vehicle.slug),
		...readCmsCollection('inventory-listings')
			.filter((listing) => listing.id !== exceptId)
			.map((listing) => listing.slug)
	]);

const uniqueListingSlug = (title: string, id: string, preferredSlug?: string) => {
	const used = listingSlugs(id);
	const base = slugFromTitle(trimmedValue(preferredSlug) || title);

	if (!used.has(base)) return base;

	const suffixed = `${base}-${id.replace(/^listing-/, '').slice(-8)}`;

	return used.has(suffixed) ? `${base}-${Date.now().toString(36)}` : suffixed;
};

const normalizeListingRecord = (
	input: Partial<DayNightInventoryListingRecord>,
	existing?: DayNightInventoryListingRecord
): DayNightInventoryListingRecord => {
	const createdAt = existing?.createdAt ?? input.createdAt ?? stamp();
	const id = existing?.id ?? (trimmedValue(input.id) || nextId('listing'));
	const title = trimmedValue(input.title) || existing?.title || 'Day Night Auto inventory draft';
	const price = numberFromValue(input.price, existing?.price ?? numberFromValue(input.priceLabel));
	const slug =
		existing && !input.slug
			? existing.slug
			: uniqueListingSlug(title, id, trimmedValue(input.slug) || existing?.slug);

	return {
		bodyType: trimmedValue(input.bodyType) || existing?.bodyType || 'On request',
		brand: trimmedValue(input.brand) || existing?.brand || title.split(/\s+/)[0] || 'Day Night Auto',
		color: trimmedValue(input.color) || existing?.color || 'On request',
		createdAt,
		description:
			trimmedValue(input.description) ||
			existing?.description ||
			`${title} is queued in the Day Night Auto CMS for review.`,
		documents: input.documents ?? existing?.documents ?? [],
		doors: integerFromValue(input.doors, existing?.doors ?? 0),
		engine: trimmedValue(input.engine) || existing?.engine || 'On request',
		features: input.features ? featuresFromValue(input.features) : (existing?.features ?? []),
		fuel: trimmedValue(input.fuel) || existing?.fuel || 'On request',
		galleryImages: input.galleryImages ?? existing?.galleryImages ?? [],
		id,
		location: trimmedValue(input.location) || existing?.location || daynightContact.addressLabel,
		mileage: numberFromValue(input.mileage, existing?.mileage ?? 0),
		model: trimmedValue(input.model) || existing?.model || 'On request',
		previewImage:
			trimmedValue(input.previewImage) ||
			existing?.previewImage ||
			'/assets/images/card/card-1.jpg',
		price,
		priceLabel: priceLabelFrom(price, input.priceLabel ?? existing?.priceLabel),
		routePath: trimmedValue(input.routePath) || existing?.routePath || `/inventory/${slug}`,
		seats: integerFromValue(input.seats, existing?.seats ?? 0),
		slug,
		source: input.source ?? existing?.source ?? 'admin-listing',
		sourceUrl: trimmedValue(input.sourceUrl) || existing?.sourceUrl || '',
		status: normalizeCmsListingStatus(input.status ?? existing?.status),
		stockNumber:
			trimmedValue(input.stockNumber) ||
			existing?.stockNumber ||
			trimmedValue(input.vin) ||
			'On request',
		submissionId: input.submissionId ?? existing?.submissionId,
		title,
		transmission: trimmedValue(input.transmission) || existing?.transmission || 'On request',
		updatedAt: existing ? stamp() : (input.updatedAt ?? createdAt),
		vin:
			trimmedValue(input.vin) || existing?.vin || trimmedValue(input.stockNumber) || 'On request',
		year: integerFromValue(input.year, existing?.year ?? new Date().getFullYear())
	};
};

export const createDayNightInventoryListingRecord = (
	input: Partial<DayNightInventoryListingRecord>
): DayNightInventoryListingRecord => {
	const records = readCmsCollection('inventory-listings');
	const record = normalizeListingRecord(input);

	records.unshift(record);
	writeCmsCollection('inventory-listings', records);
	return { ...record };
};

export const updateDayNightInventoryListingRecord = (
	id: string,
	patch: Partial<DayNightInventoryListingRecord>
) => {
	const records = readCmsCollection('inventory-listings');
	const index = records.findIndex(
		(candidate) => candidate.id === id || candidate.slug === id || candidate.submissionId === id
	);

	if (index < 0) return undefined;

	const listing = normalizeListingRecord(patch, records[index]);

	records[index] = listing;
	writeCmsCollection('inventory-listings', records);
	return { ...listing };
};

export const archiveDayNightInventoryListingRecord = (id: string) =>
	updateDayNightInventoryListingRecord(id, { status: 'archived' });

export const createDayNightVehicleSubmissionRecord = (
	input: Partial<DayNightVehicleSubmissionRecord>
): DayNightVehicleSubmissionRecord => {
	const records = persistedVehicleSubmissions();
	const record: DayNightVehicleSubmissionRecord = {
		contactEmail: input.contactEmail?.trim() || daynightContact.emailLabel,
		contactName: input.contactName?.trim() || 'Day Night Auto customer',
		contactPhone: input.contactPhone?.trim() || daynightContact.primaryPhoneLabel,
		createdAt: stamp(),
		documents: input.documents ?? [],
		expectedPrice: input.expectedPrice?.trim() || 'On request',
		galleryImages: input.galleryImages ?? [],
		id: nextId('submission'),
		message: input.message?.trim() || 'Заявката е в опашка за преглед.',
		mileage: input.mileage?.trim() || 'On request',
		previewImage: input.previewImage,
		routePath: input.routePath ?? '/sell-your-car',
		source: input.source ?? 'sell-your-car',
		status: input.status ?? 'submitted',
		title: input.title?.trim() || 'Клиентски автомобил',
		vin: input.vin?.trim() || 'On request'
	};

	records.unshift(record);
	writePersistedVehicleSubmissions(records);

	return record;
};

export const updateDayNightVehicleSubmissionRecord = (
	id: string,
	patch: Partial<
		Pick<
			DayNightVehicleSubmissionRecord,
			| 'documents'
			| 'expectedPrice'
			| 'galleryImages'
			| 'message'
			| 'mileage'
			| 'previewImage'
			| 'status'
			| 'title'
			| 'vin'
		>
	>
) => {
	const records = persistedVehicleSubmissions();
	const index = records.findIndex((submission) => submission.id === id);
	const existing =
		index >= 0
			? records[index]
			: seededVehicleSubmissions.find((submission) => submission.id === id);

	if (!existing) return undefined;

	// Work on a copy so we never mutate a shared module-level seed object in place
	// (that previously corrupted the canonical seed for every session and was lost on restart).
	const record = { ...existing };

	const expectedPrice = patch.expectedPrice?.trim();
	const message = patch.message?.trim();
	const mileage = patch.mileage?.trim();
	const title = patch.title?.trim();
	const vin = patch.vin?.trim();

	if (expectedPrice) record.expectedPrice = expectedPrice;
	if (message) record.message = message;
	if (mileage) record.mileage = mileage;
	if (title) record.title = title;
	if (vin) record.vin = vin;
	if (patch.status) record.status = patch.status;
	if (patch.previewImage) record.previewImage = patch.previewImage;
	if (patch.galleryImages) record.galleryImages = patch.galleryImages;
	if (patch.documents) record.documents = patch.documents;

	if (index >= 0) {
		records[index] = record;
	} else {
		// Promote a seeded submission into the persisted collection on first edit so the
		// change actually persists (listDayNightVehicleSubmissions dedupes the seed away).
		records.unshift(record);
	}
	writePersistedVehicleSubmissions(records);

	return { ...record };
};

export const createDayNightPasswordChangeRecord = (
	user: DayNightUser
): DayNightPasswordChangeRecord => {
	const record: DayNightPasswordChangeRecord = {
		createdAt: stamp(),
		email: user.email,
		id: nextId('password'),
		role: user.role,
		userId: user.id
	};

	passwordChanges.unshift(record);

	return record;
};

export const listDayNightPasswordChanges = () => [...passwordChanges];
