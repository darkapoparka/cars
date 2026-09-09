<script lang="ts">
	import { page } from '$app/state';

	const DEFAULT_DESCRIPTION =
		'Promosale Varna предлага проверени автомобили, финансиране и съдействие при покупка във Варна.';
	const DEFAULT_OG_IMAGE = '/brand/daynight-og.svg';

	let {
		title,
		description = DEFAULT_DESCRIPTION,
		ogImage = DEFAULT_OG_IMAGE
	}: {
		title: string;
		description?: string;
		ogImage?: string;
	} = $props();

	const metaDescription = $derived(description || DEFAULT_DESCRIPTION);
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
		return url ? new URL(ogImage, url.origin).href : ogImage;
	});
</script>

<svelte:head>
	<title>{title}</title>
	<meta name="description" content={metaDescription} />
	{#if canonical}
		<link rel="canonical" href={canonical} />
	{/if}

	<meta property="og:type" content="website" />
	<meta property="og:site_name" content="Promosale Varna Варна" />
	<meta property="og:locale" content="bg_BG" />
	<meta property="og:title" content={title} />
	<meta property="og:description" content={metaDescription} />
	{#if canonical}
		<meta property="og:url" content={canonical} />
	{/if}
	<meta property="og:image" content={absoluteImage} />
	<meta property="og:image:width" content="1200" />
	<meta property="og:image:height" content="630" />
	<meta property="og:image:type" content="image/png" />
	<meta property="og:image:alt" content="Promosale Varna Варна" />

	<meta name="twitter:card" content="summary_large_image" />
	<meta name="twitter:title" content={title} />
	<meta name="twitter:description" content={metaDescription} />
	<meta name="twitter:image" content={absoluteImage} />
</svelte:head>
