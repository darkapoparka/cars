import { error, fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import {
	AdminConversationNotFoundError,
	AdminStaffProfileNotFoundError,
	createStaffConversationReply,
	getAdminConversationThread,
	markAdminConversationRead,
	updateAdminConversationStatus
} from '$lib/server/repositories/conversations';
import { requireAdminDealer } from '$lib/server/repositories/admin';

function readReply(formData: FormData) {
	const body = formData.get('body');
	return typeof body === 'string' ? body.trim() : '';
}

function readNotice(url: URL) {
	if (url.searchParams.get('sent') === 'reply') return 'Reply sent.';
	if (url.searchParams.get('updated') === 'closed') return 'Conversation closed.';
	if (url.searchParams.get('updated') === 'open') return 'Conversation reopened.';
	if (url.searchParams.get('updated') === 'read') return 'Conversation marked read.';
	return '';
}

function notFoundFailure(errorValue: unknown) {
	if (
		errorValue instanceof AdminConversationNotFoundError ||
		errorValue instanceof AdminStaffProfileNotFoundError
	) {
		return fail(404, { error: 'Conversation was not found.' });
	}

	throw errorValue;
}

export const load: PageServerLoad = async ({ locals, params, parent, url }) => {
	const layout = await parent();

	if (!locals.db || !layout.dealer?.id) {
		throw error(404, 'Conversation was not found.');
	}

	const thread = await getAdminConversationThread(locals.db, layout.dealer.id, params.id);
	if (!thread) throw error(404, 'Conversation was not found.');

	return {
		thread,
		notice: readNotice(url)
	};
};

export const actions: Actions = {
	reply: async ({ locals, params, request }) => {
		const formData = await request.formData();
		const body = readReply(formData);

		if (!body) {
			return fail(400, { error: 'Write a reply before sending.' });
		}

		const { db, dealerId, capabilities, profile } = await requireAdminDealer(locals);
		if (!capabilities.sales) {
			return fail(403, { error: 'This account cannot manage conversations.' });
		}

		try {
			await createStaffConversationReply(db, dealerId, params.id, profile.id, body);
		} catch (errorValue) {
			return notFoundFailure(errorValue);
		}

		throw redirect(303, `/admin/conversations/${params.id}?sent=reply`);
	},
	close: async ({ locals, params }) => {
		const { db, dealerId, capabilities } = await requireAdminDealer(locals);
		if (!capabilities.sales) {
			return fail(403, { error: 'This account cannot manage conversations.' });
		}

		try {
			await updateAdminConversationStatus(db, dealerId, params.id, 'closed');
		} catch (errorValue) {
			return notFoundFailure(errorValue);
		}

		throw redirect(303, `/admin/conversations/${params.id}?updated=closed`);
	},
	reopen: async ({ locals, params }) => {
		const { db, dealerId, capabilities } = await requireAdminDealer(locals);
		if (!capabilities.sales) {
			return fail(403, { error: 'This account cannot manage conversations.' });
		}

		try {
			await updateAdminConversationStatus(db, dealerId, params.id, 'open');
		} catch (errorValue) {
			return notFoundFailure(errorValue);
		}

		throw redirect(303, `/admin/conversations/${params.id}?updated=open`);
	},
	markRead: async ({ locals, params }) => {
		const { db, dealerId, capabilities, profile } = await requireAdminDealer(locals);
		if (!capabilities.sales) {
			return fail(403, { error: 'This account cannot manage conversations.' });
		}

		try {
			await markAdminConversationRead(db, dealerId, params.id, profile.id);
		} catch (errorValue) {
			return notFoundFailure(errorValue);
		}

		throw redirect(303, `/admin/conversations/${params.id}?updated=read`);
	}
};
