import { sql } from 'drizzle-orm';
import {
	boolean,
	check,
	foreignKey,
	index,
	integer,
	jsonb,
	pgEnum,
	pgTable,
	text,
	timestamp,
	unique,
	uniqueIndex,
	uuid
} from 'drizzle-orm/pg-core';

export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export const dealerStatus = pgEnum('dealer_status', ['demo', 'active', 'paused', 'archived']);
export const profileRole = pgEnum('profile_role', [
	'owner',
	'admin',
	'manager',
	'editor',
	'sales',
	'viewer',
	'agency_admin'
]);
export const vehicleCondition = pgEnum('vehicle_condition', ['new', 'used']);
export const vehicleStatus = pgEnum('vehicle_status', ['draft', 'published', 'sold', 'archived']);
export const postType = pgEnum('post_type', ['news', 'blog']);
export const postStatus = pgEnum('post_status', ['draft', 'published', 'archived']);
export const leadStatus = pgEnum('lead_status', ['new', 'in_progress', 'won', 'lost', 'archived']);
export const importRequestStatus = pgEnum('import_request_status', [
	'new',
	'sourcing',
	'quoted',
	'deposit_pending',
	'purchased',
	'in_transit',
	'customs',
	'ready_for_delivery',
	'delivered',
	'cancelled'
]);
export const conversationKind = pgEnum('conversation_kind', [
	'lead',
	'import',
	'vehicle',
	'support'
]);
export const conversationStatus = pgEnum('conversation_status', [
	'open',
	'waiting',
	'closed',
	'archived'
]);
export const messageSenderType = pgEnum('message_sender_type', ['staff', 'customer', 'system']);
export const memberType = pgEnum('member_type', ['staff', 'customer', 'system']);

const createdAt = () => timestamp('created_at', { withTimezone: true }).notNull().defaultNow();
const updatedAt = () => timestamp('updated_at', { withTimezone: true }).notNull().defaultNow();
const nullableTimestamp = (name: string) => timestamp(name, { withTimezone: true });
const appCreatedAt = () =>
	timestamp('created_at', { mode: 'string', withTimezone: true }).notNull().defaultNow();
const appUpdatedAt = () =>
	timestamp('updated_at', { mode: 'string', withTimezone: true }).notNull().defaultNow();
const appTimestamp = (name: string) => timestamp(name, { mode: 'string', withTimezone: true });

export const user = pgTable('user', {
	id: text('id').primaryKey(),
	name: text('name').notNull(),
	email: text('email').notNull().unique(),
	emailVerified: boolean('email_verified').notNull().default(false),
	image: text('image'),
	createdAt: createdAt(),
	updatedAt: updatedAt()
});

export const session = pgTable(
	'session',
	{
		id: text('id').primaryKey(),
		expiresAt: timestamp('expires_at', { withTimezone: true }).notNull(),
		token: text('token').notNull().unique(),
		createdAt: createdAt(),
		updatedAt: updatedAt(),
		ipAddress: text('ip_address'),
		userAgent: text('user_agent'),
		userId: text('user_id')
			.notNull()
			.references(() => user.id, { onDelete: 'cascade' })
	},
	(table) => [index('session_user_id_idx').on(table.userId)]
);

export const account = pgTable(
	'account',
	{
		id: text('id').primaryKey(),
		accountId: text('account_id').notNull(),
		providerId: text('provider_id').notNull(),
		userId: text('user_id')
			.notNull()
			.references(() => user.id, { onDelete: 'cascade' }),
		accessToken: text('access_token'),
		refreshToken: text('refresh_token'),
		idToken: text('id_token'),
		accessTokenExpiresAt: nullableTimestamp('access_token_expires_at'),
		refreshTokenExpiresAt: nullableTimestamp('refresh_token_expires_at'),
		scope: text('scope'),
		password: text('password'),
		createdAt: createdAt(),
		updatedAt: updatedAt()
	},
	(table) => [index('account_user_id_idx').on(table.userId)]
);

export const verification = pgTable('verification', {
	id: text('id').primaryKey(),
	identifier: text('identifier').notNull(),
	value: text('value').notNull(),
	expiresAt: timestamp('expires_at', { withTimezone: true }).notNull(),
	createdAt: nullableTimestamp('created_at'),
	updatedAt: nullableTimestamp('updated_at')
});

