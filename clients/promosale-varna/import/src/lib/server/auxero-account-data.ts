import type {
	AuxeroAccountListingAction,
	AuxeroAccountListingRow,
	AuxeroAccountListingsData
} from '$lib/auxero/account-listings';
import type { AuxeroMessageThreadData } from '$lib/auxero/messages';
import type {
	AuxeroUserManagementData,
	AuxeroUserManagementNote,
	AuxeroUserManagementStat
} from '$lib/auxero/user-management';
import { daynightContact } from '$lib/data/daynight';
import { vehicles, type Vehicle } from '$lib/data/vehicles';
import { resolveDayNightSession } from './auth';
import type { AuxeroRenderOptions } from './auxero-listing-data';
import { listInquiriesForRole } from './inquiries';
import { listMessagesForRole } from './messages';
import { getDayNightGarageState } from './garage';
import {
	accountAvatarByRole,
	accountContext,
	accountDashboardRecentData,
	accountDashboardStatsData,
	type AccountContext
} from './account-dashboard-state';
import { accountListingsData } from './account-listings-state';
import { accountMessageThreadData } from './account-message-state';
import { accountPasswordFormData, accountProfileFormData } from './account-profile-state';
import { accountListingFormData, listingFormFieldValue } from './account-listing-form-state';
import {
	accountUserManagementData,
	accountUserManagementNotesData,
	accountUserManagementStatsData
} from './account-users-state';

type DashboardMenuItem = {
	badge?: number;
	href: string;
	icon: string;
	id: string;
	label: string;
};

const demoVehicleTitles = [
	'Audi A6 Avant E-Tron',
	'2024 Hyundai Elantra',
	'Kia EV9 2024',
	'Genesis Electrified G80',
	'Chevrolet Camaro 2020',
	'Audi R8'
] as const;

const dashboardIcon = '/assets/images/dashboard/Dashboard.svg';
const listingIcon = '/assets/images/dashboard/MyListing.svg';
const addListingIcon = '/assets/images/dashboard/AddListing.svg';
const favoritesIcon = '/assets/images/dashboard/MyFavorites.svg';
const reviewsIcon = '/assets/images/dashboard/MyReviews.svg';
const messagesIcon = '/assets/images/dashboard/Messages.svg';
const profileIcon = '/assets/images/dashboard/MyProfile.svg';
const passwordIcon = '/assets/images/dashboard/ChangePassword.svg';
const logoutIcon = '/assets/images/dashboard/Logout.svg';

const escapeHtml = (value: string | number) =>
	String(value)
		.replaceAll('&', '&amp;')
		.replaceAll('<', '&lt;')
		.replaceAll('>', '&gt;')
		.replaceAll('"', '&quot;')
		.replaceAll("'", '&#39;');

const km = (value: number) => `${value.toLocaleString('fr-FR').replace(/\u202f/g, ' ')} km`;

const hiddenInput = (name: string, value: string) =>
	`<input type="hidden" name="${escapeHtml(name)}" value="${escapeHtml(value)}">`;

const setInputValueById = (html: string, id: string, value: string) =>
	html.replace(
		new RegExp(`(<input\\b(?=[^>]*\\bid="${id}")[^>]*\\bvalue=")[^"]*(")`, 'i'),
		(_match, before: string, after: string) => `${before}${escapeHtml(value)}${after}`
	);

const findClosingDivIndex = (html: string, openDivIndex: number) => {
	const pattern = /<\/?div\b[^>]*>/gi;
	pattern.lastIndex = openDivIndex;
	let depth = 0;
	let match: RegExpExecArray | null;

	while ((match = pattern.exec(html))) {
		if (match[0].startsWith('</')) {
			depth -= 1;
		} else {
			depth += 1;
		}

		if (depth === 0) return match.index + match[0].length;
	}

	return -1;
};

const replaceDivBlock = (html: string, start: number, replacement: string) => {
	if (start < 0) return html;

	const end = findClosingDivIndex(html, start);

	if (end < 0) return html;

	return `${html.slice(0, start)}${replacement}${html.slice(end)}`;
};

const replaceFirstDivAfter = (
	html: string,
	marker: string,
	blockStart: string,
	replacement: string
) => {
	const markerIndex = html.indexOf(marker);
	if (markerIndex < 0) return html;

	const start = html.indexOf(blockStart, markerIndex);

	return replaceDivBlock(html, start, replacement);
};

const replaceDivContaining = (
	html: string,
	marker: string,
	blockStart: string,
	replacement: string
) => {
	const markerIndex = html.indexOf(marker);
	if (markerIndex < 0) return html;

	const start = html.lastIndexOf(blockStart, markerIndex);

	return replaceDivBlock(html, start, replacement);
};

const addClassToFirstFormAfter = (
	html: string,
	marker: string,
	className: string,
	attributes = ''
) => {
	const markerIndex = html.indexOf(marker);
	const formStart = html.indexOf('<form action="#">', markerIndex);

	if (formStart < 0) return html;

	return `${html.slice(0, formStart)}<form action="#" class="${className}" novalidate${attributes}>${html.slice(
		formStart + '<form action="#">'.length
	)}`;
};

const menuItem = (
	context: AccountContext,
	id: string,
	href: string,
	icon: string,
	label: string,
	badge?: number
) => {
	const isActive = context.active === id;

	return `<li>
	<a href="${href}" class="dashboard-menu-item ${isActive ? 'active' : ''}" data-daynight-menu-item="${escapeHtml(id)}"${isActive ? ' aria-current="page"' : ''}>
		<img src="${icon}" alt="${escapeHtml(label)}">
		${escapeHtml(label)}
		${badge ? `<span class="number" data-daynight-menu-badge="${escapeHtml(id)}">${badge}</span>` : ''}
	</a>
</li>`;
};

const dashboardMenu = (context: AccountContext) => {
	const inquiryCount = listInquiriesForRole(
		context.session.role === 'agent' ? 'agent' : 'admin'
	).length;
	const messageCount = listMessagesForRole(context.session.role).length;
	const agentRoleQuery = context.session.role === 'agent' ? '?role=agent' : '';
	const items: DashboardMenuItem[] =
		context.isAdmin && context.session.role === 'agent'
			? [
					{
						badge: inquiryCount,
						href: `/admin/inquiries${agentRoleQuery}`,
						icon: reviewsIcon,
						id: 'inquiries',
						label: 'Inquiries'
					},
					{
						badge: messageCount,
						href: `/admin/messages${agentRoleQuery}`,
						icon: messagesIcon,
						id: 'messages',
						label: 'Messages'
					},
					{
						href: '/account/profile?role=agent',
						icon: profileIcon,
						id: 'profile',
						label: 'Profile'
					},
					{
						href: '/account/password?role=agent',
						icon: passwordIcon,
						id: 'password',
						label: 'Change Password'
					}
				]
			: context.isAdmin
				? [
						{ href: '/admin', icon: dashboardIcon, id: 'dashboard', label: 'Dashboard' },
						{
							href: '/admin/inventory',
							icon: listingIcon,
							id: 'listings',
							label: 'Inventory'
						},
						{
							href: '/admin/inventory/new',
							icon: addListingIcon,
							id: 'add',
							label: 'Add Listing'
						},
						{
							badge: inquiryCount,
							href: '/admin/inquiries',
							icon: reviewsIcon,
							id: 'inquiries',
							label: 'Inquiries'
						},
						{
							badge: messageCount,
							href: '/admin/messages',
							icon: messagesIcon,
							id: 'messages',
							label: 'Messages'
						},
						{ href: '/admin/agents', icon: profileIcon, id: 'agents', label: 'Agents' },
						{ href: '/admin/users', icon: favoritesIcon, id: 'users', label: 'Users' },
						{
							href: '/account/profile?role=admin',
							icon: profileIcon,
							id: 'profile',
							label: 'Profile'
						},
						{
							href: '/account/password?role=admin',
							icon: passwordIcon,
							id: 'password',
							label: 'Change Password'
						}
					]
				: [
						{ href: '/account', icon: dashboardIcon, id: 'dashboard', label: 'Табло' },
						{
							href: '/account/listings',
							icon: listingIcon,
							id: 'listings',
							label: 'Моите обяви'
						},
						{
							href: '/account/listings/new',
							icon: addListingIcon,
							id: 'add',
							label: 'Подай автомобил'
						},
						{
							href: '/account/favorites',
							icon: favoritesIcon,
							id: 'favorites',
							label: 'Любими'
						},
						{ href: '/account/compare', icon: reviewsIcon, id: 'compare', label: 'Сравнения' },
						{
							badge: messageCount,
							href: '/account/messages',
							icon: messagesIcon,
							id: 'messages',
							label: 'Съобщения'
						},
						{ href: '/account/profile', icon: profileIcon, id: 'profile', label: 'Профил' },
						{
							href: '/account/password',
							icon: passwordIcon,
							id: 'password',
							label: 'Смяна на парола'
						}
					];

	return `<ul class="dashboard-menu">
	${items
		.map((item) => menuItem(context, item.id, item.href, item.icon, item.label, item.badge))
		.join('\n')}
	${menuItem(context, 'logout', '/', logoutIcon, context.isAdmin ? 'Logout' : 'Изход')}
</ul>`;
};

