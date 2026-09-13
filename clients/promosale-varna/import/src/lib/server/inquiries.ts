import { daynightContact } from '$lib/data/daynight';
import {
	buildDayNightInquiryRecord,
	createDayNightInquiryRecord,
	listDayNightInquiries,
	updateDayNightInquiryRecord,
	type DayNightInquiryStatus
} from './db';
import { normalizeDayNightRole, type DayNightRole } from './roles';
import { hasInquiryDatabase } from './inquiry-config';
import {
	insertStoredInquiry,
	patchStoredInquiry,
	readStoredInquiries
} from './inquiry-persistence';

export type DayNightInquiryInput = {
	agentSlug?: string;
	email?: string;
	message?: string;
	name?: string;
	phone?: string;
	routePath?: string;
	source?: string;
	userRole?: DayNightRole | string;
	vehicleSlug?: string;
};

export type DayNightInquiryUpdateInput = {
	assignedAgentSlug?: string;
	id: string;
	message?: string;
	status?: DayNightInquiryStatus;
};

export const normalizeInquiryStatus = (value: string | undefined) => {
	if (value === 'new' || value === 'assigned' || value === 'contacted' || value === 'closed') {
		return value;
	}

	return undefined;
};

export const createInquiry = async (input: DayNightInquiryInput) => {
	const values = {
		assignedAgentSlug: input.agentSlug,
		contactEmail: input.email ?? daynightContact.emailLabel,
		contactName: input.name,
		contactPhone: input.phone,
		message: input.message,
		routePath: input.routePath,
		source: input.source,
		userRole: normalizeDayNightRole(input.userRole) ?? 'customer',
		vehicleSlug: input.vehicleSlug
	};
	return hasInquiryDatabase()
		? insertStoredInquiry({
				...buildDayNightInquiryRecord(values),
				contactEmail: input.email?.trim() ?? '',
				contactPhone: input.phone?.trim() ?? ''
			})
		: createDayNightInquiryRecord(values);
};

export const updateInquiry = async (input: DayNightInquiryUpdateInput) => {
	const patch = {
		assignedAgentSlug: input.assignedAgentSlug,
		message: input.message,
		status: input.status
	};
	if (!hasInquiryDatabase()) return updateDayNightInquiryRecord(input.id, patch);
	if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(input.id))
		return undefined;
	return patchStoredInquiry(input.id, patch);
};

// Legacy account previews deliberately use synthetic records, never private database contacts.
export const listStoredInquiriesForAdmin = async () =>
	hasInquiryDatabase() ? readStoredInquiries() : listInquiriesForRole('admin');

export const listInquiriesForRole = (role: DayNightRole = 'admin') => {
	const records = listDayNightInquiries();

	if (role === 'admin') return records;
	if (role === 'agent') return records.filter((record) => record.status !== 'closed');

	return records.filter((record) => record.userRole === 'customer');
};