export const dealers = pgTable(
	'dealers',
	{
		id: uuid('id').primaryKey().defaultRandom(),
		slug: text('slug').notNull().unique(),
		name: text('name').notNull(),
		brand_name: text('brand_name').notNull(),
		legal_name: text('legal_name'),
		website_url: text('website_url'),
		source_inventory_url: text('source_inventory_url'),
		phone: text('phone'),
		phone_label: text('phone_label'),
		email: text('email'),
		address: text('address'),
		city: text('city'),
		country_code: text('country_code').notNull().default('BG'),
		timezone: text('timezone').notNull().default('Europe/Дупница'),
		default_locale: text('default_locale').notNull().default('bg-BG'),
		currency_code: text('currency_code').notNull().default('EUR'),
		logo_light_url: text('logo_light_url'),
		logo_dark_url: text('logo_dark_url'),
		settings: jsonb('settings')
			.$type<Json>()
			.notNull()
			.default(sql`'{}'::jsonb`),
		status: dealerStatus('status').notNull().default('demo'),
		created_at: appCreatedAt(),
		updated_at: appUpdatedAt()
	},
	(table) => [index('dealers_slug_idx').on(table.slug)]
);

export const profiles = pgTable(
	'profiles',
	{
		id: uuid('id').primaryKey().defaultRandom(),
		auth_user_id: text('auth_user_id')
			.notNull()
			.unique()
			.references(() => user.id, { onDelete: 'cascade' }),
		dealer_id: uuid('dealer_id')
			.notNull()
			.references(() => dealers.id, { onDelete: 'restrict' }),
		email: text('email'),
		full_name: text('full_name'),
		role: profileRole('role').notNull().default('viewer'),
		phone: text('phone'),
		avatar_url: text('avatar_url'),
		last_seen_at: appTimestamp('last_seen_at'),
		created_at: appCreatedAt(),
		updated_at: appUpdatedAt()
	},
	(table) => [
		index('profiles_auth_user_id_idx').on(table.auth_user_id),
		index('profiles_dealer_id_idx').on(table.dealer_id)
	]
);

export const vehicles = pgTable(
	'vehicles',
	{
		id: uuid('id').primaryKey().defaultRandom(),
		dealer_id: uuid('dealer_id')
			.notNull()
			.references(() => dealers.id, { onDelete: 'cascade' }),
		slug: text('slug').notNull(),
		title: text('title').notNull(),
		short_title: text('short_title').notNull(),
		brand: text('brand').notNull(),
		model: text('model').notNull(),
		year: integer('year').notNull(),
		mileage_value: integer('mileage_value').notNull().default(0),
		mileage_text: text('mileage_text').notNull().default(''),
		fuel: text('fuel').notNull().default(''),
		transmission: text('transmission').notNull().default(''),
		body: text('body').notNull().default(''),
		doors: integer('doors'),
		engine: text('engine').notNull().default(''),
		power: text('power').notNull().default(''),
		drive: text('drive').notNull().default(''),
		color: text('color').notNull().default(''),
		price: integer('price').notNull().default(0),
		price_eur: text('price_eur').notNull().default(''),
		price_bgn: text('price_bgn').notNull().default(''),
		monthly: text('monthly').notNull().default(''),
		condition: vehicleCondition('condition').notNull().default('used'),
		description: text('description').notNull().default(''),
		condition_line: text('condition_line').notNull().default(''),
		lot: text('lot').notNull().default(''),
		source_url: text('source_url').notNull().default(''),
		features: text('features')
			.array()
			.notNull()
			.default(sql`'{}'::text[]`),
		highlights: text('highlights')
			.array()
			.notNull()
			.default(sql`'{}'::text[]`),
		badges: text('badges')
			.array()
			.notNull()
			.default(sql`'{}'::text[]`),
		image: text('image').notNull().default(''),
		status: vehicleStatus('status').notNull().default('draft'),
		published_at: appTimestamp('published_at'),
		sold_at: appTimestamp('sold_at'),
		created_at: appCreatedAt(),
		updated_at: appUpdatedAt()
	},
	(table) => [
		unique().on(table.dealer_id, table.slug),
		check(
			'vehicles_year_check',
			sql`${table.year} between 1900 and extract(year from now())::integer + 2`
		),
		check('vehicles_mileage_value_check', sql`${table.mileage_value} >= 0`),
		check('vehicles_doors_check', sql`${table.doors} is null or ${table.doors} between 0 and 8`),
		check('vehicles_price_check', sql`${table.price} >= 0`),
		index('vehicles_dealer_status_idx').on(table.dealer_id, table.status),
		index('vehicles_dealer_brand_idx').on(table.dealer_id, table.brand),
		index('vehicles_features_gin_idx').using('gin', table.features),
		uniqueIndex('vehicles_dealer_lot_unique_idx')
			.on(table.dealer_id, table.lot)
			.where(sql`${table.lot} <> ''`)
	]
);