const accountDropdownItem = ({ href, icon, id, label }: DashboardMenuItem) => `<li>
	<a href="${href}" data-daynight-user-menu-item="${escapeHtml(id)}">
		<img src="${icon}" alt="${escapeHtml(label)}" width="24" height="24">
		${escapeHtml(label)}
	</a>
</li>`;

const accountDropdown = (context: AccountContext) => {
	const items: DashboardMenuItem[] =
		context.isAdmin && context.session.role === 'agent'
			? [
					{
						href: '/admin/inquiries?role=agent',
						icon: reviewsIcon,
						id: 'inquiries',
						label: 'Agent Inquiries'
					},
					{
						href: '/admin/messages?role=agent',
						icon: messagesIcon,
						id: 'messages',
						label: 'Agent Messages'
					},
					{
						href: '/account/profile?role=agent',
						icon: profileIcon,
						id: 'profile',
						label: 'Profile'
					},
					{
						href: '/account/password?role=agent',
						icon: passwordIcon,
						id: 'password',
						label: 'Change Password'
					}
				]
			: context.isAdmin
				? [
						{ href: '/admin', icon: dashboardIcon, id: 'dashboard', label: 'Admin Dashboard' },
						{ href: '/admin/inventory', icon: listingIcon, id: 'listings', label: 'Inventory' },
						{
							href: '/admin/inventory/new',
							icon: addListingIcon,
							id: 'add',
							label: 'Add Listing'
						},
						{ href: '/admin/messages', icon: messagesIcon, id: 'messages', label: 'Messages' },
						{
							href: '/account/profile?role=admin',
							icon: profileIcon,
							id: 'profile',
							label: 'Profile'
						}
					]
				: [
						{ href: '/account', icon: dashboardIcon, id: 'dashboard', label: 'Табло на акаунта' },
						{
							href: '/account/listings',
							icon: listingIcon,
							id: 'listings',
							label: 'Моите обяви'
						},
						{
							href: '/account/favorites',
							icon: favoritesIcon,
							id: 'favorites',
							label: 'Любими'
						},
						{ href: '/account/compare', icon: reviewsIcon, id: 'compare', label: 'Сравнения' },
						{ href: '/account/messages', icon: messagesIcon, id: 'messages', label: 'Съобщения' },
						{ href: '/account/profile', icon: profileIcon, id: 'profile', label: 'Профил' }
					];

	return `<ul class="core-dropdown__list user-admin-links">
	${items.map(accountDropdownItem).join('\n')}
	${accountDropdownItem({ href: '/', icon: logoutIcon, id: 'logout', label: context.isAdmin ? 'Logout' : 'Изход' })}
</ul>`;
};

const replaceAccountDropdown = (html: string, context: AccountContext) =>
	html.replace(
		/<ul class="core-dropdown__list user-admin-links">[\s\S]*?<\/ul>/,
		accountDropdown(context)
	);

const markDashboardPrimaryAction = (html: string) =>
	html.replace(
		/(<div class="header-button mobile-hidden-header-button[^"]*"[\s\S]*?<a\b)(?![^>]*data-dashboard-primary-action)(?=[^>]*\bhref="(?:\/account\/listings\/new|\/admin\/inventory\/new|\/admin\/inquiries\?role=agent)")/,
		'$1 data-dashboard-primary-action'
	);

const applyRoleScopedAccountChrome = (html: string, context: AccountContext) => {
	if (!context.isAdmin) {
		return html
			.replaceAll('href="/admin/inventory/new"', 'href="/account/listings/new"')
			.replaceAll('Add Listing', 'Подай автомобил');
	}

	if (context.session.role !== 'agent') return html;

	return html
		.replaceAll('href="/admin/inventory/new"', 'href="/admin/inquiries?role=agent"')
		.replaceAll('Add Listing', 'Inquiries');
};

const applyAccountShell = (
	html: string,
	templateFile: string,
	options: AuxeroRenderOptions = {}
) => {
	const context = accountContext(templateFile, options);
	const listingHeading = context.isAdmin ? 'Promosale Varna Inventory' : 'Моите автомобили';

	let next = html
		.replaceAll('Promosale Varna Admin', escapeHtml(context.session.name))
		.replaceAll(
			'/assets/images/dashboard/dashbroard_avatar.webp',
			accountAvatarByRole[context.session.role]
		)
		.replaceAll('Dashboard', context.isAdmin ? 'Admin Dashboard' : 'Account Dashboard')
		.replaceAll('My Reviews', context.isAdmin ? 'Inquiries' : 'My Compare')
		.replaceAll('Recent Inquiries', context.isAdmin ? 'Recent Inquiries' : 'Recent Messages')
		.replaceAll('Lead Views', context.isAdmin ? 'Lead Views' : 'Saved Activity')
		.replaceAll('All Listing', listingHeading)
		.replaceAll('<p class="h4 mb-20">Inventory</p>', `<p class="h4 mb-20">${listingHeading}</p>`)
		.replaceAll(
			'<input type="text" name="searchListing"',
			'<input type="search" name="searchListing" aria-label="Търси заявки"'
		)
		.replace(
			/(<form action="#" class="search-form-listing">[\s\S]*?)<button>/,
			'$1<button type="submit" aria-label="Търси заявки">'
		)
		.replace('</head>', `<meta name="daynight-role" content="${context.session.role}">\n</head>`);

	if (!context.isAdmin) {
		next = next
			.replaceAll('Show Account Dashboard', 'Отвори менюто')
			.replace(
				/<button class="btn btn-primary btn-large font-weight-600 mb-24 dashboard-toggle-btn" id="dashboardToggleBtn" aria-label="Toggle Account Dashboard">\s*Отвори менюто\s*<\/button>/,
				`<input type="checkbox" class="dashboard-menu-toggle-input" id="dashboardToggleBtn" aria-label="Отвори менюто на профила">
<label class="dashboard-menu-backdrop" for="dashboardToggleBtn" aria-hidden="true"></label>
<label class="btn btn-primary btn-large font-weight-600 mb-24 dashboard-toggle-btn" for="dashboardToggleBtn" role="button" aria-controls="dashboardSidebar">
	<span class="sr-only">Отвори менюто</span>
</label>`
			)
			.replace(
				'<div class="dashboard-sidebar">',
				'<div class="dashboard-sidebar" id="dashboardSidebar">'
			)
			.replaceAll('My Compare', 'Сравнения');
	}

	return markDashboardPrimaryAction(
		applyRoleScopedAccountChrome(replaceAccountDropdown(next, context), context)
	).replace(/<ul class="dashboard-menu">[\s\S]*?<\/ul>/, dashboardMenu(context));
};

