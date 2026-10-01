<script lang="ts">
	import { page } from '$app/state';
	import ChevronDown from '@lucide/svelte/icons/chevron-down';
	import type { AuxeroAccountListingsData } from '$lib/auxero/account-listings';
	import Action from '$lib/components/common/Action.svelte';
	import SearchField from '$lib/components/common/SearchField.svelte';
	import { assetHref } from '$lib/utils/assets';

	let { listings }: { listings: AuxeroAccountListingsData } = $props();
	let query = $state('');
	let order = $state('newest');
	const english = $derived(page.data.locale === 'en');
	const copy = $derived(
		english
			? {
					search: 'Search your cars',
					sort: 'Sort your cars',
					newest: 'Newest',
					oldest: 'Oldest',
					edit: 'Edit',
					message: 'Message',
					price: 'Expected price',
					mileage: 'Mileage',
					empty: 'No cars submitted yet',
					noMatch: 'No matching cars',
					clear: 'Clear search',
					count: 'cars',
					singular: 'car'
				}
			: {
					search: 'Търси автомобил',
					sort: 'Подреди автомобилите',
					newest: 'Най-нови',
					oldest: 'Най-стари',
					edit: 'Редактирай',
					message: 'Съобщение',
					price: 'Очаквана цена',
					mileage: 'Пробег',
					empty: 'Все още няма подадени автомобили',
					noMatch: 'Няма намерени автомобили',
					clear: 'Изчисти търсенето',
					count: 'автомобила',
					singular: 'автомобил'
				}
	);
	const translations: Record<string, string> = {
		Чернова: 'Draft',
		Публикувана: 'Published',
		'В преглед': 'In review',
		Подадена: 'Submitted',
		'По запитване': 'On request',
		'Оценка на клиентско BMW': 'Client BMW evaluation',
		'Заявка за замяна': 'Trade-in review request',
		'Заявката е в опашка за преглед.': 'Vehicle submission queued for review.',
		'Клиентският автомобил е подаден с VIN, снимки и сервизна история за преглед.':
			'Client vehicle submitted with VIN, photos and service history for review.',
		'Клиентът пита дали Day Night Auto може да подготви директна оферта или обява.':
			'Customer asked whether Day Night Auto can prepare a direct offer or client listing.'
	};
	const display = (value: string) =>
		english ? (translations[value] ?? value.replace(/^Град: /, 'City: ')) : value;
	const hasValue = (value?: string) =>
		Boolean(value && !/^(On request|По запитване|—)$/i.test(value));
	const accountHref = (href: string) =>
		english ? `${href}${href.includes('?') ? '&' : '?'}lang=en` : href;
	const matching = $derived.by(() => {
		const keyword = query.trim().toLocaleLowerCase(english ? 'en' : 'bg');
		return listings.rows
			.filter((row) =>
				[display(row.title), display(row.description), row.titleMeta, ...row.columns.map(display)]
					.join(' ')
					.toLocaleLowerCase(english ? 'en' : 'bg')
					.includes(keyword)
			)
			.toSorted(
				(left, right) =>
					(left.createdAt ?? '').localeCompare(right.createdAt ?? '') *
					(order === 'oldest' ? 1 : -1)
			);
	});
</script>

