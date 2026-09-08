import { eliqautoContact } from '$lib/data/eliqauto';
import {
	createEliqautoMessageRecord,
	listEliqautoMessages,
	updateEliqautoMessageRecord,
	type EliqautoMessageStatus
} from './db';
import type { EliqautoRole } from './roles';

export type EliqautoMessageInput = {
	email?: string;
	message?: string;
	name?: string;
	routePath?: string;
	status?: EliqautoMessageStatus;
	threadId?: string;
	vehicleSlug?: string;
};

export type EliqautoMessageUpdateInput = {
	id: string;
	message?: string;
	status?: EliqautoMessageStatus;
};

export const normalizeMessageStatus = (value: string | undefined) => {
	if (value === 'open' || value === 'read' || value === 'closed') return value;

	return undefined;
};

export const createMessage = (input: EliqautoMessageInput) =>
	createEliqautoMessageRecord({
		authorEmail: input.email ?? eliqautoContact.emailLabel,
		authorName: input.name,
		message: input.message,
		routePath: input.routePath,
		status: input.status,
		threadId: input.threadId,
		vehicleSlug: input.vehicleSlug
	});

export const updateMessage = (input: EliqautoMessageUpdateInput) =>
	updateEliqautoMessageRecord(input.id, {
		message: input.message,
		status: input.status
	});

export const listMessagesForRole = (role: EliqautoRole = 'customer') => {
	void role;

	return listEliqautoMessages();
};
