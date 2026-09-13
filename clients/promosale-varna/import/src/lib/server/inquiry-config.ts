import { env } from '$env/dynamic/private';

export const inquiryDatabaseUrl = () => env.DATABASE_URL?.trim();
export const hasInquiryDatabase = () => Boolean(inquiryDatabaseUrl());
export const templateAdminCredentials = () => ({
	email: env.TEMPLATE_ADMIN_EMAIL?.trim().toLowerCase(),
	password: env.TEMPLATE_ADMIN_PASSWORD
});
