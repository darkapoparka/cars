import { fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import {
	AdminConversationNotFoundError,
	listAdminConversations,
	updateAdminConversationStatus,
	type ConversationStatusFilter
} from '$lib/server/repositories/conversations';
import { requireAdminDealer } from '$lib/server/repositories/admin';
import type { ConversationStatus } from '$lib/types/database';

const conversationStatuses: ConversationStatus[] = ['open', 'waiting', 'closed', 'archived'];
const statusFilters: ConversationStatusFilter[] = ['all', ...conversationStatuses];

function readFilters(url: URL) {
	const rawStatus = url.searchParams.get('status');
	const status = statusFilters.includes(rawStatus as ConversationStatusFilter)
		? (rawStatus as ConversationStatusFilter)
		: 'all';

	return {
		status,
		query: url.searchParams.get('q')?.trim() ?? ''
	};
}

function readConversationId(formData: FormData) {
	const id = formData.get('id');
	return typeof id === 'string' && id ? id : null;
}

function readNotice(url: URL) {
	if (url.searchParams.get('updated') === 'closed') return 'Conversation closed.';
	if (url.searchParams.get('updated') === 'open') return 'Conversation reopened.';
	return '';
}

function notFoundFailure(errorValue: unknown) {
	if (errorValue instanceof AdminConversationNotFoundError) {
		return fail(404, { error: 'Conversation was not found.' });
	}

	throw errorValue;
}

export const load: PageServerLoad = async ({ locals, parent, url }) => {
	const layout = await parent();
	const filters = readFilters(url);

	if (!locals.db || !layout.dealer?.id) {
		return {
			conversations: [],
			filters,
			notice: readNotice(url)
		};
	}

	return {
		conversations: await listAdminConversations(locals.db, layout.dealer.id, filters),
		filters,
		notice: readNotice(url)
	};
};

export const actions: Actions = {
	close: async ({ locals, request }) => {
		const formData = await request.formData();
		const id = readConversationId(formData);

		if (!id) {
			return fail(400, { error: 'Choose a valid conversation.' });
		}

		const { db, dealerId, capabilities } = await requireAdminDealer(locals);
		if (!capabilities.sales) {
			return fail(403, { error: 'This account cannot manage conversations.' });
		}

		try {
			await updateAdminConversationStatus(db, dealerId, id, 'closed');
		} catch (errorValue) {
			return notFoundFailure(errorValue);
		}

		throw redirect(303, '/variant-3/admin/conversations?updated=closed');
	},
	reopen: async ({ locals, request }) => {
		const formData = await request.formData();
		const id = readConversationId(formData);

		if (!id) {
			return fail(400, { error: 'Choose a valid conversation.' });
		}

		const { db, dealerId, capabilities } = await requireAdminDealer(locals);
		if (!capabilities.sales) {
			return fail(403, { error: 'This account cannot manage conversations.' });
		}

		try {
			await updateAdminConversationStatus(db, dealerId, id, 'open');
		} catch (errorValue) {
			return notFoundFailure(errorValue);
		}

		throw redirect(303, '/variant-3/admin/conversations?updated=open');
	}
};
