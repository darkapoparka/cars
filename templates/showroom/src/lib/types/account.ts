export type EliqautoRole = 'customer' | 'agent' | 'admin';

export type EliqautoSession = {
	email: string;
	name: string;
	role: EliqautoRole;
	token?: string;
};

export type EliqautoUserStatus = 'active' | 'paused' | 'lead';

export type EliqautoUser = {
	email: string;
	id: string;
	name: string;
	phone: string;
	role: EliqautoRole;
	status: EliqautoUserStatus;
};

export type EliqautoSessionRecord = {
	createdAt: string;
	email: string;
	expiresAt: string;
	name: string;
	role: EliqautoRole;
	token: string;
	userId: string;
};

export type EliqautoInquiryStatus = 'new' | 'assigned' | 'contacted' | 'closed';

export type EliqautoInquiryRecord = {
	assignedAgentSlug: string;
	contactEmail: string;
	contactName: string;
	contactPhone: string;
	createdAt: string;
	id: string;
	message: string;
	routePath: string;
	source: string;
	status: EliqautoInquiryStatus;
	userRole: EliqautoRole;
	vehicleSlug?: string;
	vehicleTitle?: string;
};

export type EliqautoMessageStatus = 'open' | 'read' | 'closed';

export type EliqautoMessageRecord = {
	authorEmail: string;
	authorName: string;
	createdAt: string;
	id: string;
	message: string;
	routePath: string;
	status: EliqautoMessageStatus;
	threadId: string;
	vehicleSlug?: string;
};

export type EliqautoVehicleSubmissionStatus = 'draft' | 'submitted' | 'reviewing' | 'published';

export type EliqautoCmsDocument = {
	filename: string;
	id: string;
	mimeType: string;
	originalName: string;
	size: number;
	uploadedAt: string;
	url: string;
};

export type EliqautoVehicleSubmissionRecord = {
	contactEmail: string;
	contactName: string;
	contactPhone: string;
	createdAt: string;
	documents?: EliqautoCmsDocument[];
	expectedPrice: string;
	galleryImages?: string[];
	id: string;
	message: string;
	mileage: string;
	previewImage?: string;
	routePath: string;
	source: 'sell-your-car' | 'admin-listing' | 'customer-listing';
	status: EliqautoVehicleSubmissionStatus;
	title: string;
	vin: string;
};

export type EliqautoInventoryListingStatus =
	| 'draft'
	| 'intake'
	| 'media_ready'
	| 'published'
	| 'reserved'
	| 'sold'
	| 'archived';

export type EliqautoInventoryListingRecord = {
	bodyType: string;
	brand: string;
	color: string;
	createdAt: string;
	description: string;
	documents: EliqautoCmsDocument[];
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
	status: EliqautoInventoryListingStatus;
	stockNumber: string;
	submissionId?: string;
	title: string;
	transmission: string;
	updatedAt: string;
	vin: string;
	year: number;
};

export type EliqautoPasswordChangeRecord = {
	createdAt: string;
	email: string;
	id: string;
	role: EliqautoRole;
	userId: string;
};
