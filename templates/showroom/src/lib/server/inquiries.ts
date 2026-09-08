import {
	createEliqautoInquiryRecord,
	listEliqautoInquiries,
	updateEliqautoInquiryRecord,
	type EliqautoInquiryStatus
} from './db';
import { normalizeEliqautoRole, type EliqautoRole } from './roles';

export type EliqautoInquiryInput = {
	agentSlug?: string;
	email?: string;
	message?: string;
	name?: string;
	phone?: string;
	routePath?: string;
	source?: string;
	userRole?: EliqautoRole | string;
	vehicleSlug?: string;
};

export type EliqautoInquiryUpdateInput = {
	assignedAgentSlug?: string;
	id: string;
	message?: string;
	status?: EliqautoInquiryStatus;
};

export const normalizeInquiryStatus = (value: string | undefined) => {
	if (value === 'new' || value === 'assigned' || value === 'contacted' || value === 'closed') {
		return value;
	}

	return undefined;
};

export const createInquiry = (input: EliqautoInquiryInput) =>
	createEliqautoInquiryRecord({
		assignedAgentSlug: input.agentSlug,
		contactEmail: input.email,
		contactName: input.name,
		contactPhone: input.phone,
		message: input.message,
		routePath: input.routePath,
		source: input.source,
		userRole: normalizeEliqautoRole(input.userRole) ?? 'customer',
		vehicleSlug: input.vehicleSlug
	});

export const updateInquiry = (input: EliqautoInquiryUpdateInput) =>
	updateEliqautoInquiryRecord(input.id, {
		assignedAgentSlug: input.assignedAgentSlug,
		message: input.message,
		status: input.status
	});

export const listInquiriesForRole = (role: EliqautoRole = 'admin') => {
	const records = listEliqautoInquiries();

	if (role === 'admin') return records;
	if (role === 'agent') return records.filter((record) => record.status !== 'closed');

	return records.filter((record) => record.userRole === 'customer');
};