export const vehiclePhotos = pgTable(
	'vehicle_photos',
	{
		id: uuid('id').primaryKey().defaultRandom(),
		dealer_id: uuid('dealer_id')
			.notNull()
			.references(() => dealers.id, { onDelete: 'cascade' }),
		vehicle_id: uuid('vehicle_id')
			.notNull()
			.references(() => vehicles.id, { onDelete: 'cascade' }),
		url: text('url').notNull(),
		storage_path: text('storage_path'),
		alt: text('alt'),
		sort_order: integer('sort_order').notNull().default(0),
		is_cover: boolean('is_cover').notNull().default(false),
		created_at: appCreatedAt()
	},
	(table) => [
		unique().on(table.vehicle_id, table.url),
		index('vehicle_photos_vehicle_sort_idx').on(table.vehicle_id, table.sort_order),
		index('vehicle_photos_dealer_id_idx').on(table.dealer_id)
	]
);

export const posts = pgTable(
	'posts',
	{
		id: uuid('id').primaryKey().defaultRandom(),
		dealer_id: uuid('dealer_id')
			.notNull()
			.references(() => dealers.id, { onDelete: 'cascade' }),
		slug: text('slug').notNull(),
		type: postType('type').notNull().default('blog'),
		title: text('title').notNull(),
		excerpt: text('excerpt').notNull().default(''),
		body: text('body').notNull().default(''),
		cover_url: text('cover_url'),
		category: text('category'),
		tags: text('tags')
			.array()
			.notNull()
			.default(sql`'{}'::text[]`),
		author: text('author').notNull().default(''),
		read_minutes: integer('read_minutes').notNull().default(3),
		published_at: appTimestamp('published_at'),
		status: postStatus('status').notNull().default('draft'),
		created_at: appCreatedAt(),
		updated_at: appUpdatedAt()
	},
	(table) => [
		unique().on(table.dealer_id, table.slug),
		check('posts_read_minutes_check', sql`${table.read_minutes} > 0`),
		index('posts_dealer_status_idx').on(table.dealer_id, table.status, table.published_at.desc())
	]
);

export const leads = pgTable(
	'leads',
	{
		id: uuid('id').primaryKey().defaultRandom(),
		dealer_id: uuid('dealer_id')
			.notNull()
			.references(() => dealers.id, { onDelete: 'cascade' }),
		vehicle_id: uuid('vehicle_id').references(() => vehicles.id, { onDelete: 'set null' }),
		import_request_id: uuid('import_request_id'),
		customer_name: text('customer_name').notNull(),
		contact: text('contact').notNull(),
		email: text('email'),
		phone: text('phone'),
		source: text('source').notNull().default('website'),
		message: text('message').notNull().default(''),
		status: leadStatus('status').notNull().default('new'),
		value: integer('value'),
		metadata: jsonb('metadata')
			.$type<Json>()
			.notNull()
			.default(sql`'{}'::jsonb`),
		created_at: appCreatedAt(),
		updated_at: appUpdatedAt()
	},
	(table) => [
		check('leads_value_check', sql`${table.value} is null or ${table.value} >= 0`),
		index('leads_dealer_status_idx').on(table.dealer_id, table.status, table.created_at.desc()),
		index('leads_import_request_id_idx').on(table.import_request_id),
		index('leads_vehicle_id_idx').on(table.vehicle_id)
	]
);