<section class="mobile-account-listings" data-mobile-account-listings>
	<form role="search" onsubmit={(event) => event.preventDefault()}>
		<SearchField bind:value={query} label={copy.search} controls="mobile-account-cars" />
	</form>
	<div class="mobile-account-listings__toolbar">
		<p role="status">{matching.length} {matching.length === 1 ? copy.singular : copy.count}</p>
		<div class="mobile-account-listings__sort">
			<select aria-label={copy.sort} bind:value={order}>
				<option value="newest">{copy.newest}</option>
				<option value="oldest">{copy.oldest}</option>
			</select>
			<ChevronDown size={16} aria-hidden="true" />
		</div>
	</div>
	<div class="mobile-account-listings__cards" id="mobile-account-cars">
		{#each matching as row (row.id)}
			<article class="mobile-account-car" data-mobile-submission-id={row.id}>
				{#if row.image && row.image !== '/assets/images/dashboard/car.svg'}
					<img
						class="mobile-account-car__image"
						src={assetHref(row.image)}
						alt={display(row.title)}
						loading="lazy"
					/>
				{/if}
				<header>
					<h2>{display(row.title)}</h2>
					<span class="mobile-account-car__status">{display(row.columns[3] ?? '')}</span>
				</header>
				{#if row.description}<p class="mobile-account-car__description">
						{display(row.description)}
					</p>{/if}
				{#if hasValue(row.titleMeta) && row.titleMeta !== row.title}
					<p class="mobile-account-car__reference">{row.titleMeta}</p>
				{/if}
				{#if hasValue(row.columns[1]) || hasValue(row.columns[2])}
					<dl>
						{#if hasValue(row.columns[1])}<div>
								<dt>{copy.price}</dt>
								<dd>{display(row.columns[1])}</dd>
							</div>{/if}
						{#if hasValue(row.columns[2])}<div>
								<dt>{copy.mileage}</dt>
								<dd>{display(row.columns[2])}</dd>
							</div>{/if}
					</dl>
				{/if}
				<div class="mobile-account-car__actions">
					{#each row.actions as action (action.kind)}
						{#if action.href && (action.kind === 'edit-submission' || action.kind === 'message')}
							<Action
								href={accountHref(action.href)}
								variant={action.kind === 'edit-submission' ? 'secondary' : 'quiet'}
								size="compact"
								aria-label={action.kind === 'edit-submission'
									? `${copy.edit} ${display(row.title)}`
									: `${copy.message} ${display(row.title)}`}
							>
								{action.kind === 'edit-submission' ? copy.edit : copy.message}
							</Action>
						{/if}
					{/each}
				</div>
			</article>
		{:else}
			<div class="mobile-account-listings__empty">
				<p>{query ? copy.noMatch : copy.empty}</p>
				{#if query}<Action variant="quiet" onclick={() => (query = '')}>{copy.clear}</Action>{/if}
			</div>
		{/each}
	</div>
</section>

<style>
	.mobile-account-listings {
		color: var(--bc-ink);
		font-family: var(--bc-font-body);
	}
	.mobile-account-listings__toolbar {
		display: flex;
		align-items: center;
		justify-content: space-between;
		flex-wrap: wrap;
		gap: var(--bc-space-2);
		margin-block: var(--bc-space-3);
	}
	.mobile-account-listings__toolbar p {
		margin: 0;
		color: var(--bc-copy);
		font: var(--bc-weight-body) var(--bc-mobile-label)/1.4 var(--bc-font-body);
	}
	.mobile-account-listings__toolbar select {
		width: auto;
		max-width: 100%;
		min-height: var(--bc-control-height-standard);
		border: 1px solid var(--bc-border);
		border-radius: var(--bc-radius-pill);
		padding: var(--bc-space-2) var(--bc-space-7) var(--bc-space-2) var(--bc-space-3);
		appearance: none;
		background: var(--bc-white);
		color: var(--bc-ink);
		font: var(--bc-weight-body) var(--bc-mobile-label)/1.4 var(--bc-font-body);
	}
	.mobile-account-listings__sort {
		position: relative;
	}
	.mobile-account-listings__sort :global(svg) {
		position: absolute;
		right: var(--bc-space-3);
		top: 50%;
		transform: translateY(-50%);
		pointer-events: none;
	}
	.mobile-account-listings__cards {
		display: grid;
		gap: var(--bc-space-3);
	}
	.mobile-account-car {
		min-width: 0;
		padding: var(--bc-space-4);
		border: 1px solid var(--bc-border);
		border-radius: var(--bc-radius-card);
		background: var(--bc-white);
		overflow-wrap: anywhere;
	}
	.mobile-account-car__image {
		display: block;
		width: 100%;
		aspect-ratio: 16 / 9;
		object-fit: cover;
		border-radius: var(--bc-radius-control);
		margin-bottom: var(--bc-space-3);
	}
	.mobile-account-car header {
		display: flex;
		align-items: flex-start;
		flex-wrap: wrap;
		gap: var(--bc-space-2);
	}
	.mobile-account-car h2 {
		flex: 1 1 160px;
		margin: 0;
		font: var(--bc-weight-heading) var(--bc-mobile-card-title)/1.35 var(--bc-font-heading);
	}
	.mobile-account-car__status {
		padding: var(--bc-space-1) var(--bc-space-2);
		border-radius: var(--bc-radius-pill);
		background: var(--bc-surface);
		color: var(--bc-copy);
		font: var(--bc-weight-body) var(--bc-mobile-label)/1.25 var(--bc-font-body);
	}
	.mobile-account-car__description,
	.mobile-account-car__reference {
		margin: var(--bc-space-2) 0 0;
		color: var(--bc-copy);
		font: var(--bc-weight-body) var(--bc-mobile-label)/1.4 var(--bc-font-body);
	}
	.mobile-account-car__reference {
		font-size: var(--bc-text-meta);
	}
	.mobile-account-car dl {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(min(100%, 120px), 1fr));
		gap: var(--bc-space-2);
		margin: var(--bc-space-3) 0 0;
	}
	.mobile-account-car dt {
		color: var(--bc-muted);
		font: var(--bc-weight-body) var(--bc-text-meta)/1.4 var(--bc-font-body);
	}
	.mobile-account-car dd {
		margin: var(--bc-space-1) 0 0;
		font: var(--bc-weight-heading) var(--bc-mobile-label)/1.4 var(--bc-font-body);
	}
	.mobile-account-car__actions {
		display: flex;
		flex-wrap: wrap;
		gap: var(--bc-space-2);
		margin-top: var(--bc-space-3);
	}
	.mobile-account-car__actions :global(.site-action) {
		min-height: var(--bc-control-height-standard);
		padding: var(--bc-space-2) var(--bc-space-3);
		font-size: var(--bc-mobile-label);
		white-space: normal;
	}
	.mobile-account-listings__empty {
		padding-block: var(--bc-space-6);
		text-align: center;
	}
	.mobile-account-listings__empty p {
		margin: 0;
		font-size: var(--bc-mobile-card-title);
	}
</style>