const statCards = (context: AccountContext) => {
	const stats = accountDashboardStatsData(context);

	return `<div class="grid grid-cols-4 xl-grid-cols-2 sm-grid-cols-1 gap-30 mb-30">
	${stats
		.map(
			(
				stat
			) => `<a href="${stat.href}" class="dashboard-cart" data-daynight-dashboard-stat="${escapeHtml(stat.id)}" data-daynight-stat-value="${escapeHtml(stat.value)}">
		<div>
			<p class="h7 font-weight-500 mb-4">${escapeHtml(stat.label)}</p>
			<p class="h3">${escapeHtml(stat.value)}</p>
		</div>
		<div class="icon">
			<img src="${stat.icon}" alt="${escapeHtml(stat.label)}">
		</div>
	</a>`
		)
		.join('\n')}
</div>`;
};

const rowAction = (row: AuxeroAccountListingRow, kind: AuxeroAccountListingAction['kind']) =>
	row.actions.find((action) => action.kind === kind);

const inventoryCartItem = (row: AuxeroAccountListingRow) => {
	const url = row.href ?? `/inventory/${encodeURIComponent(row.id)}`;
	const edit = rowAction(row, 'edit-inventory');
	const remove = rowAction(row, 'remove');

	return `<div class="cart-item" data-daynight-slug="${escapeHtml(row.id)}">
	<a href="${escapeHtml(url)}" class="cart-item__product">
		<div class="cart-item__image">
			<img src="${escapeHtml(row.image)}" alt="${escapeHtml(row.title)}">
		</div>
		<div class="cart-item__name">
			<p class="h4 clamp-1 clamp mb-8">${escapeHtml(row.title)}</p>
			<p class="clamp-1 clamp text-secondary mb-12">${escapeHtml(row.description)}</p>
			${row.priceLabel ? `<p class="h5">${escapeHtml(row.priceLabel)}</p>` : ''}
		</div>
	</a>
	<div class="cart-item__price"><span class="price">${escapeHtml(row.columns[0] ?? '')}</span></div>
	<div class="cart-item__year"><span>${escapeHtml(row.columns[1] ?? '')}</span></div>
	<div class="cart-item__total"><span>${escapeHtml(row.columns[2] ?? '')}</span></div>
	<div><span>${escapeHtml(row.columns[3] ?? '')}</span></div>
	<div class="cart-item__action">
		${
			edit
				? `<a href="${escapeHtml(edit.href ?? '#')}" class="hover-fill-white cart-item__edit action" aria-label="${escapeHtml(edit.ariaLabel)}">
			<img src="${escapeHtml(edit.icon)}" alt="edit">
			<p class="tooltip">${escapeHtml(edit.label)}</p>
		</a>`
				: ''
		}
		${
			remove
				? `<div class="hover-fill-white cart-item__remove action" role="button" tabindex="0" aria-label="${escapeHtml(remove.ariaLabel)}">
			<img src="${escapeHtml(remove.icon)}" alt="remove">
			<p class="tooltip">${escapeHtml(remove.label)}</p>
		</div>`
				: ''
		}
	</div>
</div>`;
};

const inventoryCartWrapper = (
	data: AuxeroAccountListingsData
) => `<div class="cart-wrapper daynight-account-listings" data-daynight-account-listings>
	<div class="cart-header">
		${data.headers.map((header) => `<div class="font-weight-600">${escapeHtml(header)}</div>`).join('\n')}
	</div>
	<div class="cart-items">
		${data.rows.map(inventoryCartItem).join('\n')}
	</div>
	<div class="divider w-full mb-20"></div>
	<div class="flex justify-between items-center flex-wrap gap-12 pagination-bottom" id="pagination-bottom">
		<ul class="pagination">
			${(data.pagination ?? ['1']).map((item, index) => `<li><a href="#" class="pagination__link ${index === 0 ? 'active' : ''}">${escapeHtml(item)}</a></li>`).join('\n')}
		</ul>
		<p class="text-secondary">${escapeHtml(data.footerText)}</p>
	</div>
</div>`;

const submissionCartItem = (row: AuxeroAccountListingRow) => {
	const edit = rowAction(row, 'edit-submission');
	const message = rowAction(row, 'message');

	return `<div class="cart-item" data-daynight-submission-id="${escapeHtml(row.id)}">
			<div class="cart-item__product">
				<div class="cart-item__image">
					<img src="${escapeHtml(row.image)}" alt="${escapeHtml(row.title)}">
				</div>
				<div class="cart-item__name">
					<p class="h4 clamp-1 clamp mb-8">${escapeHtml(row.title)}</p>
					<p class="clamp-1 clamp text-secondary mb-12">${escapeHtml(row.description)}</p>
					${row.titleMeta ? `<p class="h5">${escapeHtml(row.titleMeta)}</p>` : ''}
				</div>
			</div>
			<div class="cart-item__price"><span class="price">${escapeHtml(row.columns[0] ?? '')}</span></div>
			<div class="cart-item__year"><span>${escapeHtml(row.columns[1] ?? '')}</span></div>
			<div class="cart-item__total"><span>${escapeHtml(row.columns[2] ?? '')}</span></div>
			<div><span>${escapeHtml(row.columns[3] ?? '')}</span></div>
			<div class="cart-item__action">
				${
					edit
						? `<a href="${escapeHtml(edit.href ?? '#')}" class="hover-fill-white cart-item__edit action" aria-label="${escapeHtml(edit.ariaLabel)}">
					<img src="${escapeHtml(edit.icon)}" alt="edit">
					<p class="tooltip">${escapeHtml(edit.label)}</p>
				</a>`
						: ''
				}
				${
					message
						? `<a href="${escapeHtml(message.href ?? '#')}" class="hover-fill-white cart-item__edit action" aria-label="${escapeHtml(message.ariaLabel)}">
					<img src="${escapeHtml(message.icon)}" alt="message">
					<p class="tooltip">${escapeHtml(message.label)}</p>
				</a>`
						: ''
				}
			</div>
		</div>`;
};

const submissionCartWrapper = (
	data: AuxeroAccountListingsData
) => `<div class="cart-wrapper daynight-account-listings" data-daynight-account-listings data-daynight-submissions-table="true">
	<div class="cart-header">
		${data.headers.map((header) => `<div class="font-weight-600">${escapeHtml(header)}</div>`).join('\n')}
	</div>
	<div class="cart-items">
		${data.rows.map(submissionCartItem).join('\n')}
	</div>
	<div class="divider w-full mb-20"></div>
	<p class="text-secondary">${escapeHtml(data.footerText)}</p>
</div>`;

const cartWrapper = (data: AuxeroAccountListingsData) =>
	data.isSubmissions ? submissionCartWrapper(data) : inventoryCartWrapper(data);

const userManagementStats = (
	stats: AuxeroUserManagementStat[]
) => `<div class="grid grid-cols-4 xl-grid-cols-2 sm-grid-cols-1 gap-30 mb-30">
	${stats
		.map(
			(stat) => `<a href="${escapeHtml(stat.href)}" class="dashboard-cart">
		<div>
			<p class="h7 font-weight-500 mb-4">${escapeHtml(stat.label)}</p>
			<p class="h3">${escapeHtml(stat.value)}</p>
		</div>
		<div class="icon">
			<img src="${escapeHtml(stat.icon)}" alt="${escapeHtml(stat.label)}">
		</div>
	</a>`
		)
		.join('\n')}
</div>`;