export const importRequests = pgTable(
	'import_requests',
	{
		id: uuid('id').primaryKey().defaultRandom(),
		dealer_id: uuid('dealer_id')
			.notNull()
			.references(() => dealers.id, { onDelete: 'cascade' }),
		lead_id: uuid('lead_id').references(() => leads.id, { onDelete: 'set null' }),
		customer_name: text('customer_name').notNull(),
		contact: text('contact').notNull(),
		email: text('email'),
		phone: text('phone'),
		origin_country: text('origin_country').notNull().default('CA'),
		destination_country: text('destination_country').notNull().default('BG'),
		desired_make: text('desired_make'),
		desired_model: text('desired_model'),
		desired_year_min: integer('desired_year_min'),
		desired_year_max: integer('desired_year_max'),
		budget_min: integer('budget_min'),
		budget_max: integer('budget_max'),
		fuel: text('fuel'),
		transmission: text('transmission'),
		notes: text('notes').notNull().default(''),
		status: importRequestStatus('status').notNull().default('new'),
		assigned_to: uuid('assigned_to').references(() => profiles.id, { onDelete: 'set null' }),
		metadata: jsonb('metadata')
			.$type<Json>()
			.notNull()
			.default(sql`'{}'::jsonb`),
		created_at: appCreatedAt(),
		updated_at: appUpdatedAt()
	},
	(table) => [
		check(
			'import_requests_budget_min_check',
			sql`${table.budget_min} is null or ${table.budget_min} >= 0`
		),
		check(
			'import_requests_budget_max_check',
			sql`${table.budget_max} is null or ${table.budget_max} >= 0`
		),
		check(
			'import_requests_year_range_check',
			sql`${table.desired_year_min} is null or ${table.desired_year_max} is null or ${table.desired_year_min} <= ${table.desired_year_max}`
		),
		check(
			'import_requests_budget_range_check',
			sql`${table.budget_min} is null or ${table.budget_max} is null or ${table.budget_min} <= ${table.budget_max}`
		),
		index('import_requests_dealer_status_idx').on(
			table.dealer_id,
			table.status,
			table.created_at.desc()
		),
		index('import_requests_assigned_to_idx').on(table.assigned_to),
		index('import_requests_lead_id_idx').on(table.lead_id)
	]
);

export const importStatusEvents = pgTable(
	'import_status_events',
	{
		id: uuid('id').primaryKey().defaultRandom(),
		dealer_id: uuid('dealer_id')
			.notNull()
			.references(() => dealers.id, { onDelete: 'cascade' }),
		import_request_id: uuid('import_request_id')
			.notNull()
			.references(() => importRequests.id, { onDelete: 'cascade' }),
		status: importRequestStatus('status').notNull(),
		label: text('label').notNull(),
		notes: text('notes').notNull().default(''),
		occurred_at: timestamp('occurred_at', { mode: 'string', withTimezone: true })
			.notNull()
			.defaultNow(),
		created_by: uuid('created_by').references(() => profiles.id, { onDelete: 'set null' }),
		created_at: appCreatedAt()
	},
	(table) => [
		index('import_status_events_request_idx').on(table.import_request_id, table.occurred_at.desc()),
		index('import_status_events_created_by_idx').on(table.created_by),
		index('import_status_events_dealer_id_idx').on(table.dealer_id)
	]
);

export const conversations = pgTable(
	'conversations',
	{
		id: uuid('id').primaryKey().defaultRandom(),
		dealer_id: uuid('dealer_id')
			.notNull()
			.references(() => dealers.id, { onDelete: 'cascade' }),
		lead_id: uuid('lead_id').references(() => leads.id, { onDelete: 'set null' }),
		import_request_id: uuid('import_request_id').references(() => importRequests.id, {
			onDelete: 'set null'
		}),
		vehicle_id: uuid('vehicle_id').references(() => vehicles.id, { onDelete: 'set null' }),
		kind: conversationKind('kind').notNull().default('lead'),
		subject: text('subject').notNull().default(''),
		status: conversationStatus('status').notNull().default('open'),
		last_message_at: appTimestamp('last_message_at'),
		created_at: appCreatedAt(),
		updated_at: appUpdatedAt()
	},
	(table) => [
		unique('conversations_id_dealer_id_key').on(table.id, table.dealer_id),
		index('conversations_dealer_status_idx').on(
			table.dealer_id,
			table.status,
			table.last_message_at.desc()
		),
		index('conversations_import_request_id_idx').on(table.import_request_id),
		index('conversations_lead_id_idx').on(table.lead_id),
		index('conversations_vehicle_id_idx').on(table.vehicle_id)
	]
);

export const conversationMembers = pgTable(
	'conversation_members',
	{
		id: uuid('id').primaryKey().defaultRandom(),
		conversation_id: uuid('conversation_id')
			.notNull()
			.references(() => conversations.id, { onDelete: 'cascade' }),
		profile_id: uuid('profile_id').references(() => profiles.id, { onDelete: 'cascade' }),
		member_type: memberType('member_type').notNull(),
		display_name: text('display_name').notNull().default(''),
		email: text('email'),
		phone: text('phone'),
		last_read_at: appTimestamp('last_read_at'),
		created_at: appCreatedAt()
	},
	(table) => [
		unique().on(table.conversation_id, table.profile_id),
		check(
			'conversation_members_profile_id_check',
			sql`${table.profile_id} is not null or ${table.member_type} in ('customer', 'system')`
		),
		index('conversation_members_profile_id_idx').on(table.profile_id)
	]
);

