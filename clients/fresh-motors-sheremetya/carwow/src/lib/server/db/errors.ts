export class NotFoundError extends Error {
	constructor(message = 'Record was not found.') {
		super(message);
		this.name = 'NotFoundError';
	}
}

export class UniqueConflictError extends Error {
	constructor(message = 'Record already exists.') {
		super(message);
		this.name = 'UniqueConflictError';
	}
}

export function isUniqueViolation(error: unknown) {
	return (
		typeof error === 'object' &&
		error !== null &&
		'code' in error &&
		(error as { code?: string }).code === '23505'
	);
}
