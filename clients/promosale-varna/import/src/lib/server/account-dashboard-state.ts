import type { AuxeroDashboardRecentData, AuxeroDashboardStat } from '$lib/auxero/dashboard';
import type { AuxeroDashboardPageData } from '$lib/auxero/dashboard';
import { agents } from '$lib/data/agents';
import { vehicles } from '$lib/data/vehicles';
import {
	daynightRoleLabel,
	resolveDayNightSession,
	type DayNightRole,
	type DayNightSession
} from './auth';
import type { AuxeroRenderOptions } from './auxero-listing-data';
import { getDayNightGarageState } from './garage';
import { listInquiriesForRole } from './inquiries';
import { listVehicleSubmissions } from './inventory';
import { listMessagesForRole } from './messages';

export type AccountContext = {
	active: string;
	basePath: '/account' | '/admin';
	isAdmin: boolean;
	roleLabel: string;
	session: DayNightSession;
};

export type DashboardStat = AuxeroDashboardStat;

type RecentDashboardItem = {
	avatarRole: DayNightRole;
	body: string;
	date: string;
	name: string;
	title: string;
};

export const accountAvatarByRole: Record<DayNightRole, string> = {
	admin: '/dealer/logo.png',
	agent: agents[1]?.image ?? '/dealer/logo.png',
	customer: '/dealer/logo.png'
};

export const formatDashboardDate = (value: string, fallback = 'Днес') => {
	const date = new Date(value);

	if (Number.isNaN(date.getTime())) return fallback;

	return date.toLocaleDateString('bg-BG', {
		day: 'numeric',
		month: 'short',
		year: 'numeric'
	});
};

const countLabel = (count: number, singular: string, plural = `${singular}s`) =>
	`${count} ${count === 1 ? singular : plural}`;

const sourceLabel = (source: string) => {
	const labels: Record<string, string> = {
		'sell-your-car': 'Seller intake',
		'vehicle-detail': 'Vehicle lead',
		website: 'Website'
	};

	return (
		labels[source] ??
		source
			.split(/[-_\s]+/g)
			.filter(Boolean)
			.map((part) => `${part.charAt(0).toUpperCase()}${part.slice(1)}`)
			.join(' ')
	);
};

const inquiryStatusLabel = (status: string) => {
	const labels: Record<string, string> = {
		assigned: 'Assigned',
		closed: 'Closed',
		contacted: 'Contacted',
		new: 'New'
	};

	return labels[status] ?? status;
};

const messageStatusLabel = (status: string) => {
	const labels: Record<string, string> = {
		closed: 'Затворен',
		open: 'Отворен',
		read: 'Прочетен'
	};

	return labels[status] ?? status;
};

const submissionStatusLabel = (status: string) => {
	const labels: Record<string, string> = {
		draft: 'Чернова',
		published: 'Публикувана',
		reviewing: 'В преглед',
		submitted: 'Подадена'
	};

	return labels[status] ?? status;
};

const dashboardAgentLabel = (slug?: string) => {
	const labels: Record<string, string> = {
		'daynight-import': 'Import team',
		'daynight-inspection': 'Inspection team',
		'daynight-sales': 'Sales team'
	};

	return (slug && labels[slug]) || 'Promosale Varna team';
};

export const activeRouteForAccountTemplate = (templateFile: string, routePath = '') => {
	const normalized = routePath.replace(/^\/+|\/+$/g, '');

	if (normalized.endsWith('favorites')) return 'favorites';
	if (normalized.endsWith('compare')) return 'compare';
	if (normalized.endsWith('inquiries')) return 'inquiries';
	if (normalized.endsWith('messages')) return 'messages';
	if (normalized.endsWith('profile')) return 'profile';
	if (normalized.endsWith('password')) return 'password';
	if (normalized.includes('inventory/edit/')) return 'add';
	if (normalized.includes('listings/edit/')) return 'add';
	if (
		normalized.endsWith('inventory/new') ||
		normalized.endsWith('listings/new') ||
		templateFile === 'add-listings-2.html'
	)
		return 'add';
	if (normalized.endsWith('inventory') || normalized.endsWith('listings')) return 'listings';
	if (normalized.endsWith('agents')) return 'agents';
	if (normalized.endsWith('users')) return 'users';

	return 'dashboard';
};

export const accountContext = (
	templateFile: string,
	options: AuxeroRenderOptions = {}
): AccountContext => {
	const routePath = options.routePath ?? '';
	const session = options.session ?? resolveDayNightSession(routePath, options.searchParams);
	const isAdmin = routePath.replace(/^\/+/, '').startsWith('admin');

	return {
		active: activeRouteForAccountTemplate(templateFile, routePath),
		basePath: isAdmin ? '/admin' : '/account',
		isAdmin,
		roleLabel: daynightRoleLabel(session.role),
		session
	};
};

