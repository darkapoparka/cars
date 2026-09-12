export type AuxeroAccountListingAction = {
	ariaLabel: string;
	href?: string;
	icon: string;
	kind: 'edit-inventory' | 'edit-submission' | 'message' | 'remove';
	label: string;
};

export type AuxeroAccountListingRow = {
	actions: AuxeroAccountListingAction[];
	columns: string[];
	description: string;
	href?: string;
	id: string;
	image: string;
	kind: 'inventory' | 'submission';
	priceLabel?: string;
	title: string;
	titleMeta?: string;
};

export type AuxeroAccountListingsData = {
	footerText: string;
	headers: string[];
	isSubmissions: boolean;
	pagination?: string[];
	rows: AuxeroAccountListingRow[];
};
