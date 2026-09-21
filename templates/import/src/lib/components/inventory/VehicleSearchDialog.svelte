<script lang="ts">
	import { assetHref } from '$lib/utils/assets';
	import type { Snippet } from 'svelte';
	import { SvelteURLSearchParams } from 'svelte/reactivity';
	import Search from '@lucide/svelte/icons/search';
	import X from '@lucide/svelte/icons/x';
	import ArrowUpRight from '@lucide/svelte/icons/arrow-up-right';
	import Modal from '$lib/components/common/Modal.svelte';
	import Action from '$lib/components/common/Action.svelte';
	import { imageFallback } from '$lib/browser/image-fallback';
	import { linkHref } from '$lib/utils/links';
	import type { AuxeroInventoryVehicleCard } from '$lib/domain/vehicle-card';
	let {
		open = $bindable(false),
		keyword = $bindable(''),
		searchParams = '',
		english = false,
		filters,
		onclear
	}: {
		open?: boolean;
		keyword?: string;
		searchParams?: string;
		english?: boolean;
		filters?: Snippet;
		onclear?: () => void;
	} = $props();
	const formId = $props.id();
	let input = $state<HTMLInputElement | null>(null);
	let cards = $state<AuxeroInventoryVehicleCard[]>([]);
	let count = $state<number | null>(null);
	let loading = $state(false);
	let failed = $state(false);
	const params = $derived.by(() => {
		const value = new SvelteURLSearchParams(searchParams);
		value.delete('preview');
		value.delete('page');
		if (keyword.trim()) value.set('keyword', keyword.trim());
		else value.delete('keyword');
		value.set('lang', english ? 'en' : 'bg');
		return value;
	});
	const query = $derived(params.toString());
	$effect(() => {
		if (!open) return;
		const currentQuery = query;
		const controller = new AbortController();
		loading = true;
		failed = false;
		count = null;
		const timer = setTimeout(async () => {
			try {
				const response = await fetch(
					linkHref('/api/inventory/count') + '?' + currentQuery + '&preview=1',
					{ signal: controller.signal }
				);
				if (!response.ok) throw new Error('Search unavailable');
				const data = await response.json();
				if (!Number.isInteger(data.count) || data.count < 0 || !Array.isArray(data.cards))
					throw new Error('Invalid search response');
				if (controller.signal.aborted) return;
				count = data.count;
				cards = data.cards;
			} catch {
				if (!controller.signal.aborted) {
					failed = true;
					cards = [];
				}
			} finally {
				if (!controller.signal.aborted) loading = false;
			}
		}, 180);
		return () => {
			clearTimeout(timer);
			controller.abort();
		};
	});
	function focusSearch(event: Event) {
		if (input) {
			event.preventDefault();
			input.focus({ preventScroll: true });
		}
	}
	function clear() {
		keyword = '';
		onclear?.();
		input?.focus({ preventScroll: true });
	}
</script>

<Modal
	bind:open
	title={english ? 'Find a car' : 'Търсене на автомобили'}
	wide
	bodyTone="muted"
	class="vehicle-search-dialog"
	onOpenAutoFocus={focusSearch}
