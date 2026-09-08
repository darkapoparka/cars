import {
	listEliqautoInquiries,
	listEliqautoUsers,
	updateEliqautoUserRecord,
	type EliqautoUser,
	type EliqautoUserStatus
} from './db';
import { eliqautoRoleLabel, type EliqautoRole } from './roles';

export type ManagedUserKind = 'account' | 'lead';

export type ManagedUser = {
	avatarRole: EliqautoRole;
	context: string;
	email: string;
	id: string;
	kind: ManagedUserKind;
	name: string;
	phone: string;
	role: EliqautoRole | 'lead';
	roleLabel: string;
	status: EliqautoUserStatus;
	statusLabel: string;
};

const roleContext = (user: EliqautoUser) => {
	if (user.role === 'admin') return 'Inventory, users, agents';
	if (user.role === 'agent') return 'Inquiries and messages';

	return 'Favorites, compare, messages';
};

const statusLabel = (status: EliqautoUserStatus) => {
	if (status === 'paused') return 'Paused';
	if (status === 'lead') return 'Open lead';

	return 'Active';
};

const managedUserFromAccount = (user: EliqautoUser): ManagedUser => ({
	avatarRole: user.role,
	context: roleContext(user),
	email: user.email,
	id: user.id,
	kind: 'account',
	name: user.name,
	phone: user.phone,
	role: user.role,
	roleLabel: eliqautoRoleLabel(user.role),
	status: user.status,
	statusLabel: statusLabel(user.status)
});

export const normalizeManagedUserStatus = (value: string | undefined) => {
	if (value === 'active' || value === 'paused' || value === 'lead') return value;

	return undefined;
};

const visibleManagedLeadInquiries = () => {
	const records = listEliqautoInquiries();
	const seedLead = records.find((record) => record.id === 'inquiry-seed-1');

	if (!seedLead) return records.slice(0, 3);

	return [...records.filter((record) => record.id !== seedLead.id).slice(0, 2), seedLead];
};

export const listManagedUsers = () => [
	...listEliqautoUsers().map(managedUserFromAccount),
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
	status?: EliqautoUserStatus;
}) => {
	const user = updateEliqautoUserRecord({ email, id, name, phone, status });

	return user ? managedUserFromAccount(user) : undefined;
};