const userManagementTable = (
	data: AuxeroUserManagementData
) => `<div class="cart-wrapper daynight-users-table" data-daynight-users-table>
	<div class="cart-header">
		${data.headers.map((header) => `<div class="font-weight-600">${escapeHtml(header)}</div>`).join('\n')}
	</div>
	<div class="cart-items">
		${data.rows
			.map(
				(
					user
				) => `<div class="cart-item" data-daynight-user-id="${escapeHtml(user.id)}" data-daynight-user-kind="${escapeHtml(user.kind)}" data-daynight-user-role="${escapeHtml(user.role.toLowerCase())}">
			<div class="cart-item__product">
				<div class="cart-item__image"><img src="${escapeHtml(user.image)}" alt="${escapeHtml(user.name)}"></div>
				<div class="cart-item__name">
					<p class="h4 clamp-1 clamp mb-8">${escapeHtml(user.name)}</p>
					<p class="clamp-1 clamp text-secondary mb-12">${escapeHtml(user.description)}</p>
				</div>
			</div>
			<div class="cart-item__price"><span class="price clamp-1 clamp" title="${escapeHtml(user.columns[0] ?? '')}">${escapeHtml(user.columns[0] ?? '')}</span></div>
			<div class="cart-item__year"><span class="clamp-1 clamp" title="${escapeHtml(user.columns[1] ?? '')}">${escapeHtml(user.columns[1] ?? '')}</span></div>
			<div class="cart-item__total"><span class="clamp-1 clamp" title="${escapeHtml(user.columns[2] ?? '')}">${escapeHtml(user.columns[2] ?? '')}</span></div>
			<div><span class="clamp-1 clamp" title="${escapeHtml(user.columns[3] ?? '')}">${escapeHtml(user.columns[3] ?? '')}</span></div>
			<div class="cart-item__action">
				${user.actions
					.map(
						(
							action
						) => `<a href="${escapeHtml(action.href)}" class="hover-fill-white cart-item__edit action" aria-label="${escapeHtml(action.ariaLabel)}">
					<img src="${escapeHtml(action.icon)}" alt="${escapeHtml(action.kind)}">
					<p class="tooltip">${escapeHtml(action.label)}</p>
				</a>`
					)
					.join('\n')}
			</div>
		</div>`
			)
			.join('\n')}
	</div>
	<div class="divider w-full mb-20"></div>
	<p class="text-secondary">${escapeHtml(data.footerText)}</p>
</div>`;

const userManagementNotes = (
	notes: AuxeroUserManagementNote[]
) => `<div class="dashboard-box bg-white daynight-users-box">
	<p class="h4 mb-20">Role Access Notes</p>
	<div class="comments">
		${notes
			.map(
				(note) => `<div class="comment-box">
			<p class="h5 mb-12">${escapeHtml(note.title)}</p>
			<p class="h7 line-height-28">${escapeHtml(note.text)}</p>
		</div>`
			)
			.join('\n')}
	</div>
</div>`;

const recentInquiriesBox = (context: AccountContext) => {
	const data = accountDashboardRecentData(context);

	return `<div class="dashboard-box bg-white daynight-inquiries-box" data-daynight-dashboard-recent>
	<div class="flex justify-between items-start gap-16 flex-wrap mb-20">
		<div>
			<p class="h4 mb-8">${escapeHtml(data.heading)}</p>
			<p class="h7 text-secondary">${escapeHtml(data.intro)}</p>
		</div>
		<a href="${escapeHtml(data.primaryAction.href)}" class="btn btn-small btn-primary-3 font-weight-600">${escapeHtml(data.primaryAction.label)}</a>
	</div>
	<div class="grid grid-cols-3 md-grid-cols-1 gap-1 mb-20" aria-label="Dashboard summary">
		${data.summary
			.map(
				(
					item
				) => `<div class="bg-white p-16" data-daynight-dashboard-summary="${escapeHtml(item.id)}">
			<p class="h4 mb-4">${escapeHtml(item.value)}</p>
			<p class="text-secondary text-sm mb-0">${escapeHtml(item.label)}</p>
		</div>`
			)
			.join('\n')}
	</div>
	<div class="grid grid-cols-4 xl-grid-cols-2 sm-grid-cols-1 gap-10 mb-24" aria-label="Quick dashboard actions">
		${data.actions
			.map(
				(
					action
				) => `<a href="${escapeHtml(action.href)}" class="car-box" data-daynight-dashboard-action="${escapeHtml(action.id)}">
			<div class="icon"><img src="${escapeHtml(action.icon)}" alt=""></div>
			<div>
				<p class="h7 font-weight-700 mb-4">${escapeHtml(action.label)}</p>
				<p class="text-secondary text-sm mb-0">${escapeHtml(action.meta)}</p>
			</div>
		</a>`
			)
			.join('\n')}
	</div>
	<div class="flex justify-between items-center gap-12 mb-16">
		<p class="h5 mb-0">Recent activity</p>
		<p class="text-secondary text-sm mb-0">${data.items.length} latest</p>
	</div>
	<div class="comments">
		${data.items
			.map(
				(item) => `<div class="comment-box">
			<div class="comment-box__header gap-12 mb-24">
				<div class="comment-box__avatar">
					<img src="${escapeHtml(item.avatar)}" alt="${escapeHtml(item.name)}">
				</div>
				<div>
					<div class="text-secondary gap-4 pt-4">
						<p class="h5 mb-4">${escapeHtml(item.name)}</p>
						<p class="text-secondary text-sm">${escapeHtml(item.dateLabel)}</p>
					</div>
				</div>
				<span class="text-highlight font-weight-700 text-sm">${escapeHtml(item.statusLabel)}</span>
			</div>
			<p class="h5 mb-12">${escapeHtml(item.title)}</p>
			<p class="text-secondary text-sm mb-10">${escapeHtml(item.metaLabel)}</p>
			<p class="h7 line-height-28 mb-16">${escapeHtml(item.body)}</p>
			<a href="${escapeHtml(item.href)}" class="view-details">${escapeHtml(item.actionLabel)} <img class="ml-4" src="/assets/icons/CaretCircleRight.svg" alt=""></a>
		</div>`
			)
			.join('\n')}
	</div>
</div>`;
};

const favoriteCard = (vehicle: Vehicle) => {
	const url = `/inventory/${encodeURIComponent(vehicle.slug)}`;
	const tagClass = 'bg-primary-2';

	return `<div class="card-box card-box-style-1" data-daynight-slug="${escapeHtml(vehicle.slug)}">
	<div class="top">
		<p class="${tagClass} text-white highlight">${escapeHtml(vehicle.tag ?? 'Available')}</p>
		<p class="heart daynight-favorite is-active" role="button" tabindex="0" aria-label="Remove ${escapeHtml(vehicle.title)}">
			<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M8 14C8 14 1.5 10.5 1.5 6.375C1.5 5.47989 1.85558 5 4.875 3C6.28688 3 7.49625 3.76937 8 5C8.50375 3.76937 9.71312 3 11.125 3C14.1444 5 14.5 5.47989 14.5 6.375C14.5 10.5 8 14 8 14Z" stroke="white" fill="#fee2e2"/></svg>
		</p>
	</div>
	<div class="image"><a href="${url}"><img class="card--img" src="${escapeHtml(vehicle.image)}" alt="${escapeHtml(vehicle.title)}"></a></div>
	<div class="content border-light border-top-none">
		<div class="bottom">
			<p class="category uppercase text-white"><a href="${url}" class="text-white uppercase text-xs">${escapeHtml(vehicle.brand)}</a></p>
			<div class="flex items-center gap-8">
				<p class="category uppercase text-white"><img src="/assets/icons/picture.svg" alt="photos"> ${vehicle.images.length || 1}</p>
				<p class="category uppercase text-white"><img src="/assets/icons/play.svg" alt="video"> 0</p>
			</div>
		</div>
		<p class="h6 card-box__title mb-8"><a href="${url}">${escapeHtml(vehicle.title)}</a></p>
		<ul class="tag mb-10">
			<li><img src="/assets/icons/icon-gauge.svg" alt="mileage"><span>${km(vehicle.mileage)}</span></li>
			<li><img src="/assets/icons/calendar.svg" alt="year"><span>${vehicle.year}</span></li>
			<li><img src="/assets/icons/gaspump.svg" alt="fuel"><span>${escapeHtml(vehicle.fuel)}</span></li>
			<li><img src="/assets/icons/auto.svg" alt="transmission"><span>${escapeHtml(vehicle.transmission)}</span></li>
		</ul>
		<p class="h6 card-box__price mb-15 flex justify-between gap-8 items-center">${escapeHtml(vehicle.priceLabel)}</p>
		<div class="divider mb-15"></div>
		<div class="flex justify-between">
			<p class="compare-details btn btn-small open-modal" data-modal-id="#CompareModal" data-daynight-compare="${escapeHtml(vehicle.slug)}" role="button" tabindex="0">Compare</p>
			<a href="${url}" class="view-details">View details <img class="ml-4" src="/assets/icons/CaretCircleRight.svg" alt="view details"></a>
		</div>
	</div>
</div>`;
};

