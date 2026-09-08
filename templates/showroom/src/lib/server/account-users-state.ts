import type {
	AuxeroUserManagementData,
	AuxeroUserManagementNote,
	AuxeroUserManagementRow,
	AuxeroUserManagementStat
} from '$lib/auxero/user-management';
import { agents } from '$lib/data/agents';
import {
	accountAvatarByRole,
	accountContext,
	type AccountContext
} from './account-dashboard-state';
import type { AuxeroRenderOptions } from './auxero-listing-data';
import { listInquiriesForRole } from './inquiries';
import { listMessagesForRole } from './messages';
import { listManagedUsers } from './users';

export const accountUserManagementRowsData = (): AuxeroUserManagementRow[] =>
	listManagedUsers().map((user) => ({
		actions: [
			{
				ariaLabel: `Message ${user.name}`,
				href: '/admin/messages?role=admin',
				icon: '/assets/images/dashboard/Messages.svg',
				kind: 'message',
				label: 'Message'
			},
			{
				ariaLabel: `Review ${user.name}`,
				href: '/admin/inquiries?role=admin',
				icon: '/assets/images/dashboard/MyReviews.svg',
				kind: 'review',
				label: 'Review'
			}
		],
		columns: [user.email, user.roleLabel, user.context, user.statusLabel],
		description: user.context,
		id: user.id,
		image: accountAvatarByRole[user.avatarRole],
		kind: user.kind,
		name: user.name,
		role: user.roleLabel
	}));

export const accountUserManagementData = (context: AccountContext): AuxeroUserManagementData => ({
	footerText: 'Role-aware prototype accounts and lead contacts managed by Eliqauto.',
	headers: ['User', 'Email', 'Role', 'Context', 'Status', 'Action'],
	rows: context.isAdmin ? accountUserManagementRowsData() : []
});

export const accountUserManagementNotesData = (): AuxeroUserManagementNote[] => [
	{
		title: 'Admin',
		text: 'Full access to inventory, inquiries, messages, agents, and users.'
	},
	{
		title: 'Agent',
		text: 'Can work assigned inquiries and message threads without full admin access.'
	},
	{
		title: 'Customer',
		text: 'Keeps favorites, compare list, messages, profile, password, and sell-car submissions.'
	}
];

export const accountUserManagementStatsData = (): AuxeroUserManagementStat[] => [
	{
		href: '/admin/users',
		icon: '/assets/images/dashboard/MyProfile.svg',
		label: 'User Roles',
		value: String(accountUserManagementRowsData().length)
	},
	{
		href: '/admin/inquiries',
		icon: '/assets/images/dashboard/clockCountdown.svg',
		label: 'Open Leads',
		value: String(listInquiriesForRole('admin').length)
	},
	{
		href: '/admin/messages',
		icon: '/assets/images/dashboard/chats.svg',
		label: 'Message Threads',
		value: String(listMessagesForRole('admin').length)
	},
	{
		href: '/admin/agents',
		icon: '/assets/images/dashboard/star.svg',
		label: 'Agents',
		value: String(agents.length)
	}
];

export const getAccountUserManagementData = (
	templateFile: string,
	options: AuxeroRenderOptions = {}
) => accountUserManagementData(accountContext(templateFile, options));
