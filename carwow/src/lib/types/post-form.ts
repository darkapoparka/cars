export const postFormKeys = [
	'slug',
	'type',
	'status',
	'title',
	'excerpt',
	'body',
	'coverUrl',
	'category',
	'tags',
	'author',
	'readMinutes'
] as const;

export type PostFormKey = (typeof postFormKeys)[number];

export type PostFormValues = Record<PostFormKey, string>;

export type PostFormFailure = {
	error: string;
	values: PostFormValues;
	errors?: Partial<Record<PostFormKey, string[]>>;
};
