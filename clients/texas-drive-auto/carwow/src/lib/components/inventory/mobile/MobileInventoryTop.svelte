<script lang="ts">
	import { resolve } from '$app/paths';
	import { MapPin, MessageCircle, PhoneCall, Search } from '@lucide/svelte';
	import { daynightSite } from '$lib/data/daynight-site';
	import type { Mode } from '$lib/types/mobile-inventory';

	let {
		mode,
		query,
		onOpenSearch
	}: {
		mode: Mode;
		query: string;
		onOpenSearch: () => void;
	} = $props();

	const phoneHref = `tel:+359${daynightSite.phone.slice(1)}`;
	const viberHref = `viber://chat?number=%2B359${daynightSite.phone.slice(1)}`;
	const searchLabel = $derived(query.trim() ? `Search: ${query.trim()}` : 'Open search');
</script>

<section class="mobile-inventory-top">
	{#if mode === 'map'}
		<div class="mobile-map-card">
			<div>
				<MapPin size={18} strokeWidth={2.4} />
				<div>
					<strong>{daynightSite.shortName}</strong>
					<span>{daynightSite.location}</span>
				</div>
			</div>
			<div class="mobile-map-card__actions">
				<a class="is-primary" href={resolve('/contact')}>
					<MapPin size={17} strokeWidth={2.4} />
					Map
				</a>
				<a href={phoneHref}>
					<PhoneCall size={17} strokeWidth={2.4} />
					Call
				</a>
				<a href={viberHref}>
					<MessageCircle size={17} strokeWidth={2.4} />
					Viber
				</a>
			</div>
		</div>
	{/if}

	<button
		id="mobile-inventory-search"
		class="mobile-inventory-search"
		type="button"
		aria-label={searchLabel}
		aria-haspopup="dialog"
		onclick={onOpenSearch}
	>
		<span class="mobile-inventory-search__field">
			<span
				class={query
					? 'mobile-inventory-search__label is-filled'
					: 'mobile-inventory-search__label'}
			>
				{query || 'Search vehicles'}
			</span>
			<span class="mobile-inventory-search__icon" aria-hidden="true">
				<Search size={19} strokeWidth={2.55} />
			</span>
		</span>
	</button>
</section>