export const messages = pgTable(
	'messages',
	{
		id: uuid('id').primaryKey().defaultRandom(),
		dealer_id: uuid('dealer_id')
			.notNull()
			.references(() => dealers.id, { onDelete: 'cascade' }),
		conversation_id: uuid('conversation_id')
			.notNull()
			.references(() => conversations.id, { onDelete: 'cascade' }),
		sender_profile_id: uuid('sender_profile_id').references(() => profiles.id, {
			onDelete: 'set null'
		}),
		sender_type: messageSenderType('sender_type').notNull().default('staff'),
		sender_name: text('sender_name').notNull().default(''),
		body: text('body').notNull().default(''),
		metadata: jsonb('metadata')
			.$type<Json>()
			.notNull()
			.default(sql`'{}'::jsonb`),
		read_at: appTimestamp('read_at'),
		created_at: appCreatedAt()
	},
	(table) => [
		unique('messages_id_dealer_id_key').on(table.id, table.dealer_id),
		foreignKey({
			columns: [table.conversation_id, table.dealer_id],
			foreignColumns: [conversations.id, conversations.dealer_id],
			name: 'messages_conversation_dealer_id_fkey'
		}).onDelete('cascade'),
		index('messages_conversation_created_idx').on(table.conversation_id, table.created_at.desc()),
		index('messages_dealer_id_idx').on(table.dealer_id),
		index('messages_sender_profile_id_idx').on(table.sender_profile_id),
		index('messages_conversation_dealer_id_idx').on(table.conversation_id, table.dealer_id)
	]
);

export const messageAttachments = pgTable(
	'message_attachments',
	{
		id: uuid('id').primaryKey().defaultRandom(),
		dealer_id: uuid('dealer_id')
			.notNull()
			.references(() => dealers.id, { onDelete: 'cascade' }),
		message_id: uuid('message_id')
			.notNull()
			.references(() => messages.id, { onDelete: 'cascade' }),
		url: text('url').notNull(),
		storage_path: text('storage_path'),
		file_name: text('file_name').notNull().default(''),
		content_type: text('content_type').notNull().default(''),
		file_size: integer('file_size'),
		created_at: appCreatedAt()
	},
	(table) => [
		check(
			'message_attachments_file_size_check',
			sql`${table.file_size} is null or ${table.file_size} >= 0`
		),
		foreignKey({
			columns: [table.message_id, table.dealer_id],
			foreignColumns: [messages.id, messages.dealer_id],
			name: 'message_attachments_message_dealer_id_fkey'
		}).onDelete('cascade'),
		index('message_attachments_dealer_id_idx').on(table.dealer_id),
		index('message_attachments_message_id_idx').on(table.message_id),
		index('message_attachments_message_dealer_id_idx').on(table.message_id, table.dealer_id)
	]
);

export const rateLimits = pgTable(
	'rate_limits',
	{
		key: text('key').primaryKey(),
		window_start: timestamp('window_start', { mode: 'string', withTimezone: true }).notNull(),
		count: integer('count').notNull(),
		reset_at: timestamp('reset_at', { mode: 'string', withTimezone: true }).notNull(),
		updated_at: appUpdatedAt()
	},
	(table) => [
		check('rate_limits_count_check', sql`${table.count} >= 0`),
		index('rate_limits_reset_at_idx').on(table.reset_at)
	]
);

export const visitorConversationTokens = pgTable(
	'visitor_conversation_tokens',
	{
		id: uuid('id').primaryKey().defaultRandom(),
		dealer_id: uuid('dealer_id')
			.notNull()
			.references(() => dealers.id, { onDelete: 'cascade' }),
		conversation_id: uuid('conversation_id')
			.notNull()
			.references(() => conversations.id, { onDelete: 'cascade' }),
		token_hash: text('token_hash').notNull().unique(),
		display_name: text('display_name'),
		email: text('email'),
		phone: text('phone'),
		expires_at: timestamp('expires_at', { mode: 'string', withTimezone: true })
			.notNull()
			.default(sql`now() + interval '180 days'`),
		created_at: appCreatedAt(),
		updated_at: appUpdatedAt()
	},
	(table) => [
		index('visitor_conversation_tokens_conversation_idx').on(table.conversation_id),
		index('visitor_conversation_tokens_dealer_idx').on(table.dealer_id),
		index('visitor_conversation_tokens_expires_idx').on(table.expires_at)
	]
);
