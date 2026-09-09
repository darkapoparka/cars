import { daynightContact } from '$lib/data/daynight';
import {
	createDayNightInquiryRecord,
	listDayNightInquiries,
	updateDayNightInquiryRecord,
	type DayNightInquiryStatus
} from './db';
import { normalizeDayNightRole, type DayNightRole } from './roles';

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

export const createInquiry = (input: DayNightInquiryInput) =>
	createDayNightInquiryRecord({
		assignedAgentSlug: input.agentSlug,
		contactEmail: input.email ?? daynightContact.emailLabel,
		contactName: input.name,
		contactPhone: input.phone,
		message: input.message,
		routePath: input.routePath,
		source: input.source,
		userRole: normalizeDayNightRole(input.userRole) ?? 'customer',
		vehicleSlug: input.vehicleSlug
	});

export const updateInquiry = (input: DayNightInquiryUpdateInput) =>
	updateDayNightInquiryRecord(input.id, {
		assignedAgentSlug: input.assignedAgentSlug,
		message: input.message,
		status: input.status
	});

export const listInquiriesForRole = (role: DayNightRole = 'admin') => {
	const records = listDayNightInquiries();

	if (role === 'admin') return records;
	if (role === 'agent') return records.filter((record) => record.status !== 'closed');

	return records.filter((record) => record.userRole === 'customer');
};
