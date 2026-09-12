create extension if not exists pgcrypto;

do $$ begin
	create type public.dealer_status as enum ('demo', 'active', 'paused', 'archived');
exception
	when duplicate_object then null;
end $$;

do $$ begin
	create type public.profile_role as enum ('owner', 'admin', 'manager', 'editor', 'sales', 'viewer', 'agency_admin');
exception
	when duplicate_object then null;
end $$;

do $$ begin
	create type public.vehicle_condition as enum ('new', 'used');
exception
	when duplicate_object then null;
end $$;

do $$ begin
	create type public.vehicle_status as enum ('draft', 'published', 'sold', 'archived');
exception
	when duplicate_object then null;
end $$;

do $$ begin
	create type public.post_type as enum ('news', 'blog');
exception
	when duplicate_object then null;
end $$;

do $$ begin
	create type public.post_status as enum ('draft', 'published', 'archived');
exception
	when duplicate_object then null;
end $$;

do $$ begin
	create type public.lead_status as enum ('new', 'in_progress', 'won', 'lost', 'archived');
exception
	when duplicate_object then null;
end $$;

do $$ begin
	create type public.import_request_status as enum (
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
	);
exception
	when duplicate_object then null;
end $$;

do $$ begin
	create type public.conversation_kind as enum ('lead', 'import', 'vehicle', 'support');
exception
	when duplicate_object then null;
end $$;

do $$ begin
	create type public.conversation_status as enum ('open', 'waiting', 'closed', 'archived');
exception
	when duplicate_object then null;
end $$;

do $$ begin
	create type public.message_sender_type as enum ('staff', 'customer', 'system');
exception
	when duplicate_object then null;
end $$;

do $$ begin
	create type public.member_type as enum ('staff', 'customer', 'system');
exception
	when duplicate_object then null;
end $$;

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
	new.updated_at = now();
	return new;
end;
$$;

create or replace function public.uuid_or_null(value text)
returns uuid
language plpgsql
immutable
as $$
begin
	return value::uuid;
exception
	when invalid_text_representation then
		return null;
end;
$$;

create table if not exists public."user" (
	id text primary key,
	name text not null,
	email text not null unique,
	email_verified boolean not null default false,
	image text,
	created_at timestamptz not null default now(),
	updated_at timestamptz not null default now()
);

create table if not exists public."session" (
	id text primary key,
	expires_at timestamptz not null,
	token text not null unique,
	created_at timestamptz not null default now(),
	updated_at timestamptz not null default now(),
	ip_address text,
	user_agent text,
	user_id text not null references public."user"(id) on delete cascade
);

create table if not exists public.account (
	id text primary key,
	account_id text not null,
	provider_id text not null,
	user_id text not null references public."user"(id) on delete cascade,
	access_token text,
	refresh_token text,
	id_token text,
	access_token_expires_at timestamptz,
	refresh_token_expires_at timestamptz,
	scope text,
	password text,
	created_at timestamptz not null default now(),
	updated_at timestamptz not null default now()
);

create table if not exists public.verification (
	id text primary key,
	identifier text not null,
	value text not null,
	expires_at timestamptz not null,
	created_at timestamptz,
	updated_at timestamptz
);

create table if not exists public.dealers (
	id uuid primary key default gen_random_uuid(),
	slug text not null unique,
	name text not null,
	brand_name text not null,
	legal_name text,
	website_url text,
	source_inventory_url text,
	phone text,
	phone_label text,
	email text,
	address text,
	city text,
	country_code text not null default 'BG',
	timezone text not null default 'Europe/Sofia',
	default_locale text not null default 'bg-BG',
	currency_code text not null default 'EUR',
	logo_light_url text,
	logo_dark_url text,
	settings jsonb not null default '{}'::jsonb,
	status public.dealer_status not null default 'demo',
	created_at timestamptz not null default now(),
	updated_at timestamptz not null default now()
);

create table if not exists public.profiles (
	id uuid primary key default gen_random_uuid(),
	auth_user_id text not null unique,
	dealer_id uuid not null references public.dealers(id) on delete restrict,
	email text,
	full_name text,
	role public.profile_role not null default 'viewer',
	phone text,
	avatar_url text,
	last_seen_at timestamptz,
	created_at timestamptz not null default now(),
	updated_at timestamptz not null default now()
);

