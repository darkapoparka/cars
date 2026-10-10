export type AuxeroDashboardHref =
	| '/account/compare'
	| '/account/favorites'
	| '/account/listings'
	| '/account/listings/new'
	| '/account/messages'
	| '/admin/agents'
	| '/admin/inquiries'
	| '/admin/inventory'
	| '/admin/inventory/new'
	| '/admin/messages';

export type AuxeroDashboardStat = {
	href: AuxeroDashboardHref;
	icon: string;
	id: string;
	label: string;
	value: string;
};

export type AuxeroDashboardRecentItem = {
	actionLabel: string;
	avatar: string;
	body: string;
	dateLabel: string;
	href: AuxeroDashboardHref;
	id: string;
	metaLabel: string;
	name: string;
	statusLabel: string;
	title: string;
};

export type AuxeroDashboardAction = {
	href: AuxeroDashboardHref;
	icon: string;
	id: string;
	label: string;
	meta: string;
};

export type AuxeroDashboardSummaryItem = {
	id: string;
	label: string;
	tone?: 'attention' | 'calm' | 'neutral';
	value: string;
};

export type AuxeroDashboardRecentData = {
	actions: AuxeroDashboardAction[];
	heading: string;
	intro: string;
	items: AuxeroDashboardRecentItem[];
	primaryAction: AuxeroDashboardAction;
	summary: AuxeroDashboardSummaryItem[];
};

export type AuxeroDashboardPageData = {
	isAdmin: boolean;
	recent: AuxeroDashboardRecentData;
	roleLabel: string;
	sessionEmail: string;
	sessionName: string;
	stats: AuxeroDashboardStat[];
	subtitle: string;
	title: string;
};
