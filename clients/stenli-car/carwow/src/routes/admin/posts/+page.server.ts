import { fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { requireAdminDealer } from '$lib/server/repositories/admin';
import {
	deletePost,
	deletePosts,
	getPostOverview,
	parsePostStatus,
	updatePostStatus,
	updatePostsStatus,
	type PostFilters,
	type PostOverview
} from '$lib/server/repositories/posts';
import type { PostRow, PostStatus } from '$lib/types/database';

const emptyOverview: PostOverview = {
	posts: [],
	counts: {
		all: 0,
		draft: 0,
		published: 0,
		archived: 0
	},
	typeCounts: {
		all: 0,
		blog: 0,
		news: 0
	},
	filters: {
		status: 'all',
		type: 'all',
		query: ''
	}
};

function readFilters(url: URL): PostFilters {
	const rawStatus = url.searchParams.get('status');
	const rawType = url.searchParams.get('type');
	const status = ['draft', 'published', 'archived'].includes(rawStatus ?? '')
		? (rawStatus as PostStatus)
		: 'all';
	const type = ['blog', 'news'].includes(rawType ?? '') ? (rawType as PostRow['type']) : 'all';

	return {
		status,
		type,
		query: url.searchParams.get('q')?.trim() ?? ''
	};
}

function readPostId(formData: FormData) {
	const id = formData.get('id');
	return typeof id === 'string' && id ? id : null;
}

function readPostIds(formData: FormData) {
	return formData
		.getAll('ids')
		.filter((id): id is string => typeof id === 'string' && id.length > 0);
}

function readNotice(url: URL) {
	if (url.searchParams.get('deleted') === '1') return 'Post deleted.';
	if (url.searchParams.get('updated') === 'status') return 'Post status updated.';
	if (url.searchParams.get('bulk') === 'status') return 'Selected posts updated.';
	if (url.searchParams.get('bulk') === 'deleted') return 'Selected posts deleted.';
	return '';
}

export const load: PageServerLoad = async ({ locals, parent, url }) => {
	const layout = await parent();
	const filters = readFilters(url);

	if (!locals.db || !layout.dealer?.id) {
		return {
			posts: {
				...emptyOverview,
				filters
			},
			notice: readNotice(url)
		};
	}

	return {
		posts: await getPostOverview(locals.db, layout.dealer.id, filters),
		notice: readNotice(url)
	};
};

export const actions: Actions = {
	updateStatus: async ({ locals, request }) => {
		const formData = await request.formData();
		const id = readPostId(formData);
		const status = parsePostStatus(formData.get('status'));

		if (!id || !status) {
			return fail(400, {
				error: 'Choose a valid post and status.'
			});
		}

		const { db, dealerId, capabilities } = await requireAdminDealer(locals);
		if (!capabilities.content) {
			return fail(403, { error: 'This account cannot manage content.' });
		}

		await updatePostStatus(db, dealerId, id, status);

		throw redirect(303, '/admin/posts?updated=status');
	},
	bulkStatus: async ({ locals, request }) => {
		const formData = await request.formData();
		const ids = readPostIds(formData);
		const status = parsePostStatus(formData.get('status'));

		if (!ids.length || !status) {
			return fail(400, {
				error: 'Select posts and choose a valid status.'
			});
		}

		const { db, dealerId, capabilities } = await requireAdminDealer(locals);
		if (!capabilities.content) {
			return fail(403, { error: 'This account cannot manage content.' });
		}

		await updatePostsStatus(db, dealerId, ids, status);

		throw redirect(303, '/admin/posts?bulk=status');
	},
	remove: async ({ locals, request }) => {
		const formData = await request.formData();
		const id = readPostId(formData);

		if (!id) {
			return fail(400, {
				error: 'Choose a post to delete.'
			});
		}

		const { db, dealerId, capabilities } = await requireAdminDealer(locals);
		if (!capabilities.content) {
			return fail(403, { error: 'This account cannot manage content.' });
		}

		await deletePost(db, dealerId, id);

		throw redirect(303, '/admin/posts?deleted=1');
	},
	bulkRemove: async ({ locals, request }) => {
		const ids = readPostIds(await request.formData());

		if (!ids.length) {
			return fail(400, {
				error: 'Select posts to delete.'
			});
		}

		const { db, dealerId, capabilities } = await requireAdminDealer(locals);
		if (!capabilities.content) {
			return fail(403, { error: 'This account cannot manage content.' });
		}

		await deletePosts(db, dealerId, ids);

		throw redirect(303, '/admin/posts?bulk=deleted');
	}
};