export const accountDashboardStatsData = (context: AccountContext): DashboardStat[] => {
	const inquiryCount = listInquiriesForRole(
		context.isAdmin ? 'admin' : context.session.role
	).length;
	const messageCount = listMessagesForRole(context.session.role).length;
	const submissionCount = listVehicleSubmissions().length;
	const garage = context.isAdmin ? undefined : getDayNightGarageState(context.session);

	return context.isAdmin
		? [
				{
					href: '/admin/inventory',
					icon: '/assets/images/dashboard/car.svg',
					id: 'inventory',
					label: 'Inventory',
					value: String(vehicles.length)
				},
				{
					href: '/admin/inquiries',
					icon: '/assets/images/dashboard/clockCountdown.svg',
					id: 'inquiries',
					label: 'Open Leads',
					value: String(inquiryCount)
				},
				{
					href: '/admin/messages',
					icon: '/assets/images/dashboard/chats.svg',
					id: 'messages',
					label: 'Messages',
					value: String(messageCount)
				},
				{
					href: '/admin/agents',
					icon: '/assets/images/dashboard/star.svg',
					id: 'agents',
					label: 'Agents',
					value: String(agents.length)
				}
			]
		: [
				{
					href: '/account/listings',
					icon: '/assets/images/dashboard/car.svg',
					id: 'submissions',
					label: 'Подадени обяви',
					value: String(submissionCount)
				},
				{
					href: '/account/messages',
					icon: '/assets/images/dashboard/clockCountdown.svg',
					id: 'messages',
					label: 'Отворени разговори',
					value: String(messageCount)
				},
				{
					href: '/account/favorites',
					icon: '/assets/images/dashboard/star.svg',
					id: 'favorites',
					label: 'Любими',
					value: String(garage?.favorites.length ?? 0)
				},
				{
					href: '/account/compare',
					icon: '/assets/images/dashboard/chats.svg',
					id: 'compare',
					label: 'За сравнение',
					value: String(garage?.compare.length ?? 0)
				}
			];
};