create table if not exists public.vehicles (
	id uuid primary key default gen_random_uuid(),
	dealer_id uuid not null references public.dealers(id) on delete cascade,
	slug text not null,
	title text not null,
	short_title text not null,
	brand text not null,
	model text not null,
	year integer not null check (year between 1900 and extract(year from now())::integer + 2),
	mileage_value integer not null default 0 check (mileage_value >= 0),
	mileage_text text not null default '',
	fuel text not null default '',
	transmission text not null default '',
	body text not null default '',
	doors integer check (doors is null or doors between 0 and 8),
	engine text not null default '',
	power text not null default '',
	drive text not null default '',
	color text not null default '',
	price integer not null default 0 check (price >= 0),
	price_eur text not null default '',
	price_bgn text not null default '',
	monthly text not null default '',
	condition public.vehicle_condition not null default 'used',
	description text not null default '',
	condition_line text not null default '',
	lot text not null default '',
	source_url text not null default '',
	features text[] not null default '{}'::text[],
	highlights text[] not null default '{}'::text[],
	badges text[] not null default '{}'::text[],
	image text not null default '',
	status public.vehicle_status not null default 'draft',
	published_at timestamptz,
	sold_at timestamptz,
	created_at timestamptz not null default now(),
	updated_at timestamptz not null default now(),
	unique (dealer_id, slug)
);

create table if not exists public.vehicle_photos (
	id uuid primary key default gen_random_uuid(),
	dealer_id uuid not null references public.dealers(id) on delete cascade,
	vehicle_id uuid not null references public.vehicles(id) on delete cascade,
	url text not null,
	storage_path text,
	alt text,
	sort_order integer not null default 0,
	is_cover boolean not null default false,
	created_at timestamptz not null default now(),
	unique (vehicle_id, url)
);

create table if not exists public.posts (
	id uuid primary key default gen_random_uuid(),
	dealer_id uuid not null references public.dealers(id) on delete cascade,
	slug text not null,
	type public.post_type not null default 'blog',
	title text not null,
	excerpt text not null default '',
	body text not null default '',
	cover_url text,
	category text,
	tags text[] not null default '{}'::text[],
	author text not null default '',
	read_minutes integer not null default 3 check (read_minutes > 0),
	published_at timestamptz,
	status public.post_status not null default 'draft',
	created_at timestamptz not null default now(),
	updated_at timestamptz not null default now(),
	unique (dealer_id, slug)
);

create table if not exists public.leads (
	id uuid primary key default gen_random_uuid(),
	dealer_id uuid not null references public.dealers(id) on delete cascade,
	vehicle_id uuid references public.vehicles(id) on delete set null,
	import_request_id uuid,
	customer_name text not null,
	contact text not null,
	email text,
	phone text,
	source text not null default 'website',
	message text not null default '',
	status public.lead_status not null default 'new',
	value integer check (value is null or value >= 0),
	metadata jsonb not null default '{}'::jsonb,
	created_at timestamptz not null default now(),
	updated_at timestamptz not null default now()
);

create table if not exists public.import_requests (
	id uuid primary key default gen_random_uuid(),
	dealer_id uuid not null references public.dealers(id) on delete cascade,
	lead_id uuid references public.leads(id) on delete set null,
	customer_name text not null,
	contact text not null,
	email text,
	phone text,
	origin_country text not null default 'CA',
	destination_country text not null default 'BG',
	desired_make text,
	desired_model text,
	desired_year_min integer,
	desired_year_max integer,
	budget_min integer check (budget_min is null or budget_min >= 0),
	budget_max integer check (budget_max is null or budget_max >= 0),
	fuel text,
	transmission text,
	notes text not null default '',
	status public.import_request_status not null default 'new',
	assigned_to uuid references public.profiles(id) on delete set null,
	metadata jsonb not null default '{}'::jsonb,
	created_at timestamptz not null default now(),
	updated_at timestamptz not null default now(),
	check (
		desired_year_min is null
		or desired_year_max is null
		or desired_year_min <= desired_year_max
	),
	check (budget_min is null or budget_max is null or budget_min <= budget_max)
);

alter table public.leads
	add constraint leads_import_request_id_fkey
	foreign key (import_request_id) references public.import_requests(id) on delete set null;

create table if not exists public.import_status_events (
	id uuid primary key default gen_random_uuid(),
	dealer_id uuid not null references public.dealers(id) on delete cascade,
	import_request_id uuid not null references public.import_requests(id) on delete cascade,
	status public.import_request_status not null,
	label text not null,
	notes text not null default '',
	occurred_at timestamptz not null default now(),
	created_by uuid references public.profiles(id) on delete set null,
	created_at timestamptz not null default now()
);

