import { error, fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { requireAdminDealer } from '$lib/server/repositories/admin';
import {
	deletePost,
	getPostById,
	readPostFormValues,
	updatePost,
	validatePostForm
} from '$lib/server/repositories/posts';

export const load: PageServerLoad = async ({ locals, parent, params, url }) => {
	const layout = await parent();

	if (!locals.db || !layout.dealer?.id) {
		throw redirect(303, '/variant-3/admin/login');
	}

	const post = await getPostById(locals.db, layout.dealer.id, params.id);
	if (!post) throw error(404, 'Post not found');

	return {
		post,
		notice:
			url.searchParams.get('created') === '1'
				? 'Post created.'
				: url.searchParams.get('updated') === '1'
					? 'Post saved.'
					: ''
	};
};

export const actions: Actions = {
	save: async ({ locals, params, request }) => {
		const values = readPostFormValues(await request.formData());
		const parsed = validatePostForm(values);

		if (!parsed.success) {
			return fail(400, {
				error: 'Fix the highlighted fields before saving the post.',
				values,
				errors: parsed.error.flatten().fieldErrors
			});
		}

		const { db, dealerId, capabilities } = await requireAdminDealer(locals);
		if (!capabilities.content) {
			return fail(403, {
				error: 'This account cannot manage content.',
				values
			});
		}

		const updated = await updatePost(db, dealerId, params.id, parsed.data);

		if (!updated) {
			return fail(404, {
				error: 'Post was not found.',
				values
			});
		}

		throw redirect(303, `/variant-3/admin/posts/${params.id}?updated=1`);
	},
	remove: async ({ locals, params }) => {
		const { db, dealerId, capabilities } = await requireAdminDealer(locals);
		if (!capabilities.content) {
			return fail(403, {
				error: 'This account cannot manage content.',
				values: readPostFormValues(new FormData())
			});
		}

		await deletePost(db, dealerId, params.id);

		throw redirect(303, '/variant-3/admin/posts?deleted=1');
	}
};
