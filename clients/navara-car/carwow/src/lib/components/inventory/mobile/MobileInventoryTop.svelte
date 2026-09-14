<script lang="ts">
	import {
		ArrowUpDown,
		MapPin,
		MessageCircle,
		PhoneCall,
		Search,
		SlidersHorizontal
	} from '@lucide/svelte';
	import { daynightSite } from '$lib/data/daynight-site';
	import type { Mode } from '$lib/types/mobile-inventory';

	let {
		mode,
		query,
		onOpenSearch,
		onOpenFilters,
		onOpenSort,
		activeFilterCount,
		sortLabel,
		sortActive
	}: {
		mode: Mode;
		query: string;
		onOpenSearch: () => void;
		onOpenFilters: () => void;
		onOpenSort: () => void;
		activeFilterCount: number;
		sortLabel: string;
		sortActive: boolean;
	} = $props();

	const phoneHref = daynightSite.phoneHref;
	const viberHref = daynightSite.viberHref;
	const searchLabel = $derived(query.trim() ? `Търсене: ${query.trim()}` : 'Отвори търсене');
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
				<a class="is-primary" href={daynightSite.mapUrl} target="_blank" rel="noopener noreferrer">
					<MapPin size={17} strokeWidth={2.4} />
					Карта
				</a>
				<a href={phoneHref}>
					<PhoneCall size={17} strokeWidth={2.4} />
					Обади се
				</a>
				<a href={viberHref}>
					<MessageCircle size={17} strokeWidth={2.4} />
					Viber
				</a>
			</div>
		</div>
	{/if}

	<div class="mobile-inventory-toolbar">
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
					{query || 'Търси коли'}
				</span>
				<span class="mobile-inventory-search__icon" aria-hidden="true">
					<Search size={19} strokeWidth={2.55} />
				</span>
			</span>
		</button>
		<button
			class="mobile-inventory-tool"
			class:is-active={activeFilterCount > 0}
			type="button"
			aria-label={activeFilterCount ? 'Филтри: ' + activeFilterCount + ' активни' : 'Филтри'}
			title="Филтри"
			aria-haspopup="dialog"
			onclick={onOpenFilters}
		>
			<SlidersHorizontal size={22} strokeWidth={2} aria-hidden="true" />
			{#if activeFilterCount}<span class="mobile-inventory-tool__count" aria-hidden="true"
					>{activeFilterCount}</span
				>{/if}
		</button>
		<button
			class="mobile-inventory-tool"
			class:is-active={sortActive}
			type="button"
			aria-label={'Сортиране: ' + sortLabel}
			title={'Сортиране: ' + sortLabel}
			aria-haspopup="dialog"
			onclick={onOpenSort}
		>
			<ArrowUpDown size={22} strokeWidth={2} aria-hidden="true" />
		</button>
	</div>
</section>