const favoriteGrid = (context: AccountContext) => {
	const savedSlugs = getDayNightGarageState(context.session).favorites;
	const savedVehicles = savedSlugs
		.map((slug) => vehicles.find((vehicle) => vehicle.slug === slug))
		.filter((vehicle): vehicle is Vehicle => Boolean(vehicle));
	const content = savedVehicles.length
		? savedVehicles.map((vehicle) => favoriteCard(vehicle)).join('\n')
		: `<div class="dashboard-box bg-white" data-daynight-favorites-empty="true">
			<p class="h4 mb-8">No saved Promosale Varna vehicles yet</p>
			<p class="text-secondary">Use the heart action on inventory cards to build your saved list.</p>
		</div>`;

	return `<div class="grid grid-cols-3 lg-grid-cols-2 md-grid-cols-1 gap-x-23 gap-y-30 mb-30" data-daynight-favorites-grid data-daynight-favorites-count="${savedVehicles.length}">
	${content}
</div>`;
};

const messageOptions = (sent: boolean) => `<div class="message-item__options core-dropdown">
	<button type="button" class="core-dropdown__button${sent ? ' ml-auto' : ''}" aria-label="Още действия за съобщението">
		<img src="/assets/icons/more.svg" alt="" aria-hidden="true">
	</button>
	<ul class="core-dropdown__menu">
		<li><a href="#" class="text-primary">Reply</a></li>
		<li><a href="#" class="text-primary">Delete</a></li>
	</ul>
</div>`;

const messageContacts = (data: AuxeroMessageThreadData) => {
	return `<div class="message-contacts">
	${data.contacts
		.map(
			(
				conversation,
				index
			) => `<div class="message-contact ${conversation.active ? 'active user-online' : index === 2 ? 'user-offline' : ''}" data-contact="${escapeHtml(conversation.id)}">
		<div class="message-contact__avatar">
			<img src="${escapeHtml(conversation.avatar)}" alt="${escapeHtml(conversation.name)}">
		</div>
		<div class="message-contact__info">
			<div class="message-contact__name">${escapeHtml(conversation.name)}</div>
			<div class="message-contact__preview">${escapeHtml(conversation.preview)}</div>
		</div>
		<div class="message-contact__meta">
			<div class="message-contact__time">${escapeHtml(conversation.time)}</div>
			${conversation.badge ? `<div class="message-contact__badge">${conversation.badge}</div>` : ''}
		</div>
	</div>`
		)
		.join('\n')}
</div>`;
};

const messageHeader = (data: AuxeroMessageThreadData) => {
	const active = data.activeContact;

	return `<div class="message-chat__header">
	<div class="message-chat__user">
		<div class="message-chat__avatar user-online">
			<img src="${escapeHtml(active.avatar)}" alt="${escapeHtml(active.name)}">
		</div>
		<div class="message-chat__user-info">
			<div class="message-chat__name">${escapeHtml(active.name)}</div>
			<div class="message-chat__email">${escapeHtml(active.email)}</div>
		</div>
	</div>
	<div class="message-chat__actions">
		<div class="core-dropdown more style-2">
				<button type="button" class="core-dropdown__button ml-auto" aria-label="Още действия за разговора">
				<svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
					<path d="M10 10.8333C10.4602 10.8333 10.8333 10.4602 10.8333 10C10.8333 9.53976 10.4602 9.16667 10 9.16667C9.53976 9.16667 9.16667 9.53976 9.16667 10C9.16667 10.4602 9.53976 10.8333 10 10.8333Z" stroke="#1C1C1C" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
					<path d="M10 5.83333C10.4602 5.83333 10.8333 5.46024 10.8333 5C10.8333 4.53976 10.4602 4.16667 10 4.16667C9.53976 4.16667 9.16667 4.53976 9.16667 5C9.16667 5.46024 9.53976 5.83333 10 5.83333Z" stroke="#1C1C1C" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
					<path d="M10 15.8333C10.4602 15.8333 10.8333 15.4602 10.8333 15C10.8333 14.5398 10.4602 14.1667 10 14.1667C9.53976 14.1667 9.16667 14.5398 9.16667 15C9.16667 15.4602 9.53976 15.8333 10 15.8333Z" stroke="#1C1C1C" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
				</svg>
			</button>
			<div class="core-dropdown__menu">
				<ul class="core-dropdown__list more-links">
					<li><a href="${escapeHtml(data.contextHref)}">Open context</a></li>
					<li><a href="#">Delete</a></li>
				</ul>
			</div>
		</div>
	</div>
</div>`;
};

const messageBody = (data: AuxeroMessageThreadData) => {
	return `<div class="message-chat__body">
	${data.messages
		.map(
			(
				message,
				index
			) => `${index === data.messages.length - 1 ? '<div class="message-date-separator"><span>Today</span></div>' : ''}
	<div class="message-item ${message.sent ? 'message-item--sent' : 'message-item--received'}">
		<div class="message-item__bubble">
			${message.sent ? messageOptions(true) : ''}
			<div class="message-item__text">${escapeHtml(message.text)}</div>
			${message.sent ? '' : messageOptions(false)}
		</div>
		<div class="message-item__time">${escapeHtml(message.time)}</div>
	</div>`
		)
		.join('\n')}
</div>`;
};

