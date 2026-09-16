import { fail, redirect } from '@sveltejs/kit';
import type { Actions } from './$types';
import { requireAdminDealer } from '$lib/server/repositories/admin';
import { createPost, readPostFormValues, validatePostForm } from '$lib/server/repositories/posts';

export const actions: Actions = {
	default: async ({ locals, request }) => {
		const values = readPostFormValues(await request.formData());
		const parsed = validatePostForm(values);

		if (!parsed.success) {
			return fail(400, {
				error: 'Fix the highlighted fields before creating the post.',
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

		const id = await createPost(db, dealerId, parsed.data);

		throw redirect(303, `/admin/posts/${id}?created=1`);
	}
};
