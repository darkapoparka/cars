import { and, count, desc, eq, inArray } from 'drizzle-orm';
import type {
	DayNightArticle,
	DayNightArticleCategory,
	DayNightArticleKind
} from '$lib/data/daynight-blog';
import type { Db } from '$lib/server/db/client';
import { posts } from '$lib/server/db/schema';
import { postFormSchema, postStatusSchema, type PostFormInput } from '$lib/server/cms/schemas';
import type { PostInsert } from '$lib/server/db/types';
import type { PostRow, PostStatus } from '$lib/types/database';
import { postFormKeys, type PostFormValues } from '$lib/types/post-form';

export type PostFilters = {
	status: PostStatus | 'all';
	type: PostRow['type'] | 'all';
	query: string;
};

export type PostOverview = {
	posts: PostRow[];
	counts: Record<PostStatus | 'all', number>;
	typeCounts: Record<PostRow['type'] | 'all', number>;
	filters: PostFilters;
};

const formKeys: ReadonlyArray<keyof PostFormInput> = postFormKeys;

const fallbackPostImage = '/assets/images/blog/post-44.jpg';
const daynightArticleCategories = new Set<DayNightArticleCategory>([
	'Покупка',
	'Продажба',
	'Новини',
	'Съвети',
	'Финансиране',
	'Документи',
	'Марки'
]);
const cyrillicSlugMap: Record<string, string> = {
	а: 'a',
	б: 'b',
	в: 'v',
	г: 'g',
	д: 'd',
	е: 'e',
	ж: 'zh',
	з: 'z',
	и: 'i',
	й: 'y',
	к: 'k',
	л: 'l',
	м: 'm',
	н: 'n',
	о: 'o',
	п: 'p',
	р: 'r',
	с: 's',
	т: 't',
	у: 'u',
	ф: 'f',
	х: 'h',
	ц: 'ts',
	ч: 'ch',
	ш: 'sh',
	щ: 'sht',
	ъ: 'a',
	ь: '',
	ю: 'yu',
	я: 'ya'
};

function readText(formData: FormData, key: keyof PostFormInput) {
	const value = formData.get(key);
	return typeof value === 'string' ? value : '';
}

function normalizeSearch(value: string) {
	return value.trim().toLowerCase();
}

function splitTags(value: string | null | undefined) {
	return (value ?? '')
		.split(',')
		.map((item) => item.trim())
		.filter(Boolean);
}

function normalizePostBody(value: string) {
	return value
		.replace(/\r\n/g, '\n')
		.replace(/\\r\\n/g, '\n')
		.replace(/\\n/g, '\n');
}

function splitBodyParagraphs(value: string) {
	return normalizePostBody(value)
		.split(/\n{2,}/)
		.map((paragraph) => paragraph.trim())
		.filter(Boolean);
}

function normalizePostCategory(
	category: string | null,
	type: PostRow['type']
): DayNightArticleCategory {
	const trimmed = category?.trim();
	if (trimmed && daynightArticleCategories.has(trimmed as DayNightArticleCategory)) {
		return trimmed as DayNightArticleCategory;
	}

	return type === 'news' ? 'Новини' : 'Съвети';
}

function postKind(type: PostRow['type']): DayNightArticleKind {
	return type === 'news' ? 'news' : 'guide';
}

function transliterateCyrillic(value: string) {
	return Array.from(value.toLowerCase())
		.map((character) => cyrillicSlugMap[character] ?? character)
		.join('');
}

function slugify(value: string) {
	return transliterateCyrillic(value)
		.normalize('NFKD')
		.replace(/[\u0300-\u036f]/g, '')
		.replace(/[^a-z0-9]+/g, '-')
		.replace(/^-+|-+$/g, '')
		.slice(0, 120);
}