>
	{#snippet headerContent()}
		<div class="vehicle-search__controls">
			<form id={formId} action={linkHref('/inventory')} onsubmit={() => (open = false)}>
				{#each [...params].filter(([name]) => name !== 'keyword') as [name, value], i (i)}
					<input type="hidden" {name} {value} />
				{/each}
				<div class="vehicle-search__input">
					<Search size={22} aria-hidden="true" />
					<label class="sr-only" for={formId + '-query'}
						>{english ? 'Make, model or keyword' : 'Марка, модел или ключова дума'}</label
					>
					<input
						id={formId + '-query'}
						bind:this={input}
						bind:value={keyword}
						name="keyword"
						type="search"
						autocomplete="off"
						placeholder={english
							? 'Search make, model or keyword'
							: 'Търси марка, модел или ключова дума'}
					/>
					{#if keyword}<button
							type="button"
							class="vehicle-search__clear-query"
							aria-label={english ? 'Clear search text' : 'Изчисти търсенето'}
							onclick={() => {
								keyword = '';
								input?.focus();
							}}><X size={20} aria-hidden="true" /></button
						>{/if}
				</div>
			</form>
			{#if filters}<div class="vehicle-search__filters">{@render filters()}</div>{/if}
		</div>
	{/snippet}
	<section
		class="vehicle-search__results"
		aria-label={english ? 'Matching cars' : 'Намерени автомобили'}
		aria-busy={loading}
	>
		{#if failed}
			<div class="vehicle-search__empty" role="status">
				<p>
					{english
						? 'The preview is unavailable. Open the catalogue to see the results.'
						: 'Прегледът не се зареди. Отвори каталога, за да видиш резултатите.'}
				</p>
			</div>
		{:else if count === 0}
			<div class="vehicle-search__empty" role="status">
				<Search size={28} aria-hidden="true" />
				<h3>{english ? 'No matching cars' : 'Няма намерени автомобили'}</h3>
				<p>
					{english
						? 'Change the search or remove a filter.'
						: 'Промени търсенето или премахни филтър.'}
				</p>
				<Action variant="secondary" onclick={clear}
					>{english ? 'Clear filters' : 'Изчисти филтрите'}</Action
				>
			</div>
		{:else if loading && !cards.length}
			<div class="vehicle-search__loading" role="status">{english ? 'Searching…' : 'Търсене…'}</div>
		{:else}
			<ul class:vehicle-search__list--pending={loading}>
				{#each cards as card (card.slug)}
					<li>
						<a
							href={linkHref(
								'/inventory/' + encodeURIComponent(card.slug) + (english ? '?lang=en' : '')
							)}
							onclick={() => (open = false)}
						>
							<img
								use:imageFallback
								src={assetHref(card.image)}
								alt=""
								width="132"
								height="88"
								decoding="async"
							/>
							<span class="vehicle-search__car"
								><strong>{card.title}</strong><span
									>{card.year} · {card.mileageLabel} · {card.fuel}</span
								></span
							>
							<span class="vehicle-search__price">{card.priceLabel}</span><ArrowUpRight
								size={19}
								aria-hidden="true"
							/>
						</a>
					</li>
				{/each}
			</ul>
		{/if}
	</section>
	{#snippet footer()}
		<div class="vehicle-search__actions">
			<Action variant="secondary" onclick={clear}>{english ? 'Clear' : 'Изчисти'}</Action>
			<Action type="submit" form={formId} size="primary">
				<Search size={19} aria-hidden="true" />
				{count === null || loading
					? english
						? 'Show cars'
						: 'Покажи автомобили'
					: (english ? 'Show cars' : 'Покажи автомобили') + ' (' + count + ')'}
			</Action>
		</div>
	{/snippet}
</Modal>

<style>
	/* Keep the focused input and actions stationary as results load or become empty. */
	:global(.vehicle-search-dialog) {
		height: min(800px, calc(100dvh - 48px));
	}
	:global(.vehicle-search-dialog .site-dialog__body) {
		flex: 1;
	}
	.vehicle-search__controls {
		padding: var(--bc-space-3) var(--bc-space-6) var(--bc-space-5);
		background: var(--bc-surface-raised);
	}
	.vehicle-search__input {
		display: flex;
		align-items: center;
		gap: var(--bc-space-3);
		border: 1px solid var(--bc-border-strong);
		border-radius: var(--bc-radius-control);
		padding: 0 var(--bc-space-4);
		color: var(--bc-muted);
		background: var(--bc-surface-raised);
	}
	.vehicle-search__input:focus-within {
		outline: 2px solid var(--bc-focus);
		outline-offset: 2px;
	}
	.vehicle-search__input input {
		flex: 1;
		min-width: 0;
		width: 100%;
		min-height: var(--bc-control-height-hero);
		padding: 0;
		border: 0;
		background: transparent;
		color: var(--bc-ink);
		font-size: var(--bc-text-entry);
		font-weight: var(--bc-weight-control);
	}
	/* The single rounded field owns focus, not the inset input. */
	.vehicle-search__input input:focus-visible {
		outline: none !important;
		box-shadow: none !important;
	}
	.vehicle-search__input input::-webkit-search-cancel-button {
		appearance: none;
	}
	.vehicle-search__clear-query {
		display: grid;
		place-items: center;
		flex: 0 0 var(--bc-control-height-standard);
		height: var(--bc-control-height-standard);
		border: 0;
		border-radius: var(--bc-radius-md);
		background: transparent;
		color: var(--bc-copy);
	}
	.vehicle-search__clear-query:hover {
		background: var(--bc-surface);
	}
	.vehicle-search__filters {
		display: grid;
		grid-template-columns: repeat(4, minmax(0, 1fr));
		gap: var(--bc-space-3);
		margin-top: var(--bc-space-4);
	}
	.vehicle-search__results {
		min-height: 180px;
	}
	ul {
		display: grid;
		gap: var(--bc-space-3);
		margin: 0;
		padding: 0;
		list-style: none;
	}
	.vehicle-search__list--pending {
		opacity: 0.55;
	}
	li a {
		display: flex;
		align-items: center;
		gap: var(--bc-space-4);
		padding: var(--bc-space-3);
		border: 1px solid var(--bc-border);
		border-radius: var(--bc-radius-card);
		background: var(--bc-surface-raised);
		color: var(--bc-ink);
		text-decoration: none;
	}
	li a:hover {
		border-color: var(--bc-border-strong);
		background: var(--bc-surface-soft);
	}
	li img {
		width: 112px;
		height: 72px;
		object-fit: cover;
		flex: 0 0 auto;
		border-radius: var(--bc-radius-md);
		background: var(--bc-card-media);
	}
	.vehicle-search__car {
		display: grid;
		gap: var(--bc-space-1);
		min-width: 0;
		flex: 1;
	}
	.vehicle-search__car strong {
		font-size: var(--bc-text-body-lg);
		line-height: var(--bc-leading-filter);
		font-weight: var(--bc-weight-control);
	}
	.vehicle-search__car > span {
		font-size: var(--bc-text-label);
		color: var(--bc-muted);
	}
	.vehicle-search__price {
		font-size: var(--bc-text-body-lg);
		white-space: nowrap;
	}
	.vehicle-search__actions {
		display: flex;
		justify-content: space-between;
		gap: var(--bc-space-3);
	}
	.vehicle-search__empty,
	.vehicle-search__loading {
		display: grid;
		justify-items: center;
		align-content: center;
		gap: var(--bc-space-3);
		min-height: 240px;
		text-align: center;
		color: var(--bc-copy);
	}
	h3,
	p {
		margin: 0;
	}
	h3 {
		font: var(--bc-weight-heading) var(--bc-text-h4)/1.3 var(--bc-font-heading);
		color: var(--bc-ink);
	}
	@media (max-width: 1000px) {
		.vehicle-search__filters {
			grid-template-columns: repeat(2, minmax(0, 1fr));
		}
	}
	@media (max-width: 599px) {
		.vehicle-search__controls {
			padding-inline: var(--bc-space-4);
		}
		li img {
			width: 80px;
			height: 64px;
		}
		li a {
			flex-wrap: wrap;
		}
		.vehicle-search__car {
			min-width: 55%;
		}
	}
</style>
