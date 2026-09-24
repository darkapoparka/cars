<script lang="ts">
	import { getI18n } from '$lib/locale/context';
	const i18n = getI18n();

	import { daynightSite } from '$lib/data/daynight-site';
	import { page } from '$app/state';
	import { localizedSeo } from '$lib/locale/seo';
	import { localeHref } from '$lib/locale/core';

	const DEFAULT_DESCRIPTION = i18n.t('pattern.59593783ad62', {
		v0: daynightSite.shortName,
		v1: i18n.dealer('city')
	});
	const DEFAULT_OG_IMAGE = '/brand/daynight-og.svg';

	let {
		title,
		description = DEFAULT_DESCRIPTION,
		ogImage = DEFAULT_OG_IMAGE,
		ogType = 'website'
	}: {
		title: string;
		description?: string;
		ogImage?: string;
		ogType?: string;
	} = $props();

	const metadata = $derived(
		localizedSeo(
			i18n.locale,
			page.url.pathname,
			{
				title,
				description: description || DEFAULT_DESCRIPTION
			},
			page.url.searchParams
		)
	);
	const metaDescription = $derived(metadata.description);

	const currentUrl = () => {
		try {
			return page.url ?? null;
		} catch {
			return null;
		}
	};

	const canonical = $derived.by(() => {
		const url = currentUrl();
		return url ? url.origin + url.pathname : '';
	});

	const absoluteImage = $derived.by(() => {
		const url = currentUrl();
		return url ? new URL(i18n.asset(ogImage), url.origin).href : ogImage;
	});

	const isDefaultOg = $derived(ogImage === DEFAULT_OG_IMAGE);
</script>

<svelte:head>
	<link
		rel="alternate"
		hreflang="en"
		href={page.url.origin + localeHref(page.url.pathname, 'en')}
	/>
	<link
		rel="alternate"
		hreflang="bg"
		href={page.url.origin + localeHref(page.url.pathname, 'bg')}
	/>
	<title>{metadata.title}</title>
	<meta name="description" content={metaDescription} />
	{#if canonical}
		<link rel="canonical" href={i18n.href(canonical)} />
	{/if}

	<meta property="og:type" content={ogType} />
	<meta property="og:site_name" content={`${daynightSite.shortName} ${i18n.dealer('city')}`} />
	<meta property="og:locale" content={i18n.locale === 'bg' ? 'bg_BG' : 'en_GB'} />
	<meta property="og:title" content={metadata.title} />
	<meta property="og:description" content={metaDescription} />
	{#if canonical}
		<meta property="og:url" content={canonical} />
	{/if}
	<meta property="og:image" content={absoluteImage} />
	{#if isDefaultOg}
		<meta property="og:image:width" content="1200" />
		<meta property="og:image:height" content="630" />
		<meta property="og:image:type" content="image/png" />
		<meta property="og:image:alt" content={`${daynightSite.shortName} ${i18n.dealer('city')}`} />
	{/if}

	<meta name="twitter:card" content="summary_large_image" />
	<meta name="twitter:title" content={metadata.title} />
	<meta name="twitter:description" content={metaDescription} />
	<meta name="twitter:image" content={absoluteImage} />
</svelte:head>
