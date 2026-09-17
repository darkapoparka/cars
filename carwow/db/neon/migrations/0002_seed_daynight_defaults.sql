insert into public.dealers (
	slug,
	name,
	brand_name,
	legal_name,
	website_url,
	phone,
	phone_label,
	email,
	address,
	city,
	country_code,
	timezone,
	default_locale,
	currency_code,
	status,
	settings
)
values (
	'daynight-auto',
	'Day Night Auto Group',
	'Day Night Auto Group',
	'Day Night Auto Group',
	'https://daynight.mobile.bg',
	null,
	null,
	null,
	null,
	'Plovdiv',
	'BG',
	'Europe/Sofia',
	'bg-BG',
	'EUR',
	'active',
	'{"feeds":{"public":true},"feedExports":{"carsBgCsv":true,"mobileBgXml":true}}'::jsonb
)
on conflict (slug) do update
set
	name = excluded.name,
	brand_name = excluded.brand_name,
	legal_name = excluded.legal_name,
	website_url = excluded.website_url,
	city = excluded.city,
	status = excluded.status,
	settings = public.dealers.settings || excluded.settings;