create table if not exists public.conversations (
	id uuid primary key default gen_random_uuid(),
	dealer_id uuid not null references public.dealers(id) on delete cascade,
	lead_id uuid references public.leads(id) on delete set null,
	import_request_id uuid references public.import_requests(id) on delete set null,
	vehicle_id uuid references public.vehicles(id) on delete set null,
	kind public.conversation_kind not null default 'lead',
	subject text not null default '',
	status public.conversation_status not null default 'open',
	last_message_at timestamptz,
	created_at timestamptz not null default now(),
	updated_at timestamptz not null default now(),
	unique (id, dealer_id)
);

create table if not exists public.conversation_members (
	id uuid primary key default gen_random_uuid(),
	conversation_id uuid not null references public.conversations(id) on delete cascade,
	profile_id uuid references public.profiles(id) on delete cascade,
	member_type public.member_type not null,
	display_name text not null default '',
	email text,
	phone text,
	last_read_at timestamptz,
	created_at timestamptz not null default now(),
	unique (conversation_id, profile_id),
	check (profile_id is not null or member_type in ('customer', 'system'))
);

create table if not exists public.messages (
	id uuid primary key default gen_random_uuid(),
	dealer_id uuid not null references public.dealers(id) on delete cascade,
	conversation_id uuid not null references public.conversations(id) on delete cascade,
	sender_profile_id uuid references public.profiles(id) on delete set null,
	sender_type public.message_sender_type not null default 'staff',
	sender_name text not null default '',
	body text not null default '',
	metadata jsonb not null default '{}'::jsonb,
	read_at timestamptz,
	created_at timestamptz not null default now(),
	unique (id, dealer_id),
	foreign key (conversation_id, dealer_id)
		references public.conversations(id, dealer_id)
		on delete cascade
);

create table if not exists public.message_attachments (
	id uuid primary key default gen_random_uuid(),
	dealer_id uuid not null references public.dealers(id) on delete cascade,
	message_id uuid not null references public.messages(id) on delete cascade,
	url text not null,
	storage_path text,
	file_name text not null default '',
	content_type text not null default '',
	file_size integer check (file_size is null or file_size >= 0),
	created_at timestamptz not null default now(),
	foreign key (message_id, dealer_id)
		references public.messages(id, dealer_id)
		on delete cascade
);

create table if not exists public.rate_limits (
	key text primary key,
	window_start timestamptz not null,
	count integer not null check (count >= 0),
	reset_at timestamptz not null,
	updated_at timestamptz not null default now()
);

create table if not exists public.visitor_conversation_tokens (
	id uuid primary key default gen_random_uuid(),
	dealer_id uuid not null references public.dealers(id) on delete cascade,
	conversation_id uuid not null references public.conversations(id) on delete cascade,
	token_hash text not null unique,
	display_name text,
	email text,
	phone text,
	expires_at timestamptz not null default now() + interval '180 days',
	created_at timestamptz not null default now(),
	updated_at timestamptz not null default now()
);

create index if not exists account_user_id_idx on public.account(user_id);
create index if not exists session_user_id_idx on public."session"(user_id);
create index if not exists dealers_slug_idx on public.dealers(slug);
create index if not exists profiles_auth_user_id_idx on public.profiles(auth_user_id);
create index if not exists profiles_dealer_id_idx on public.profiles(dealer_id);
create index if not exists vehicles_dealer_status_idx on public.vehicles(dealer_id, status);
create index if not exists vehicles_dealer_brand_idx on public.vehicles(dealer_id, brand);
create index if not exists vehicles_features_gin_idx on public.vehicles using gin(features);
create unique index if not exists vehicles_dealer_lot_unique_idx
	on public.vehicles(dealer_id, lot)
	where lot <> '';
