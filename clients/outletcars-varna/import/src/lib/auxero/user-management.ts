export type AuxeroUserManagementActionHref =
	| '/admin/inquiries?role=admin'
	| '/admin/messages?role=admin';

export type AuxeroUserManagementAction = {
	ariaLabel: string;
	href: AuxeroUserManagementActionHref;
	icon: string;
	kind: 'message' | 'review';
	label: string;
};

export type AuxeroUserManagementRow = {
	actions: AuxeroUserManagementAction[];
	columns: string[];
	description: string;
	id: string;
	image: string;
	kind: string;
	name: string;
	role: string;
};

export type AuxeroUserManagementData = {
	footerText: string;
	headers: string[];
	rows: AuxeroUserManagementRow[];
};

export type AuxeroUserManagementNote = {
	text: string;
	title: string;
};

export type AuxeroUserManagementStat = {
	href: string;
	icon: string;
	label: string;
	value: string;
};