const messageContainer = (context: AccountContext) => {
	const data = accountMessageThreadData(context);

	return `<div class="message-container" data-daynight-message-container>
	<div class="message-sidebar">
		<div class="message-search">
			<form action="#" class="search-form-contact">
				<input type="search" name="SearchUsers" id="SearchUsers" class="form-control" placeholder="Търси разговори" aria-label="Търси разговори">
				<button type="submit" aria-label="Търси разговори">
					<svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
						<path d="M17.9438 17.0575L14.0321 13.1466C15.1659 11.7854 15.7312 10.0395 15.6106 8.27214C15.4899 6.50475 14.6925 4.85192 13.3843 3.65748C12.076 2.46304 10.3576 1.81895 8.58657 1.8592C6.81553 1.89945 5.12818 2.62094 3.87554 3.87358C2.62289 5.12622 1.9014 6.81357 1.86115 8.58462C1.8209 10.3557 2.46499 12.074 3.65943 13.3823C4.85387 14.6906 6.5067 15.488 8.27409 15.6086C10.0415 15.7293 11.7874 15.1639 13.1485 14.0302L17.0595 17.9419C17.1175 17.9999 17.1865 18.046 17.2623 18.0774C17.3382 18.1089 17.4195 18.125 17.5016 18.125C17.5838 18.125 17.6651 18.1089 17.741 18.0774C17.8168 18.046 17.8858 17.9999 17.9438 17.9419C18.0019 17.8838 18.048 17.8149 18.0794 17.739C18.1108 17.6631 18.127 17.5818 18.127 17.4997C18.127 17.4176 18.1108 17.3363 18.0794 17.2604C18.048 17.1845 18.0019 17.1156 17.9438 17.0575ZM3.12664 8.74969C3.12664 7.63717 3.45654 6.54963 4.07463 5.62461C4.69271 4.69958 5.57121 3.97861 6.59905 3.55287C7.62688 3.12712 8.75788 3.01573 9.84903 3.23277C10.9402 3.44981 11.9424 3.98554 12.7291 4.77221C13.5158 5.55888 14.0515 6.56116 14.2686 7.65231C14.4856 8.74345 14.3742 9.87445 13.9485 10.9023C13.5227 11.9301 12.8018 12.8086 11.8767 13.4267C10.9517 14.0448 9.86416 14.3747 8.75164 14.3747C7.26031 14.373 5.83053 13.7799 4.77599 12.7253C3.72146 11.6708 3.1283 10.241 3.12664 8.74969Z" fill="#1C1C1C"/>
					</svg>
				</button>
			</form>
		</div>
		${messageContacts(data)}
	</div>
	<div class="message-chat">
		${messageHeader(data)}
		${messageBody(data)}
		<div class="message__action flex items-center">
			<div class="message-chat__input">
				<input type="text" placeholder="Напиши съобщение..." class="message-chat__input-field w-full" aria-label="Съобщение">
				<button type="button" class="message-chat__attach" aria-label="Прикачи файл">
					<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
						<path d="M19.6553 11.4697C19.725 11.5393 19.7803 11.622 19.8181 11.7131C19.8558 11.8041 19.8753 11.9017 19.8753 12.0003C19.8753 12.0989 19.8558 12.1964 19.8181 12.2875C19.7803 12.3785 19.725 12.4613 19.6553 12.5309L11.9631 20.2184C10.9784 21.203 9.64281 21.7561 8.25027 21.756C6.85772 21.756 5.52225 21.2027 4.53763 20.2179C3.55301 19.2332 2.99991 17.8977 3 16.5051C3.00009 15.1126 3.55336 13.7771 4.5381 12.7925L13.8437 3.34998C14.5468 2.6462 15.5006 2.25053 16.4953 2.25C17.4901 2.24947 18.4443 2.64414 19.1481 3.34717C19.8519 4.0502 20.2476 5.00401 20.2481 5.99877C20.2486 6.99353 19.8539 7.94776 19.1509 8.65154L9.84341 18.094C9.42072 18.5167 8.84743 18.7542 8.24966 18.7542C7.65189 18.7542 7.0786 18.5167 6.65591 18.094C6.23322 17.6714 5.99576 17.0981 5.99576 16.5003C5.99576 15.9025 6.23322 15.3292 6.65591 14.9065L14.4653 6.97342C14.5337 6.90044 14.616 6.84188 14.7074 6.8012C14.7988 6.76051 14.8974 6.73851 14.9974 6.7365C15.0974 6.73448 15.1968 6.7525 15.2897 6.78947C15.3827 6.82645 15.4673 6.88165 15.5386 6.95181C15.6098 7.02198 15.6664 7.10569 15.7048 7.19804C15.7433 7.29038 15.7629 7.38948 15.7625 7.4895C15.762 7.58953 15.7416 7.68846 15.7024 7.78048C15.6632 7.87249 15.6059 7.95573 15.534 8.02529L7.72372 15.9669C7.6538 16.0362 7.59822 16.1187 7.56016 16.2096C7.5221 16.3004 7.50231 16.3979 7.50192 16.4964C7.50153 16.5949 7.52054 16.6925 7.55787 16.7836C7.59521 16.8748 7.65013 16.9577 7.71951 17.0276C7.78888 17.0976 7.87135 17.1531 7.9622 17.1912C8.05306 17.2293 8.15052 17.249 8.24902 17.2494C8.34753 17.2498 8.44514 17.2308 8.53629 17.1935C8.62745 17.1562 8.71036 17.1012 8.78029 17.0319L18.0868 7.59404C18.5095 7.17222 18.7473 6.59977 18.748 6.00261C18.7486 5.40545 18.5119 4.83251 18.0901 4.40982C17.6683 3.98713 17.0959 3.74932 16.4987 3.74871C15.9015 3.74809 15.3286 3.98472 14.9059 4.40654L5.60216 13.8453C5.25363 14.1933 4.97704 14.6065 4.7882 15.0614C4.59936 15.5162 4.50197 16.0039 4.50158 16.4964C4.50119 16.9889 4.59781 17.4767 4.78592 17.9318C4.97403 18.387 5.24996 18.8007 5.59794 19.1492C5.94593 19.4977 6.35915 19.7743 6.81402 19.9632C7.2689 20.152 7.75651 20.2494 8.24902 20.2498C8.74154 20.2502 9.2293 20.1536 9.68448 19.9654C10.1396 19.7773 10.5533 19.5014 10.9018 19.1534L18.595 11.4659C18.7361 11.3259 18.9271 11.2476 19.1259 11.2483C19.3247 11.249 19.5151 11.3286 19.6553 11.4697Z" fill="#4B4B4B"/>
					</svg>
				</button>
			</div>
			<button type="button" class="message-chat__send" aria-label="Изпрати съобщението">
				<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
					<path d="M21.3112 2.689C21.1226 2.5005 20.8871 2.36569 20.629 2.29846C20.371 2.23122 20.0997 2.234 19.843 2.3065H19.829L1.83461 7.7665C1.54248 7.85069 1.28283 8.02166 1.09007 8.25676C0.897302 8.49185 0.780525 8.77997 0.75521 9.08294C0.729895 9.3859 0.797238 9.6894 0.948314 9.95323C1.09939 10.2171 1.32707 10.4287 1.60117 10.5602L9.56242 14.4377L13.4343 22.3943C13.5547 22.6513 13.7462 22.8685 13.9861 23.0201C14.226 23.1718 14.5042 23.2517 14.788 23.2502C14.8312 23.2502 14.8743 23.2484 14.9174 23.2446C15.2201 23.2201 15.5081 23.1036 15.7427 22.9107C15.9773 22.7178 16.1473 22.4578 16.2299 22.1656L21.6862 4.17119C21.6862 4.1665 21.6862 4.16181 21.6862 4.15712C21.7596 3.90115 21.7636 3.63024 21.6977 3.37223C21.6318 3.11421 21.4984 2.8784 21.3112 2.689ZM14.7965 21.7362L14.7918 21.7493V21.7427L11.0362 14.0271L15.5362 9.52712C15.6709 9.38533 15.7449 9.19651 15.7424 9.00094C15.7399 8.80537 15.6611 8.61852 15.5228 8.48022C15.3845 8.34191 15.1976 8.26311 15.002 8.26061C14.8065 8.2581 14.6177 8.3321 14.4759 8.46681L9.97586 12.9668L2.25742 9.21119H2.25086H2.26399L20.2499 3.75025L14.7965 21.7362Z" fill="white"/>
				</svg>
			</button>
		</div>
	</div>
</div>`;
};

const applyDashboardData = (
	html: string,
	templateFile: string,
	options: AuxeroRenderOptions = {}
) => {
	const context = accountContext(templateFile, options);
	let next = applyAccountShell(html, templateFile, options);

	next = replaceFirstDivAfter(
		next,
		context.isAdmin ? 'Admin Dashboard' : 'Account Dashboard',
		'<div class="grid grid-cols-4',
		statCards(context)
	);
	next = replaceFirstDivAfter(
		next,
		context.isAdmin ? 'Promosale Varna Inventory' : 'My Listings',
		'<div class="cart-wrapper">',
		cartWrapper(accountListingsData(context))
	);
	next = replaceDivContaining(
		next,
		context.isAdmin ? 'Recent Inquiries' : 'Recent Messages',
		'<div class="dashboard-box bg-white',
		recentInquiriesBox(context)
	);

	return replaceDashboardDemoText(next);
};

const applyUsersData = (html: string, templateFile: string, options: AuxeroRenderOptions = {}) => {
	const context = accountContext(templateFile, options);
	const data = accountUserManagementData(context);
	let next = applyAccountShell(html, templateFile, options)
		.replace('<p class="h3 mb-30">Admin Dashboard</p>', '<p class="h3 mb-30">User Management</p>')
		.replaceAll('All Listing', 'User Accounts');

	next = replaceFirstDivAfter(
		next,
		'User Management',
		'<div class="grid grid-cols-4',
		userManagementStats(accountUserManagementStatsData())
	);
	next = replaceFirstDivAfter(
		next,
		'User Management',
		'<div class="cart-wrapper">',
		userManagementTable(data)
	);
	next = replaceFirstDivAfter(
		next,
		'User Management',
		'<div class="dashboard-box bg-white">',
		userManagementNotes(accountUserManagementNotesData())
	);

	return replaceDashboardDemoText(next);
};