function matchesPostSearch(post: PostRow, query: string) {
	if (!query) return true;

	const haystack = [
		post.title,
		post.excerpt,
		post.slug,
		post.type,
		post.category,
		post.author,
		post.tags.join(' ')
	]
		.filter(Boolean)
		.join(' ')
		.toLowerCase();

	return haystack.includes(query);
}

async function createUniqueSlug(
	db: Db,
	dealerId: string,
	baseSlug: string,
	excludePostId?: string
) {
	const base = slugify(baseSlug) || `post-${Date.now()}`;
	let candidate = base;
	let index = 2;

	while (true) {
		const [existing] = await db
			.select({ id: posts.id })
			.from(posts)
			.where(and(eq(posts.dealer_id, dealerId), eq(posts.slug, candidate)))
			.limit(1);

		if (!existing || existing.id === excludePostId) return candidate;

		candidate = `${base}-${index}`;
		index += 1;
	}
}

async function buildPostWrite(
	db: Db,
	dealerId: string,
	input: PostFormInput,
	existing?: PostRow
): Promise<PostInsert> {
	const slug = await createUniqueSlug(db, dealerId, input.slug || input.title, existing?.id);
	const publishedAt =
		input.status === 'published' ? (existing?.published_at ?? new Date().toISOString()) : null;

	return {
		dealer_id: dealerId,
		slug,
		type: input.type,
		title: input.title,
		excerpt: input.excerpt || '',
		body: normalizePostBody(input.body || ''),
		cover_url: input.coverUrl || null,
		category: input.category || null,
		tags: splitTags(input.tags),
		author: input.author || 'Success Automobile',
		read_minutes: input.readMinutes,
		status: input.status,
		published_at: publishedAt
	};
}

async function countPosts(db: Db, dealerId: string, status?: PostStatus) {
	const where = status
		? and(eq(posts.dealer_id, dealerId), eq(posts.status, status))
		: eq(posts.dealer_id, dealerId);
	const [result] = await db.select({ value: count() }).from(posts).where(where);
	return result?.value ?? 0;
}

export function readPostFormValues(formData: FormData): PostFormValues {
	return Object.fromEntries(
		formKeys.map((key) => [key, readText(formData, key)])
	) as PostFormValues;
}

export function validatePostForm(values: PostFormValues) {
	return postFormSchema.safeParse(values);
}

export function parsePostStatus(value: FormDataEntryValue | null) {
	const parsed = postStatusSchema.safeParse(value);
	return parsed.success ? parsed.data : null;
}

export function postRowToDayNightArticle(post: PostRow): DayNightArticle {
	const paragraphs = splitBodyParagraphs(post.body);
	const description = post.excerpt.trim() || paragraphs[0] || post.title;
	const category = normalizePostCategory(post.category, post.type);
	const summaryCandidates = [post.excerpt.trim(), ...paragraphs].filter(Boolean);
	const summary = Array.from(new Set(summaryCandidates)).slice(0, 3);
	const sectionParagraphs = paragraphs.length ? paragraphs : [description];

	return {
		slug: post.slug,
		title: post.title,
		description,
		category,
		kind: postKind(post.type),
		date: (post.published_at ?? post.updated_at ?? post.created_at).slice(0, 10),
		author: post.author || 'Success Automobile',
		image: post.cover_url || fallbackPostImage,
		readMinutes:
			post.read_minutes ||
			Math.max(1, Math.ceil(sectionParagraphs.join(' ').split(/\s+/).length / 180)),
		summary: summary.length ? summary : [description],
		sections: [
			{
				heading: post.category?.trim() || (post.type === 'news' ? 'Новина' : 'Полезно'),
				paragraphs: sectionParagraphs
			}
		],
		tags: post.tags.length ? post.tags : [category],
		body: Array.from(new Set([description, ...paragraphs].filter(Boolean)))
	};
}

