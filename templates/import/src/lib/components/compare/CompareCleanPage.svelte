<script lang="ts">
	import { resolve } from '$app/paths';
	import { Plus, Repeat2, X } from '@lucide/svelte';
	import { SvelteSet } from 'svelte/reactivity';
	import { compareRowsFromVehicles, type AuxeroCompareVehicle } from '$lib/auxero/compare';
	import type { HomeFiveFooterData, HomeFiveHeaderData } from '$lib/auxero/home-five';
	import type { Locale } from '$lib/i18n/messages';
	import CleanSiteFooter from '$lib/components/layout/CleanSiteFooter.svelte';
	import CleanSiteHeader from '$lib/components/layout/CleanSiteHeader.svelte';

	let {
		footer,
		header,
		locale,
		vehicles
	}: {
		footer: HomeFiveFooterData;
		header: HomeFiveHeaderData;
		locale: Locale;
		vehicles: AuxeroCompareVehicle[];
	} = $props();

	const t = (bg: string, en: string) => (locale === 'bg' ? bg : en);

	// Remove/clear via a removed-slug set, so `selected` stays derived from the
	// prop (no state_referenced_locally) — pure Svelte, no theme runtime.
	const removed = new SvelteSet<string>();
	const selected = $derived(vehicles.filter((vehicle) => !removed.has(vehicle.slug)).slice(0, 4));

	const rows = $derived(compareRowsFromVehicles(selected, locale));
	const specRows = $derived(
		rows.filter(
			(row) => row.icon !== 'Payment.png' && row.icon !== 'VIN.svg' && row.icon !== 'QrCode.svg'
		)
	);
	const priceRow = $derived(rows.find((row) => row.icon === 'Payment.png'));
	const priceBest = $derived(priceRow?.bestIndexes ?? []);

	const removeCar = (slug: string) => {
		removed.add(slug);
	};
	const clearAll = () => {
		for (const vehicle of vehicles) removed.add(vehicle.slug);
	};
	const isCutout = (image: string) => image.includes('cutout');
</script>

