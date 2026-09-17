import { createHash, createHmac, randomBytes, timingSafeEqual } from 'node:crypto';
import { dev } from '$app/environment';
import { env } from '$env/dynamic/private';
import type { Cookies } from '@sveltejs/kit';

const cookieName = 'daynight_chat';
const maxAgeSeconds = 60 * 60 * 24 * 180;

function getCookieSecret() {
	const secret = env.CHAT_COOKIE_SECRET?.trim();

	if (!secret) {
		throw new Error('Missing CHAT_COOKIE_SECRET for visitor chat cookies.');
	}

	if (secret.length < 32) {
		throw new Error('CHAT_COOKIE_SECRET must be at least 32 characters.');
	}

	return secret;
}

function signToken(token: string) {
	return createHmac('sha256', getCookieSecret()).update(token).digest('base64url');
}

function createToken() {
	return randomBytes(24).toString('base64url');
}

function safeEqual(left: string, right: string) {
	const leftBuffer = Buffer.from(left);
	const rightBuffer = Buffer.from(right);

	return leftBuffer.length === rightBuffer.length && timingSafeEqual(leftBuffer, rightBuffer);
}

export function hashVisitorChatToken(token: string) {
	return createHash('sha256').update(token).digest('hex');
}

export function readVisitorChatToken(cookies: Cookies) {
	const value = cookies.get(cookieName);
	if (!value) return null;

	const [token, signature] = value.split('.');
	if (!token || !signature) return null;
	if (!/^[A-Za-z0-9_-]{24,64}$/.test(token)) return null;

	return safeEqual(signToken(token), signature) ? token : null;
}

export function ensureVisitorChatToken(cookies: Cookies) {
	const existing = readVisitorChatToken(cookies);
	if (existing) return existing;

	const token = createToken();
	cookies.set(cookieName, `${token}.${signToken(token)}`, {
		path: '/',
		httpOnly: true,
		sameSite: 'lax',
		secure: !dev,
		maxAge: maxAgeSeconds
	});

	return token;
}
