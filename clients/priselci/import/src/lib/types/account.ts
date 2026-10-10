export type DayNightRole = 'customer' | 'agent' | 'admin';

export type DayNightSession = {
	email: string;
	name: string;
	role: DayNightRole;
	token?: string;
};

export type DayNightUserStatus = 'active' | 'paused' | 'lead';

export type DayNightUser = {
	email: string;
	id: string;
	name: string;
	phone: string;
	role: DayNightRole;
	status: DayNightUserStatus;
};

export type DayNightSessionRecord = {
	createdAt: string;
	email: string;
	expiresAt: string;
	name: string;
	role: DayNightRole;
	token: string;
	userId: string;
};

export type DayNightInquiryStatus = 'new' | 'assigned' | 'contacted' | 'closed';

export type DayNightInquiryRecord = {
	assignedAgentSlug: string;
	contactEmail: string;
	contactName: string;
	contactPhone: string;
	createdAt: string;
	id: string;
	message: string;
	routePath: string;
	source: string;
	status: DayNightInquiryStatus;
	userRole: DayNightRole;
	vehicleSlug?: string;
	vehicleTitle?: string;
};

export type DayNightMessageStatus = 'open' | 'read' | 'closed';

export type DayNightMessageRecord = {
	authorEmail: string;
	authorName: string;
	createdAt: string;
	id: string;
	message: string;
	routePath: string;
	status: DayNightMessageStatus;
	threadId: string;
	vehicleSlug?: string;
};

export type DayNightVehicleSubmissionStatus = 'draft' | 'submitted' | 'reviewing' | 'published';

export type DayNightCmsDocument = {
	filename: string;
	id: string;
	mimeType: string;
	originalName: string;
	size: number;
	uploadedAt: string;
	url: string;
};

export type DayNightVehicleSubmissionRecord = {
	contactEmail: string;
	contactName: string;
	contactPhone: string;
	createdAt: string;
	documents?: DayNightCmsDocument[];
	expectedPrice: string;
	galleryImages?: string[];
	id: string;
	message: string;
	mileage: string;
	previewImage?: string;
	routePath: string;
	source: 'sell-your-car' | 'admin-listing' | 'customer-listing';
	status: DayNightVehicleSubmissionStatus;
	title: string;
	vin: string;
};

export type DayNightInventoryListingStatus =
	| 'draft'
	| 'intake'
	| 'media_ready'
	| 'published'
	| 'reserved'
	| 'sold'
	| 'archived';

export type DayNightInventoryListingRecord = {
	bodyType: string;
	brand: string;
	color: string;
	createdAt: string;
	description: string;
	documents: DayNightCmsDocument[];
	doors: number;
	engine: string;
	features: string[];
	fuel: string;
	galleryImages: string[];
	id: string;
	location: string;
	mileage: number;
	model: string;
	previewImage: string;
	price: number;
	priceLabel: string;
	routePath: string;
	seats: number;
	slug: string;
	source: 'admin-listing' | 'static-vehicle';
	sourceUrl: string;
	status: DayNightInventoryListingStatus;
	stockNumber: string;
	submissionId?: string;
	title: string;
	transmission: string;
	updatedAt: string;
	vin: string;
	year: number;
};

export type DayNightPasswordChangeRecord = {
	createdAt: string;
	email: string;
	id: string;
	role: DayNightRole;
	userId: string;
};
