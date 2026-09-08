import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
export const POST: RequestHandler = async () => json({ message: 'Демонстрационна форма: данните не са изпратени. За реално запитване използвайте публикувания телефон 0899 192 300.' }, { status: 503 });
