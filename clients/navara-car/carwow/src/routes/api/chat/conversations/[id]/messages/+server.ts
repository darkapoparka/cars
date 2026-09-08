import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
export const POST: RequestHandler = async () => json({ message: 'Демонстрационен чат: съобщения не се изпращат. За контакт: 0899 192 300.' }, { status: 503 });
export const GET: RequestHandler = async () => json({ messages: [] });
