<script lang="ts">
	import { getI18n } from '$lib/locale/context';
	const i18n = getI18n();

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
	const searchLabel = $derived(
		query.trim() ? i18n.t('pattern.769c3ae47eea', { v0: query.trim() }) : 'Отвори търсене'
	);
</script>

<section class="mobile-inventory-top">
	{#if mode === 'map'}
		<div class="mobile-map-card">
			<div>
				<MapPin size={18} strokeWidth={2.4} />
				<div>
					<strong>{daynightSite.shortName}</strong>
					<span>{i18n.dealer('address')}</span>
				</div>
			</div>
			<div class="mobile-map-card__actions">
				<a
					class="is-primary"
					href={i18n.href(daynightSite.mapUrl)}
					target="_blank"
					rel="noopener noreferrer"
				>
					<MapPin size={17} strokeWidth={2.4} />
					{i18n.t('copy.2751c9100018')}
				</a>
				<a href={i18n.href(phoneHref)}>
					<PhoneCall size={17} strokeWidth={2.4} />
					{i18n.t('copy.d40e5119596a')}
				</a>
				<a href={i18n.href(viberHref)}>
					<MessageCircle size={17} strokeWidth={2.4} />
					{i18n.t('copy.2db2c27ad99b')}
				</a>
			</div>
		</div>
	{/if}

	<div class="mobile-inventory-toolbar">
		<button
			id="mobile-inventory-search"
			class="mobile-inventory-search"
			type="button"
			aria-label={i18n.text(searchLabel)}
			aria-haspopup="dialog"
			onclick={onOpenSearch}
		>
			<span class="mobile-inventory-search__field">
				<span
					class={query
						? 'mobile-inventory-search__label is-filled'
						: 'mobile-inventory-search__label'}
				>
					{query || i18n.t('copy.ec1da1ebf306')}
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
			aria-label={activeFilterCount
				? i18n.t('copy.96494f4159ef') + activeFilterCount + i18n.t('copy.91313b277ed8')
				: i18n.t('copy.182fd6b7e7e5')}
			title={i18n.t('copy.182fd6b7e7e5')}
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
			aria-label={i18n.t('copy.6fb79ad30738') + i18n.text(sortLabel)}
			title={i18n.t('copy.6fb79ad30738') + i18n.text(sortLabel)}
			aria-haspopup="dialog"
			onclick={onOpenSort}
		>
			<ArrowUpDown size={22} strokeWidth={2} aria-hidden="true" />
		</button>
	</div>
</section>