const applyFavoritesData = (
	html: string,
	templateFile: string,
	options: AuxeroRenderOptions = {}
) => {
	const context = accountContext(templateFile, options);
	let next = applyAccountShell(html, templateFile, options);
	next = replaceFirstDivAfter(
		next,
		'My Favorites',
		'<div class="grid grid-cols-3',
		favoriteGrid(context)
	);

	return replaceDashboardDemoText(next);
};

const applyMessagesData = (
	html: string,
	templateFile: string,
	options: AuxeroRenderOptions = {}
) => {
	const context = accountContext(templateFile, options);
	const data = accountMessageThreadData(context);
	const next = replaceFirstDivAfter(
		applyAccountShell(html, templateFile, options).replaceAll(
			'<p class="h3 mb-40">Message</p>',
			`<p class="h3 mb-40">${data.heading}</p>`
		),
		data.heading,
		'<div class="message-container">',
		messageContainer(context)
	);

	return replaceDashboardDemoText(next);
};

const applyProfileData = (
	html: string,
	templateFile: string,
	options: AuxeroRenderOptions = {}
) => {
	const context = accountContext(templateFile, options);
	const profile = accountProfileFormData(context);
	let next = applyAccountShell(html, templateFile, options)
		.replaceAll('My profile', context.isAdmin ? 'My profile' : 'Моят профил')
		.replaceAll('Become Dealer', context.isAdmin ? 'Account Role' : 'Тип профил')
		.replaceAll('Become A Dealer', profile.roleLabel)
		.replaceAll(
			'Your current account type is normal. If you want to become a dealer, please click on button Become a Dealer ',
			profile.roleNote
		)
		.replaceAll('Infomation', context.isAdmin ? 'Information' : 'Лични данни')
		.replaceAll('/assets/images/avatar/avatar-10.jpg', profile.avatarImage)
		.replaceAll('/assets/images/avatar/avatar-11.jpg', profile.posterImage)
		.replaceAll('value="John"', `value="${escapeHtml(profile.firstName)}"`)
		.replaceAll('value="Smith"', `value="${escapeHtml(profile.lastName)}"`)
		.replace(
			/<textarea placeholder="Your Message\*"[\s\S]*?<\/textarea>/,
			`<textarea placeholder="Profile notes" rows="4" tabindex="5" name="message" class="message textarea-primary text-secondary" id="message" required>${escapeHtml(profile.description)}</textarea>`
		)
		.replaceAll('placeholder="Sales Phone*"', 'placeholder="Marketplace Phone*"')
		.replaceAll(
			'value="http://www.facebook.com/avitex"',
			`value="${profile.socialLinks[0]?.value ?? ''}"`
		)
		.replace(
			'placeholder="6205 Peachtree Dunwoody Rd, Atlanta, GA 30328" value="" required',
			`placeholder="${escapeHtml(profile.address)}" value="${escapeHtml(profile.address)}" required`
		);

	if (!context.isAdmin) {
		next = next
			.replaceAll('Upload Avatar*', 'Профилна снимка')
			.replaceAll('Dealer Poster*', 'Банер на профила')
			.replaceAll('Upload File', 'Качи файл')
			.replaceAll('Choose File', 'Избери файл')
			.replaceAll('No file choose', 'Няма избран файл')
			.replaceAll(
				'PNG, JPG, SVG dimension (400 * 400) max file not more then size 4 mb.',
				'PNG, JPG или SVG до 4 MB.'
			)
			.replaceAll('Fist Name*', 'Име*')
			.replaceAll('Last Name*', 'Фамилия*')
			.replaceAll('Sales Phone*', 'Телефон за контакт*')
			.replaceAll('Phone*', 'Телефон*')
			.replaceAll('Email Address*', 'Имейл адрес*')
			.replaceAll('Company*', 'Компания*')
			.replaceAll('Gender*', 'Пол*')
			.replaceAll('Day of Birth*', 'Дата на раждане*')
			.replaceAll('Social Network', 'Социални мрежи')
			.replaceAll('Full Address*', 'Пълен адрес*')
			.replaceAll('Map Location*', 'Местоположение на картата*')
			.replaceAll('Map Локация*', 'Местоположение на картата*')
			.replaceAll('Save Locally', 'Запази промените')
			.replaceAll('>Select<', '>Избери<')
			.replaceAll('>Male<', '>Мъж<')
			.replaceAll('>Female<', '>Жена<');
	}

	next = setInputValueById(next, 'Phone', profile.phone);
	next = setInputValueById(next, 'SalesPhone', profile.marketplacePhone);
	next = setInputValueById(next, 'EmailAddress', profile.email);
	next = setInputValueById(next, 'Company', profile.company);
	next = setInputValueById(next, 'youtube', profile.socialLinks[5]?.value ?? '');
	next = addClassToFirstFormAfter(
		next,
		context.isAdmin ? 'My profile' : 'Моят профил',
		'daynight-profile-form',
		' method="POST" data-daynight-profile-form'
	);
	next = next.replace(
		'</form>',
		`<div class="flex justify-end mt-24">
	<button type="submit" class="btn btn-primary btn-large-3 font-weight-600">${context.isAdmin ? 'Save Locally' : 'Запази промените'}</button>
</div>
</form>`
	);

	return replaceDashboardDemoText(next);
};

const applyPasswordData = (
	html: string,
	templateFile: string,
	options: AuxeroRenderOptions = {}
) => {
	const context = accountContext(templateFile, options);
	const password = accountPasswordFormData(context);
	let next = applyAccountShell(html, templateFile, options)
		.replaceAll(`value="${daynightContact.emailLabel}|"`, `value="${password.email}"`)
		.replaceAll('value="themesflat@2026"', 'value=""')
		.replaceAll('placeholder="Password"', 'placeholder="Password"');

	next = addClassToFirstFormAfter(
		next,
		'Change Password',
		'daynight-password-form',
		' method="POST" data-daynight-password-form'
	);

	return replaceDashboardDemoText(next);
};

const applyListingsData = (
	html: string,
	templateFile: string,
	options: AuxeroRenderOptions = {}
) => {
	const context = accountContext(templateFile, options);
	let next = applyAccountShell(html, templateFile, options)
		.replaceAll('My Listings', context.isAdmin ? 'Inventory Management' : 'Моите автомобили')
		.replaceAll('Showing 1 to 9 of 16 entries', `Показани 1–5 от ${vehicles.length}`);

	next = replaceFirstDivAfter(
		next,
		'Search by keyword',
		'<div class="cart-wrapper">',
		cartWrapper(accountListingsData(context))
	);

	next = next
		.replaceAll('Search by keyword', 'Търсене по ключова дума')
		.replaceAll('Sort by', 'Подреди по')
		.replaceAll('Newest', 'Най-нови')
		.replaceAll('Oldest', 'Най-стари');

	return replaceDashboardDemoText(next);
};