create index if not exists vehicle_photos_vehicle_sort_idx on public.vehicle_photos(vehicle_id, sort_order);
create index if not exists vehicle_photos_dealer_id_idx on public.vehicle_photos(dealer_id);
create index if not exists posts_dealer_status_idx on public.posts(dealer_id, status, published_at desc);
create index if not exists leads_dealer_status_idx on public.leads(dealer_id, status, created_at desc);
create index if not exists leads_import_request_id_idx on public.leads(import_request_id);
create index if not exists leads_vehicle_id_idx on public.leads(vehicle_id);
create index if not exists import_requests_dealer_status_idx on public.import_requests(dealer_id, status, created_at desc);
create index if not exists import_requests_assigned_to_idx on public.import_requests(assigned_to);
create index if not exists import_requests_lead_id_idx on public.import_requests(lead_id);
create index if not exists import_status_events_request_idx on public.import_status_events(import_request_id, occurred_at desc);
create index if not exists import_status_events_created_by_idx on public.import_status_events(created_by);
create index if not exists import_status_events_dealer_id_idx on public.import_status_events(dealer_id);
create index if not exists conversations_dealer_status_idx on public.conversations(dealer_id, status, last_message_at desc);
create index if not exists conversations_import_request_id_idx on public.conversations(import_request_id);
create index if not exists conversations_lead_id_idx on public.conversations(lead_id);
create index if not exists conversations_vehicle_id_idx on public.conversations(vehicle_id);
create index if not exists conversation_members_profile_id_idx on public.conversation_members(profile_id);
create index if not exists messages_conversation_created_idx on public.messages(conversation_id, created_at desc);
create index if not exists messages_dealer_id_idx on public.messages(dealer_id);
create index if not exists messages_sender_profile_id_idx on public.messages(sender_profile_id);
create index if not exists messages_conversation_dealer_id_idx on public.messages(conversation_id, dealer_id);
create index if not exists message_attachments_dealer_id_idx on public.message_attachments(dealer_id);
create index if not exists message_attachments_message_id_idx on public.message_attachments(message_id);
create index if not exists message_attachments_message_dealer_id_idx on public.message_attachments(message_id, dealer_id);
create index if not exists rate_limits_reset_at_idx on public.rate_limits(reset_at);
create index if not exists visitor_conversation_tokens_conversation_idx
	on public.visitor_conversation_tokens(conversation_id);
create index if not exists visitor_conversation_tokens_dealer_idx
	on public.visitor_conversation_tokens(dealer_id);
create index if not exists visitor_conversation_tokens_expires_idx
	on public.visitor_conversation_tokens(expires_at);

drop trigger if exists set_user_updated_at on public."user";
create trigger set_user_updated_at
	before update on public."user"
	for each row execute function public.set_updated_at();

drop trigger if exists set_session_updated_at on public."session";
create trigger set_session_updated_at
	before update on public."session"
	for each row execute function public.set_updated_at();

drop trigger if exists set_account_updated_at on public.account;
create trigger set_account_updated_at
	before update on public.account
	for each row execute function public.set_updated_at();

drop trigger if exists set_verification_updated_at on public.verification;
create trigger set_verification_updated_at
	before update on public.verification
	for each row execute function public.set_updated_at();

drop trigger if exists set_dealers_updated_at on public.dealers;
create trigger set_dealers_updated_at
	before update on public.dealers
	for each row execute function public.set_updated_at();

drop trigger if exists set_profiles_updated_at on public.profiles;
create trigger set_profiles_updated_at
	before update on public.profiles
	for each row execute function public.set_updated_at();

drop trigger if exists set_vehicles_updated_at on public.vehicles;
create trigger set_vehicles_updated_at
	before update on public.vehicles
	for each row execute function public.set_updated_at();

drop trigger if exists set_posts_updated_at on public.posts;
create trigger set_posts_updated_at
	before update on public.posts
	for each row execute function public.set_updated_at();

drop trigger if exists set_leads_updated_at on public.leads;
create trigger set_leads_updated_at
	before update on public.leads
	for each row execute function public.set_updated_at();

drop trigger if exists set_import_requests_updated_at on public.import_requests;
create trigger set_import_requests_updated_at
	before update on public.import_requests
	for each row execute function public.set_updated_at();

drop trigger if exists set_conversations_updated_at on public.conversations;
create trigger set_conversations_updated_at
	before update on public.conversations
	for each row execute function public.set_updated_at();

drop trigger if exists set_rate_limits_updated_at on public.rate_limits;
create trigger set_rate_limits_updated_at
	before update on public.rate_limits
	for each row execute function public.set_updated_at();

drop trigger if exists set_visitor_conversation_tokens_updated_at
	on public.visitor_conversation_tokens;
create trigger set_visitor_conversation_tokens_updated_at
	before update on public.visitor_conversation_tokens
	for each row execute function public.set_updated_at();
