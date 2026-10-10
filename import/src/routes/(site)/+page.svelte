<script lang="ts">
	import type { PageProps } from './$types';
	import HomePage from '$lib/components/home/HomePage.svelte';
	let { data }: PageProps = $props();
</script>

<svelte:head>
	<title
		>{data.site.identity.name} — {data.locale === 'en'
			? 'Cars and vehicle sourcing'
			: 'Автомобили и внос по заявка'}</title
	>
	<meta
		name="description"
		content={data.locale === 'en'
			? 'Browse available cars, request an import or discuss selling your vehicle.'
			: 'Разгледай наличните автомобили, заяви внос или обсъди продажбата на своя автомобил.'}
	/>
</svelte:head>
<HomePage {data} />