const applyAddListingData = (
	html: string,
	templateFile: string,
	options: AuxeroRenderOptions = {}
) => {
	const context = accountContext(templateFile, options);
	const form = accountListingFormData(context, options);
	const title = listingFormFieldValue(form, 'title');
	const vin = listingFormFieldValue(form, 'EnterVIN');
	const mileage = listingFormFieldValue(form, 'mileage');
	const engine = listingFormFieldValue(form, 'Enterengine');
	const color = listingFormFieldValue(form, 'Color');
	const adminHeading = form.mode === 'create' ? 'Add Listing' : 'Edit Listing';
	const pageHeading = context.isAdmin ? adminHeading : 'Submit Your Vehicle';
	const primaryListingStatus = context.isAdmin ? 'published' : 'submitted';
	const hiddenFields = form.hiddenFields
		.map((field) => hiddenInput(field.name, field.value))
		.join('\n');
	let next = applyAccountShell(html, templateFile, options)
		.replaceAll('Add Listings', pageHeading)
		.replaceAll('Save & Preview', form.mode === 'edit' ? 'Save Draft Changes' : 'Save Draft')
		.replaceAll('List Now', context.isAdmin ? 'Publish Locally' : 'Submit Draft')
		.replace(
			'<a href="#" class="btn btn-line-1 px-24 btn-large font-weight-600">',
			'<a href="#" class="btn btn-line-1 px-24 btn-large font-weight-600 daynight-local-form-action" data-daynight-form-target=".daynight-add-listing-form" data-daynight-form-status="Listing draft saved locally for Promosale Varna review" data-daynight-submit-form="true" data-daynight-listing-status="draft">'
		)
		.replace(
			'<a href="#" class="btn btn-primary px-24 btn-large font-weight-600">',
			`<a href="#" class="btn btn-primary px-24 btn-large font-weight-600 daynight-local-form-action" data-daynight-form-target=".daynight-add-listing-form" data-daynight-form-status="Listing submitted locally for Promosale Varna" data-daynight-submit-form="true" data-daynight-listing-status="${primaryListingStatus}">`
		)
		.replaceAll('value="Audi A6 Avant E-Tron"', `value="${escapeHtml(title)}"`)
		.replaceAll('placeholder="Years"', 'placeholder="Year"')
		.replaceAll('placeholder="Condition"', 'placeholder="Condition or status"')
		.replaceAll('placeholder="Enter number"', `placeholder="${escapeHtml(form.priceLabel)}"`)
		.replaceAll('placeholder="Enter VIN"', `placeholder="${escapeHtml(vin)}"`)
		.replaceAll('placeholder="Enter mileage"', `placeholder="${escapeHtml(mileage)}"`)
		.replaceAll(
			'placeholder="Enter engine"',
			`placeholder="${escapeHtml(engine || 'Engine on request')}"`
		)
		.replaceAll('placeholder="Enter color"', `placeholder="${escapeHtml(color)}"`)
		.replaceAll('Price ($)*', 'Price (EUR)*')
		.replaceAll('placeholder="e.g.1000"', `placeholder="${escapeHtml(form.priceLabel)}"`)
		.replaceAll(
			'placeholder="6205 Peachtree Dunwoody Rd, Atlanta, GA 30328"',
			`placeholder="${escapeHtml(form.address)}"`
		)
		.replaceAll(
			'value="6205 Peachtree Dunwoody Rd, Atlanta, GA 30328"',
			`value="${escapeHtml(form.address)}"`
		)
		.replaceAll('placeholder="Your url"', `placeholder="${escapeHtml(form.sourceUrl)}"`)
		.replaceAll(
			'placeholder="Lorem ipsum dolor sit amet, "',
			'placeholder="Vehicle description and inspection notes"'
		);

	next = setInputValueById(next, 'title', title);
	next = setInputValueById(next, 'Enternumber', form.priceLabel);
	next = setInputValueById(next, 'EnterVIN', vin);
	next = setInputValueById(next, 'mileage', mileage);
	next = setInputValueById(next, 'Enterengine', engine || 'Engine on request');
	next = setInputValueById(next, 'Color', color);
	next = setInputValueById(next, 'PriceListing2', form.priceLabel);
	next = setInputValueById(next, 'PriceListing', form.address);
	next = setInputValueById(next, 'Yoururl', form.sourceUrl);
	next = next
		.replace(
			'<input type="file" id="carPreviewInput" accept="image/jpeg, image/png, image/jpg">',
			'<input type="file" id="carPreviewInput" name="previewImage" accept="image/jpeg,image/png,image/jpg,image/webp">'
		)
		.replace(
			'<input type="file" id="carGalleryInput" accept="image/jpeg, image/png, image/jpg" multiple>',
			'<input type="file" id="carGalleryInput" name="galleryImages" accept="image/jpeg,image/png,image/jpg,image/webp" multiple>'
		)
		.replace(
			'<input type="file" id="attachmentsInput" accept=".pdf,.doc,.docx" multiple>',
			'<input type="file" id="attachmentsInput" name="documents" accept=".pdf,.doc,.docx,application/pdf" multiple>'
		);

	next = addClassToFirstFormAfter(
		next,
		pageHeading,
		'daynight-add-listing-form',
		` data-daynight-admin-listing-mode="${form.mode}" data-daynight-add-listing-form`
	);

	next = next.replace(
		`<form action="#" class="daynight-add-listing-form" novalidate data-daynight-admin-listing-mode="${form.mode}" data-daynight-add-listing-form>`,
		`<form action="" method="POST" enctype="multipart/form-data" class="daynight-add-listing-form" novalidate data-daynight-admin-listing-mode="${form.mode}" data-daynight-native-submit="true" data-daynight-add-listing-form>\n${hiddenFields}`
	);

	return replaceDashboardDemoText(next);
};

const replaceDashboardDemoText = (html: string) =>
	demoVehicleTitles
		.reduce(
			(next, title, index) => next.replaceAll(title, vehicles[index % vehicles.length].title),
			html
		)
		.replaceAll('Benzin + Plin', 'Petrol')
		.replaceAll('Tampa, FL', daynightContact.addressLabel)
		.replaceAll('$44.900,00', vehicles[0]?.priceLabel ?? 'On request')
		.replaceAll('$42.800,00', vehicles[1]?.priceLabel ?? 'On request')
		.replaceAll('$45.500,00', vehicles[2]?.priceLabel ?? 'On request')
		.replaceAll('Randynox', 'Promosale Varna Lead')
		.replaceAll('Mista Nyroom', 'Promosale Varna Customer')
		.replaceAll('Marvin McKinney', 'Promosale Varna Sales')
		.replaceAll('John Smith', 'Promosale Varna Customer')
		.replaceAll('Brooklyn Simmons', 'Promosale Varna Inspection')
		.replaceAll('Arlene McCoy', 'Promosale Varna Import')
		.replaceAll('Darrell Steward', 'Promosale Varna Admin')
		.replaceAll('Theresa Webb', 'Promosale Varna Support')
		.replaceAll('grew-sra@gmail.com', daynightContact.emailLabel)
		.replaceAll('Hey! there I&#39;m available', 'Promosale Varna follow-up is ready')
		.replaceAll("Hey! there I'm available", 'Promosale Varna follow-up is ready');

export const applyAccountTemplateData = (
	html: string,
	templateFile: string,
	options: AuxeroRenderOptions = {}
) => {
	if (templateFile === 'dashboard.html') {
		const context = accountContext(templateFile, options);

		return context.active === 'users'
			? applyUsersData(html, templateFile, options)
			: applyDashboardData(html, templateFile, options);
	}
	if (templateFile === 'my-favorites.html') return applyFavoritesData(html, templateFile, options);
	if (templateFile === 'message.html') return applyMessagesData(html, templateFile, options);
	if (templateFile === 'my-profile.html') return applyProfileData(html, templateFile, options);
	if (templateFile === 'change-password.html')
		return applyPasswordData(html, templateFile, options);
	if (templateFile === 'my-listings.html') return applyListingsData(html, templateFile, options);
	if (templateFile === 'add-listings-2.html')
		return applyAddListingData(html, templateFile, options);

	return html;
};

export const isAccountTemplate = (templateFile: string) =>
	[
		'dashboard.html',
		'my-favorites.html',
		'message.html',
		'my-profile.html',
		'change-password.html',
		'my-listings.html',
		'add-listings-2.html'
	].includes(templateFile);

export const getAuxeroAccountRuntimeData = (options: AuxeroRenderOptions = {}) => {
	const session = resolveDayNightSession(options.routePath ?? '', options.searchParams);

	return {
		activeRole: session.role,
		session,
		sessions: Object.values({
			admin: resolveDayNightSession('admin'),
			agent: resolveDayNightSession('agent'),
			customer: resolveDayNightSession('account')
		})
	};
};
