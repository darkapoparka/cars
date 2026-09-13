import { fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { getAdminCmsOverview } from '$lib/server/admin-cms';
import { requireDayNightPageSession } from '$lib/server/auth';
import { createMessage, normalizeMessageStatus, updateMessage } from '$lib/server/messages';

const value = (formData: FormData, key: string) => String(formData.get(key) ?? '').trim();
const staffEmail = 'admin@daynight.local';
const staffName = 'Day Night Auto Staff';

type CmsMessage = Awaited<ReturnType<typeof getAdminCmsOverview>>['messages'][number];

const isStaffMessage = (message: CmsMessage) =>
	message.authorEmail.toLowerCase() === staffEmail || /staff|admin|agent/i.test(message.authorName);

const initials = (name: string) =>
	name
		.split(/\s+/)
		.filter(Boolean)
		.slice(0, 2)
		.map((part) => part[0]?.toUpperCase())
		.join('') || 'BC';

const buildThreads = (messages: CmsMessage[]) => {
	const threads = new Map<
		string,
		{
			id: string;
			lastMessageAt: string;
			messages: Array<
				CmsMessage & {
					direction: 'inbound' | 'outbound';
					initials: string;
				}
			>;
			participantEmail: string;
			participantInitials: string;
			participantName: string;
			routePath: string;
			status: CmsMessage['status'];
			subtitle: string;
			title: string;
			vehicleSlug?: string;
		}
	>();

	for (const message of [...messages].sort(
		(left, right) => Date.parse(left.createdAt) - Date.parse(right.createdAt)
	)) {
		const existing = threads.get(message.threadId);
		const thread = existing ?? {
			id: message.threadId,
			lastMessageAt: message.createdAt,
			messages: [],
			participantEmail: message.authorEmail,
			participantInitials: initials(message.authorName),
			participantName: message.authorName,
			routePath: message.routePath,
			status: message.status,
			subtitle: message.vehicleSlug ?? message.routePath,
			title: message.threadId.replace(/[-_]/g, ' '),
			vehicleSlug: message.vehicleSlug
		};
		const direction = isStaffMessage(message) ? 'outbound' : 'inbound';

		if (direction === 'inbound') {
			thread.participantEmail = message.authorEmail;
			thread.participantInitials = initials(message.authorName);
			thread.participantName = message.authorName;
		}

		thread.lastMessageAt = message.createdAt;
		thread.routePath = message.routePath;
		thread.status = message.status;
		thread.subtitle = message.vehicleSlug ?? message.routePath;
		thread.vehicleSlug = message.vehicleSlug;
		thread.messages.push({
			...message,
			direction,
			initials: initials(message.authorName)
		});
		threads.set(message.threadId, thread);
	}

	return Array.from(threads.values()).sort(
		(left, right) => Date.parse(right.lastMessageAt) - Date.parse(left.lastMessageAt)
	);
};

export const load: PageServerLoad = async ({ request, url }) => {
	const session = requireDayNightPageSession(request, 'admin/messages', url.searchParams);
	const cms = await getAdminCmsOverview();
	const threads = buildThreads(cms.messages);
	const requestedThread = url.searchParams.get('thread');
	const activeThread =
		threads.find((thread) => thread.id === requestedThread) ?? threads[0] ?? null;

	return {
		auxeroFullPage: true,
		activeThread,
		cms,
		threads,
		session
	};
};

export const actions: Actions = {
	default: async ({ request }) => {
		const formData = await request.formData();
		const id = value(formData, 'id');
		const routePath = value(formData, 'routePath');
		const threadId = value(formData, 'threadId');
		const reply = value(formData, 'reply');
		const status = normalizeMessageStatus(value(formData, 'status'));

		if (!id || !threadId) {
			return fail(400, { error: 'Message thread is required.' });
		}

		const message = updateMessage({
			id: threadId,
			status
		});

		if (!message && !reply) {
			return fail(404, { error: 'Message not found.' });
		}

		if (reply) {
			createMessage({
				email: staffEmail,
				message: reply,
				name: staffName,
				routePath: routePath || '/admin/messages',
				status: status ?? 'read',
				threadId,
				vehicleSlug: value(formData, 'vehicleSlug') || undefined
			});
		}

		redirect(303, `/admin/messages?thread=${encodeURIComponent(threadId)}`);
	}
};
