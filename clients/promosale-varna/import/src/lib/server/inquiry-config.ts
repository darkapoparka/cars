import { env } from '$env/dynamic/private';
import { runtimeConfig } from './runtime-config';

export const inquiryDatabaseUrl = () => env.DATABASE_URL?.trim();
export const hasInquiryDatabase = () => runtimeConfig().inquiryStorage === 'database';
export const templateAdminCredentials = () => ({
	email: env.TEMPLATE_ADMIN_EMAIL?.trim().toLowerCase(),
	password: env.TEMPLATE_ADMIN_PASSWORD
});