export const accountDashboardRecentData = (context: AccountContext): AuxeroDashboardRecentData => {
	const inquiries = listInquiriesForRole(context.isAdmin ? 'admin' : context.session.role);
	const messages = listMessagesForRole(context.session.role);
	const submissions = listVehicleSubmissions();
	const garage = context.isAdmin ? undefined : getDayNightGarageState(context.session);
	const openInquiries = inquiries.filter((inquiry) => inquiry.status !== 'closed');
	const newInquiries = inquiries.filter((inquiry) => inquiry.status === 'new');
	const openMessages = messages.filter((message) => message.status !== 'closed');
	const reviewingSubmissions = submissions.filter((submission) =>
		['reviewing', 'submitted'].includes(submission.status)
	);

	if (context.isAdmin) {
		const items = inquiries.slice(0, 3);

		return {
			actions: [
				{
					href: '/admin/inquiries',
					icon: '/assets/images/dashboard/clockCountdown.svg',
					id: 'review-leads',
					label: 'Review leads',
					meta: countLabel(openInquiries.length, 'open lead')
				},
				{
					href: '/admin/messages',
					icon: '/assets/images/dashboard/chats.svg',
					id: 'reply-messages',
					label: 'Reply messages',
					meta: countLabel(openMessages.length, 'open thread')
				},
				{
					href: '/admin/inventory/new',
					icon: '/assets/images/dashboard/car.svg',
					id: 'add-listing',
					label: 'Add listing',
					meta: 'Create inventory draft'
				},
				{
					href: '/admin/agents',
					icon: '/assets/images/dashboard/star.svg',
					id: 'assign-team',
					label: 'Assign team',
					meta: countLabel(agents.length, 'agent')
				}
			],
			heading: 'Admin Focus',
			intro: 'Triage leads, messages, and inventory without leaving the Auxero dashboard flow.',
			items: items.map((inquiry, index) => {
				const agentName = dashboardAgentLabel(inquiry.assignedAgentSlug);

				return {
					actionLabel: 'Open lead',
					avatar:
						accountAvatarByRole[
							inquiry.source === 'sell-your-car' ? 'agent' : context.session.role
						],
					body: inquiry.message,
					dateLabel: formatDashboardDate(inquiry.createdAt, `May ${20 + index}, 2026`),
					href: '/admin/inquiries',
					id: inquiry.id,
					metaLabel: `${sourceLabel(inquiry.source)} · ${agentName}`,
					name: inquiry.contactName,
					statusLabel: inquiryStatusLabel(inquiry.status),
					title: inquiry.vehicleTitle ?? sourceLabel(inquiry.source)
				};
			}),
			primaryAction: {
				href: '/admin/inventory/new',
				icon: '/assets/images/dashboard/car.svg',
				id: 'primary-add-listing',
				label: 'Add listing',
				meta: 'Create inventory draft'
			},
			summary: [
				{
					id: 'new-leads',
					label: 'New leads',
					tone: newInquiries.length > 0 ? 'attention' : 'neutral',
					value: String(newInquiries.length)
				},
				{
					id: 'needs-reply',
					label: 'Needs reply',
					tone: openMessages.length > 0 ? 'attention' : 'neutral',
					value: String(openMessages.length)
				},
				{
					id: 'car-reviews',
					label: 'Car reviews',
					tone: reviewingSubmissions.length > 0 ? 'calm' : 'neutral',
					value: String(reviewingSubmissions.length)
				}
			]
		};
	}

	const items: RecentDashboardItem[] = messages.slice(0, 3).map((message) => ({
		avatarRole: 'agent' as DayNightRole,
		body: message.message,
		date: message.createdAt,
		name: message.threadId === 'daynight-sales' ? 'Promosale Varna Sales' : message.authorName,
		title: message.vehicleSlug
			? (vehicles.find((vehicle) => vehicle.slug === message.vehicleSlug)?.title ??
				'Автомобил на Promosale Varna')
			: message.threadId
	}));

	return {
		actions: [
			{
				href: '/account/messages',
				icon: '/assets/images/dashboard/chats.svg',
				id: 'open-messages',
				label: 'Отвори съобщенията',
				meta: countLabel(openMessages.length, 'отворена тема', 'отворени теми')
			},
			{
				href: '/account/listings',
				icon: '/assets/images/dashboard/car.svg',
				id: 'view-listings',
				label: 'Моите обяви',
				meta: countLabel(submissions.length, 'обява', 'обяви')
			},
			{
				href: '/account/favorites',
				icon: '/assets/images/dashboard/star.svg',
				id: 'view-favorites',
				label: 'Любими',
				meta: countLabel(garage?.favorites.length ?? 0, 'запазен автомобил', 'запазени автомобила')
			}
		],
		heading: 'Скорошни съобщения',
		intro: 'Продължи последния разговор с Promosale Varna и движи запазените автомобили напред.',
		items: items.map((item, index) => {
			const message = messages[index];

			return {
				actionLabel: 'Отвори темата',
				avatar: accountAvatarByRole[item.avatarRole],
				body: item.body,
				dateLabel: formatDashboardDate(item.date, `${20 + index} май 2026`),
				href: '/account/messages',
				id: message?.id ?? `${item.name}-${item.title}-${index}`,
				metaLabel: message?.threadId ?? 'Продажби Promosale Varna',
				name: item.name,
				statusLabel: messageStatusLabel(message?.status ?? 'open'),
				title: item.title
			};
		}),
		primaryAction: {
			href: '/account/messages',
			icon: '/assets/images/dashboard/chats.svg',
			id: 'primary-open-messages',
			label: 'Отвори съобщенията',
			meta: countLabel(openMessages.length, 'отворена тема', 'отворени теми')
		},
		summary: [
			{
				id: 'open-threads',
				label: 'Отворени теми',
				tone: openMessages.length > 0 ? 'attention' : 'neutral',
				value: String(openMessages.length)
			},
			{
				id: 'saved-cars',
				label: 'Запазени автомобили',
				tone: 'calm',
				value: String(garage?.favorites.length ?? 0)
			},
			{
				id: 'latest-status',
				label: 'Последен статус',
				tone: 'neutral',
				value: submissionStatusLabel(submissions[0]?.status ?? 'submitted')
			}
		]
	};
};

export const getAccountDashboardRecentData = (
	templateFile: string,
	options: AuxeroRenderOptions = {}
) => accountDashboardRecentData(accountContext(templateFile, options));

export const getAccountDashboardStatsData = (
	templateFile: string,
	options: AuxeroRenderOptions = {}
) => accountDashboardStatsData(accountContext(templateFile, options));

export const getAccountDashboardPageData = (
	templateFile: string,
	options: AuxeroRenderOptions = {},
	page: Pick<AuxeroDashboardPageData, 'subtitle' | 'title'>
): AuxeroDashboardPageData => {
	const context = accountContext(templateFile, options);

	return {
		isAdmin: context.isAdmin,
		recent: accountDashboardRecentData(context),
		roleLabel: context.isAdmin ? (context.session.role === 'agent' ? 'Agent' : 'Admin') : 'Клиент',
		sessionEmail: context.session.email,
		sessionName: context.session.name,
		stats: accountDashboardStatsData(context),
		subtitle: page.subtitle,
		title: page.title
	};
};
