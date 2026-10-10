import {
	listDayNightInquiries,
	listDayNightUsers,
	updateDayNightUserRecord,
	type DayNightUser,
	type DayNightUserStatus
} from './db';
import { daynightRoleLabel, type DayNightRole } from './roles';

export type ManagedUserKind = 'account' | 'lead';

export type ManagedUser = {
	avatarRole: DayNightRole;
	context: string;
	email: string;
	id: string;
	kind: ManagedUserKind;
	name: string;
	phone: string;
	role: DayNightRole | 'lead';
	roleLabel: string;
	status: DayNightUserStatus;
	statusLabel: string;
};

const roleContext = (user: DayNightUser) => {
	if (user.role === 'admin') return 'Inventory, users, agents';
	if (user.role === 'agent') return 'Inquiries and messages';

	return 'Favorites, compare, messages';
};

const statusLabel = (status: DayNightUserStatus) => {
	if (status === 'paused') return 'Paused';
	if (status === 'lead') return 'Open lead';

	return 'Active';
};

const managedUserFromAccount = (user: DayNightUser): ManagedUser => ({
	avatarRole: user.role,
	context: roleContext(user),
	email: user.email,
	id: user.id,
	kind: 'account',
	name: user.name,
	phone: user.phone,
	role: user.role,
	roleLabel: daynightRoleLabel(user.role),
	status: user.status,
	statusLabel: statusLabel(user.status)
});

export const normalizeManagedUserStatus = (value: string | undefined) => {
	if (value === 'active' || value === 'paused' || value === 'lead') return value;

	return undefined;
};

const visibleManagedLeadInquiries = () => {
	const records = listDayNightInquiries();
	const seedLead = records.find((record) => record.id === 'inquiry-seed-1');

	if (!seedLead) return records.slice(0, 3);

	return [...records.filter((record) => record.id !== seedLead.id).slice(0, 2), seedLead];
};

export const listManagedUsers = () => [
	...listDayNightUsers().map(managedUserFromAccount),
	...visibleManagedLeadInquiries().map(
		(inquiry): ManagedUser => ({
			avatarRole: 'customer',
			context: inquiry.vehicleTitle ?? inquiry.message,
			email: inquiry.contactEmail,
			id: inquiry.id,
			kind: 'lead',
			name: inquiry.contactName,
			phone: inquiry.contactPhone,
			role: 'lead',
			roleLabel: 'Lead',
			status: 'lead',
			statusLabel: statusLabel('lead')
		})
	)
];

export const updateManagedUser = ({
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
	const user = updateDayNightUserRecord({ email, id, name, phone, status });

	return user ? managedUserFromAccount(user) : undefined;
};
