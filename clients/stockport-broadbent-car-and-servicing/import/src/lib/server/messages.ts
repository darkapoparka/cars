import { daynightContact } from '$lib/data/daynight';
import {
	createDayNightMessageRecord,
	listDayNightMessages,
	updateDayNightMessageRecord,
	type DayNightMessageStatus
} from './db';
import type { DayNightRole } from './roles';

export type DayNightMessageInput = {
	email?: string;
	message?: string;
	name?: string;
	routePath?: string;
	status?: DayNightMessageStatus;
	threadId?: string;
	vehicleSlug?: string;
};

export type DayNightMessageUpdateInput = {
	id: string;
	message?: string;
	status?: DayNightMessageStatus;
};

export const normalizeMessageStatus = (value: string | undefined) => {
	if (value === 'open' || value === 'read' || value === 'closed') return value;

	return undefined;
};

export const createMessage = (input: DayNightMessageInput) =>
	createDayNightMessageRecord({
		authorEmail: input.email ?? daynightContact.emailLabel,
		authorName: input.name,
		message: input.message,
		routePath: input.routePath,
		status: input.status,
		threadId: input.threadId,
		vehicleSlug: input.vehicleSlug
	});

export const updateMessage = (input: DayNightMessageUpdateInput) =>
	updateDayNightMessageRecord(input.id, {
		message: input.message,
		status: input.status
	});

export const listMessagesForRole = (role: DayNightRole = 'customer') => {
	void role;

	return listDayNightMessages();
};
