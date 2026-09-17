import pg from 'pg';
import { readFileSync } from 'node:fs';
import { randomUUID } from 'node:crypto';
import { hashPassword } from 'better-auth/crypto';

const { Client } = pg;

const allowedRoles = new Set([
	'owner',
	'admin',
	'manager',
	'editor',
	'sales',
	'viewer',
	'agency_admin'
]);

function requireEnv(name) {
	const value = process.env[name]?.trim();

	if (!value) {
		throw new Error(`Missing ${name}.`);
	}

	return value;
}

function getAdminPassword() {
	const passwordFile = process.env.ADMIN_PASSWORD_FILE?.trim();
	const password = process.env.ADMIN_PASSWORD?.trim();

	if (passwordFile && password) {
		throw new Error('Set either ADMIN_PASSWORD or ADMIN_PASSWORD_FILE, not both.');
	}

	if (passwordFile) {
		const value = readFileSync(passwordFile, 'utf8').trim();
		if (!value) {
			throw new Error(`ADMIN_PASSWORD_FILE is empty: ${passwordFile}`);
		}

		return value;
	}

	return requireEnv('ADMIN_PASSWORD');
}

async function main() {
	const databaseUrl = process.env.DATABASE_URL_UNPOOLED?.trim() || requireEnv('DATABASE_URL');
	const email = requireEnv('ADMIN_EMAIL').toLowerCase();
	const password = getAdminPassword();
	const requestedAuthUserId = process.env.ADMIN_AUTH_USER_ID?.trim();
	const fullName = process.env.ADMIN_NAME?.trim() || email;
	const dealerSlug = process.env.DEFAULT_DEALER_SLUG?.trim() || 'daynight-auto';
	const role = process.env.ADMIN_ROLE?.trim() || 'agency_admin';

	if (password.length < 12) {
		throw new Error('ADMIN_PASSWORD must be at least 12 characters.');
	}

	if (!allowedRoles.has(role)) {
		throw new Error(`ADMIN_ROLE must be one of: ${Array.from(allowedRoles).join(', ')}`);
	}

	const client = new Client({ connectionString: databaseUrl });
	await client.connect();

	try {
		const dealerResult = await client.query(
			'select id, slug from public.dealers where slug = $1 and status = $2 limit 1',
			[dealerSlug, 'active']
		);
		const dealer = dealerResult.rows[0];

		if (!dealer) {
			throw new Error(`Active dealer not found for DEFAULT_DEALER_SLUG=${dealerSlug}.`);
		}

		const existingUserResult = await client.query(
			'select id, email from public."user" where email = $1 or ($2::text is not null and id = $2) limit 1',
			[email, requestedAuthUserId || null]
		);
		const existingUser = existingUserResult.rows[0];

		if (
			existingUser &&
			requestedAuthUserId &&
			existingUser.id !== requestedAuthUserId &&
			existingUser.email === email
		) {
			throw new Error(
				`ADMIN_EMAIL already belongs to auth user ${existingUser.id}; remove ADMIN_AUTH_USER_ID or use the existing id.`
			);
		}

		const authUserId = existingUser?.id || requestedAuthUserId || randomUUID();
		const passwordHash = await hashPassword(password);

		await client.query(
			`
				insert into public."user" (id, name, email, email_verified, updated_at)
				values ($1, $2, $3, true, now())
				on conflict (id) do update set
					name = excluded.name,
					email = excluded.email,
					email_verified = true,
					updated_at = now()
			`,
			[authUserId, fullName, email]
		);

		const credentialAccountResult = await client.query(
			`
				select id
				from public.account
				where user_id = $1 and provider_id = 'credential'
				order by created_at asc
				limit 1
			`,
			[authUserId]
		);
		const credentialAccountId = credentialAccountResult.rows[0]?.id || randomUUID();

		await client.query(
			`
				insert into public.account (
					id,
					account_id,
					provider_id,
					user_id,
					password,
					updated_at
				)
				values ($1, $2, 'credential', $2, $3, now())
				on conflict (id) do update set
					account_id = excluded.account_id,
					provider_id = excluded.provider_id,
					user_id = excluded.user_id,
					password = excluded.password,
					updated_at = now()
			`,
			[credentialAccountId, authUserId, passwordHash]
		);

		const profileResult = await client.query(
			`
				insert into public.profiles (auth_user_id, dealer_id, email, full_name, role)
				values ($1, $2, $3, $4, $5)
				on conflict (auth_user_id) do update set
					dealer_id = excluded.dealer_id,
					email = excluded.email,
					role = excluded.role,
					updated_at = now()
				returning id, dealer_id, email, role
			`,
			[authUserId, dealer.id, email, fullName, role]
		);
		const profile = profileResult.rows[0];

		console.log(`Provisioned ${profile.email} for ${dealer.slug}.`);
		console.log(`auth_user_id=${authUserId}`);
		console.log(`account_id=${credentialAccountId}`);
		console.log(`profile_id=${profile.id}`);
		console.log(`dealer_id=${profile.dealer_id}`);
		console.log(`role=${profile.role}`);
	} finally {
		await client.end();
	}
}

main().catch((error) => {
	console.error(error.message);
	process.exitCode = 1;
});