export async function getPublishedPostArticles(
	db: Db,
	dealerId: string
): Promise<DayNightArticle[]> {
	const rows = await db
		.select()
		.from(posts)
		.where(and(eq(posts.dealer_id, dealerId), eq(posts.status, 'published')))
		.orderBy(desc(posts.published_at), desc(posts.updated_at))
		.limit(100);

	return rows.map(postRowToDayNightArticle);
}

export async function getPostOverview(
	db: Db,
	dealerId: string,
	filters: PostFilters
): Promise<PostOverview> {
	const [all, draft, published, archived] = await Promise.all([
		countPosts(db, dealerId),
		countPosts(db, dealerId, 'draft'),
		countPosts(db, dealerId, 'published'),
		countPosts(db, dealerId, 'archived')
	]);

	const allPosts = await db
		.select()
		.from(posts)
		.where(eq(posts.dealer_id, dealerId))
		.orderBy(desc(posts.updated_at))
		.limit(250);

	const normalizedQuery = normalizeSearch(filters.query);
	const filteredPosts = allPosts.filter((post) => {
		if (filters.status !== 'all' && post.status !== filters.status) return false;
		if (filters.type !== 'all' && post.type !== filters.type) return false;
		return matchesPostSearch(post, normalizedQuery);
	});

	return {
		posts: filteredPosts,
		counts: {
			all,
			draft,
			published,
			archived
		},
		typeCounts: {
			all: allPosts.length,
			blog: allPosts.filter((post) => post.type === 'blog').length,
			news: allPosts.filter((post) => post.type === 'news').length
		},
		filters
	};
}

export async function getPostById(db: Db, dealerId: string, postId: string) {
	const [post] = await db
		.select()
		.from(posts)
		.where(and(eq(posts.dealer_id, dealerId), eq(posts.id, postId)))
		.limit(1);

	return post ?? null;
}

export async function createPost(db: Db, dealerId: string, input: PostFormInput) {
	const payload = await buildPostWrite(db, dealerId, input);
	const [post] = await db.insert(posts).values(payload).returning({ id: posts.id });

	if (!post) {
		throw new Error('Post creation returned no id.');
	}

	return post.id;
}

export async function updatePost(db: Db, dealerId: string, postId: string, input: PostFormInput) {
	const existing = await getPostById(db, dealerId, postId);
	if (!existing) return false;

	const payload = await buildPostWrite(db, dealerId, input, existing);
	const [updated] = await db
		.update(posts)
		.set(payload)
		.where(and(eq(posts.dealer_id, dealerId), eq(posts.id, postId)))
		.returning({ id: posts.id });

	return Boolean(updated);
}

export async function updatePostStatus(
	db: Db,
	dealerId: string,
	postId: string,
	status: PostStatus
) {
	const [updated] = await db
		.update(posts)
		.set({
			status,
			published_at: status === 'published' ? new Date().toISOString() : null
		})
		.where(and(eq(posts.dealer_id, dealerId), eq(posts.id, postId)))
		.returning({ id: posts.id });

	return Boolean(updated);
}

export async function updatePostsStatus(
	db: Db,
	dealerId: string,
	ids: string[],
	status: PostStatus
) {
	if (!ids.length) return 0;

	const updated = await db
		.update(posts)
		.set({
			status,
			published_at: status === 'published' ? new Date().toISOString() : null
		})
		.where(and(eq(posts.dealer_id, dealerId), inArray(posts.id, ids)))
		.returning({ id: posts.id });

	return updated.length;
}

export async function deletePost(db: Db, dealerId: string, postId: string) {
	const [deleted] = await db
		.delete(posts)
		.where(and(eq(posts.dealer_id, dealerId), eq(posts.id, postId)))
		.returning({ id: posts.id });

	return Boolean(deleted);
}

export async function deletePosts(db: Db, dealerId: string, ids: string[]) {
	if (!ids.length) return 0;

	const deleted = await db
		.delete(posts)
		.where(and(eq(posts.dealer_id, dealerId), inArray(posts.id, ids)))
		.returning({ id: posts.id });

	return deleted.length;
}