<div class="min-h-screen bg-bc-bg font-bc-body text-bc-ink antialiased">
	<CleanSiteHeader {header} />

	<main class="mx-auto w-full max-w-[1200px] px-4 pb-24">
		<!-- Hero -->
		<section
			class="relative mb-8 overflow-hidden rounded-bc-section bg-[linear-gradient(135deg,#1C1C1C_0%,#1C1C1C_58%,#1C1C1C_100%)] px-9 py-8 ring-1 ring-white/10"
		>
			<p class="m-0 mb-2 text-xs font-extrabold tracking-wide text-bc-accent-bright-soft uppercase">
				{t('Сравнение', 'Compare')}
			</p>
			<h1 class="m-0 mb-3 max-w-xl text-bc-h2 font-semibold text-white">
				{t('Сравни автомобили от Day Night Auto', 'Compare Day Night Auto vehicles')}
			</h1>
			<p class="m-0 max-w-xl text-base leading-6 font-medium text-white/75">
				{t(
					'Прегледай цена, пробег, история, оборудване и наличност в една ясна таблица.',
					'Review price, mileage, history, equipment and availability in one clear table.'
				)}
			</p>
			<a
				href={resolve('/inventory')}
				class="mt-6 inline-flex min-h-[44px] items-center gap-2 rounded-bc-md border border-bc-accent bg-bc-accent px-5 text-sm font-bold text-bc-accent-contrast no-underline transition-colors hover:border-white hover:bg-white"
			>
				{t('Добави автомобили', 'Add vehicles')}
				<span aria-hidden="true">→</span>
			</a>
		</section>

		<!-- Manager -->
		<div
			class="mb-3.5 flex flex-wrap items-center justify-between gap-4 rounded-bc-md border border-bc-border bg-white px-4 py-3.5"
		>
			<div class="grid gap-0.5">
				<p class="m-0 text-xs font-extrabold tracking-wide text-bc-muted uppercase">
					{t('Управление на сравнението', 'Compare manager')}
				</p>
				<strong class="text-lg leading-6 font-bold text-bc-accent-contrast">
					{selected.length}
					{selected.length === 1 ? t('автомобил', 'vehicle') : t('автомобила', 'vehicles')}
				</strong>
			</div>
			<div
				class="flex items-center gap-2.5 max-[374px]:w-full max-[374px]:flex-wrap max-[374px]:justify-end"
			>
				<span class="text-[13px] font-bold whitespace-nowrap text-bc-muted">
					{t('до 4 автомобила', 'up to 4 vehicles')}
				</span>
				<button
					type="button"
					disabled={selected.length === 0}
					onclick={clearAll}
					class="inline-flex min-h-[40px] items-center rounded-bc-md border border-bc-border bg-white px-3.5 text-[13px] font-bold text-bc-ink-soft transition-colors hover:border-bc-surface-hover hover:bg-bc-surface-hover hover:text-bc-accent-contrast disabled:cursor-default disabled:opacity-45"
				>
					{t('Изчисти', 'Clear')}
				</button>
				<a
					href={resolve('/inventory')}
					class="inline-flex min-h-[40px] items-center gap-1.5 rounded-bc-md border border-bc-accent bg-bc-accent px-3.5 text-[13px] font-bold text-bc-accent-contrast no-underline transition-colors hover:border-bc-accent-contrast hover:bg-bc-accent-contrast hover:text-white"
				>
					<Plus size={16} strokeWidth={2.4} aria-hidden="true" />
					{t('Добави автомобил', 'Add vehicle')}
				</a>
			</div>
		</div>

		<!-- Table / empty state -->
		<div class="overflow-hidden rounded-bc-md border border-bc-border bg-white">
			{#if selected.length === 0}
				<div
					class="flex min-h-[280px] flex-col items-center justify-center gap-2.5 px-6 py-12 text-center"
				>
					<span
						class="inline-flex h-14 w-14 items-center justify-center rounded-full bg-bc-accent-soft text-bc-accent-contrast"
					>
						<Plus size={26} strokeWidth={2.2} aria-hidden="true" />
					</span>
					<strong class="text-[19px] font-bold text-bc-accent-contrast">
						{t('Все още няма избрани автомобили', 'No vehicles selected yet')}
					</strong>
					<span class="max-w-sm text-sm font-medium text-bc-muted">
						{t(
							'Добави до 4 автомобила, за да ги сравниш един до друг.',
							'Add up to 4 vehicles to compare side by side.'
						)}
					</span>
					<a
						href={resolve('/inventory')}
						class="mt-1.5 inline-flex min-h-[44px] items-center gap-2 rounded-bc-md border border-bc-accent bg-bc-accent px-[18px] text-sm font-bold text-bc-accent-contrast no-underline transition-colors hover:border-bc-accent-contrast hover:bg-bc-accent-contrast hover:text-white"
					>
						<Plus size={17} strokeWidth={2.4} aria-hidden="true" />
						{t('Добави автомобил', 'Add vehicle')}
					</a>
				</div>
			{:else}
				<table class="w-full table-fixed border-collapse">
					<colgroup>
						<col style="width: 18%" />
						{#each selected as vehicle (vehicle.slug)}
							<col style={`width: ${82 / selected.length}%`} />
						{/each}
					</colgroup>
					<tbody>
						<!-- Car header row -->
						<tr class="border-b border-bc-border">
							<td class="px-4 py-5 align-bottom">
								<div class="flex flex-col gap-1.5">
									<strong class="text-[15px] leading-5 font-bold text-bc-accent-contrast">
										{selected.length}
										{selected.length === 1
											? t('автомобил', 'вehicle')
											: t('автомобила', 'vehicles')}
									</strong>
									<span class="text-[13px] leading-[18px] text-bc-muted">
										{t('Еднаквите параметри са в сиво.', 'Matching specs are dimmed.')}
									</span>
								</div>
							</td>
							{#each selected as vehicle (vehicle.slug)}
								<td class="border-l border-bc-border/60 px-4 pt-5 pb-4 align-bottom">
									<div class="relative flex flex-col items-center text-center">
										<button
											type="button"
											aria-label={`${t('Премахни', 'Remove')} ${vehicle.title}`}
											title={`${t('Премахни', 'Remove')} ${vehicle.title}`}
											onclick={() => removeCar(vehicle.slug)}
											class="absolute top-2 right-2 z-10 inline-flex h-9 w-9 items-center justify-center rounded-full border border-bc-border bg-white text-bc-ink transition-colors hover:border-bc-accent-contrast hover:bg-bc-accent-contrast hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-bc-accent"
										>
											<X size={14} strokeWidth={2.35} aria-hidden="true" />
										</button>
										<div
											class={[
												'flex aspect-[16/9] w-full items-center justify-center overflow-hidden rounded-bc-md border border-bc-border bg-bc-card-media',
												isCutout(vehicle.image) && 'p-2.5'
											]}
										>
											<img
												src={vehicle.image}
												alt={vehicle.title}
												loading="lazy"
												decoding="async"
												class={[
													'h-full w-full',
													isCutout(vehicle.image) ? 'object-contain' : 'object-cover'
												]}
											/>
										</div>
										<span
											class="mt-3.5 w-fit rounded-full bg-bc-accent-soft px-2.5 py-0.5 text-[11px] font-extrabold tracking-wider text-[#B9161C] uppercase"
										>
											{vehicle.brand}
										</span>
										<a
											href={resolve('/inventory/[slug]', { slug: vehicle.slug })}
											class="mt-0.5 line-clamp-2 min-h-12 text-[17px] leading-6 font-semibold text-bc-accent-contrast no-underline hover:text-[#B9161C]"
										>
											{vehicle.title}
										</a>
										<a
											href={resolve('/inventory')}
											class="mt-3 inline-flex w-fit items-center gap-1.5 rounded-full border border-bc-border bg-white px-3.5 py-1.5 text-xs font-bold text-bc-ink-soft no-underline transition-colors hover:border-bc-accent hover:bg-bc-surface-hover hover:text-bc-accent-contrast"
										>
											<Repeat2 size={14} strokeWidth={2.5} aria-hidden="true" />
											{t('Смени', 'Change')}
										</a>
									</div>
								</td>
							{/each}
						</tr>

						<!-- Spec rows -->
						{#each specRows as row (row.label)}
							{@const allSame = selected.length > 1 && new Set(row.values).size === 1}
							<tr class="border-b border-bc-border/70">
								<td class="bg-white px-4 py-3.5">
									<div class="flex items-center gap-2">
										<img
											src={`/assets/icons/${row.icon}`}
											alt={row.alt}
											class="h-[18px] w-[18px] opacity-70"
										/>
										<span class="text-sm leading-5 font-semibold text-bc-ink-soft">{row.label}</span
										>
									</div>
								</td>
								{#each row.values as value, index (`${row.label}-${index}`)}
									{@const isBest = (row.bestIndexes ?? []).includes(index)}
									<td
										class={[
											'border-l border-bc-border/50 px-4 py-3.5 text-center align-middle',
											isBest && 'bg-bc-accent-soft',
											allSame && !isBest && 'text-bc-muted'
										]}
									>
										<div class="flex flex-col items-center gap-1">
											<span>{value}</span>
											{#if isBest && row.badge}
												<span
													class="rounded-full bg-bc-accent px-2 py-0.5 text-[10px] font-extrabold tracking-wide text-bc-accent-contrast uppercase"
												>
													{row.badge}
												</span>
											{/if}
										</div>
									</td>
								{/each}
							</tr>
						{/each}

						<!-- Verdict row -->
						{#if priceRow}
							<tr>
								<td class="bg-white px-4 py-4">
									<span class="text-[15px] font-bold text-bc-accent-contrast"
										>{t('Цена', 'Price')}</span
									>
								</td>
								{#each selected as vehicle, index (`price-${vehicle.slug}`)}
									{@const isBest = priceBest.includes(index)}
									<td
										class={[
											'border-l border-bc-border/50 px-4 py-4 align-middle',
											isBest && 'bg-bc-accent-soft'
										]}
									>
										<div class="flex flex-col items-center gap-2">
											{#if isBest && priceRow.badge}
												<span
													class="rounded-full bg-bc-accent px-2 py-0.5 text-[10px] font-extrabold tracking-wide text-bc-accent-contrast uppercase"
												>
													{priceRow.badge}
												</span>
											{/if}
											<strong class="text-xl leading-7 font-bold whitespace-nowrap text-bc-ink">
												{vehicle.priceLabel}
											</strong>
											<a
												href={resolve('/inventory/[slug]', { slug: vehicle.slug })}
												class="inline-flex min-h-[40px] items-center justify-center gap-1.5 rounded-bc-md border border-bc-accent bg-bc-accent px-[18px] text-sm font-bold text-bc-accent-contrast no-underline transition-colors hover:border-bc-accent-contrast hover:bg-bc-accent-contrast hover:text-white"
											>
												{t('Виж детайли', 'View details')}
												<span aria-hidden="true">→</span>
											</a>
										</div>
									</td>
								{/each}
							</tr>
						{/if}
					</tbody>
				</table>
			{/if}
		</div>

		<p class="mt-4 text-center text-xs font-semibold tracking-wide text-bc-muted uppercase">
			{t(
				'Чист Svelte 5 + Tailwind v4 — без Auxero тема, без !important',
				'Clean Svelte 5 + Tailwind v4 — no Auxero theme, zero !important'
			)}
		</p>
	</main>

	<CleanSiteFooter {footer} />
</div>
