<script lang="ts">
	import { resolve } from '$app/paths';
	import { ArrowRight } from '@lucide/svelte';
	import type { HomeFiveVehicleCardData, HomeFiveVehiclePill } from '$lib/auxero/home-five';
	import type { HomePageCopy } from '$lib/i18n/messages';
	import VehicleCardClean from './VehicleCardClean.svelte';

	// Clean Svelte 5 + Tailwind v4 "Newest Vehicles" (Най-нови автомобили) section.
	// Heading row = dark title left + green "View all" CTA right (NOT a dark band),
	// a row of filter pills, then a 4-col desktop grid of VehicleCardClean.
	//
	// Pill behavior matches the live HomeFiveFeaturedVehicles: the pills are LINKS to
	// pre-filtered /inventory views (full hrefs incl. query strings live in the data),
	// not client-side filters of the visible cards. `pill.active` drives the solid
	// active styling. Spec-kind pills are dropped (same as the live `displayedPills`).
	let {
		vehicles,
		pills,
		copy
	}: {
		vehicles: HomeFiveVehicleCardData[];
		pills: HomeFiveVehiclePill[];
		copy: HomePageCopy;
	} = $props();

	const displayedPills = $derived(pills.filter((pill) => pill.kind !== 'spec'));
</script>

{#if vehicles.length}
	<section class="bg-bc-bg py-14 font-bc-body" aria-label={copy.featuredTitle}>
		<div class="bc-container">
			<!-- Heading row: dark title left, green CTA right -->
			<div class="flex flex-wrap items-center justify-between gap-4">
				<h2 class="text-bc-h2 font-semibold text-bc-ink">{copy.featuredTitle}</h2>
				<a
					href={resolve('/inventory')}
					class="inline-flex h-11 shrink-0 items-center gap-2 rounded-bc-md bg-bc-accent px-6 text-[15px] font-semibold text-bc-accent-contrast transition-colors hover:bg-bc-hover-accent"
				>
					{copy.commonCta}
					<ArrowRight size={17} strokeWidth={2.4} aria-hidden="true" />
				</a>
			</div>

			<!-- Filter pills: links to pre-filtered inventory views -->
			{#if displayedPills.length}
				<ul class="mt-6 flex flex-wrap gap-2.5">
					{#each displayedPills as pill (pill.href)}
						<li>
							<a
								href={resolve(pill.href as '/')}
								aria-current={pill.active ? 'true' : undefined}
								class={[
									'flex min-h-11 items-center gap-2 rounded-bc-pill border px-4 text-sm font-medium transition-colors',
									pill.active
										? 'border-bc-accent bg-bc-accent text-bc-accent-contrast'
										: 'border-bc-border bg-bc-surface-soft text-[#B9161C] hover:border-bc-accent hover:bg-bc-accent-soft'
								]}
							>
								{#if pill.image}
									<img
										src={pill.image}
										alt=""
										width="38"
										height="21"
										loading="lazy"
										decoding="async"
										class="h-5 w-auto max-w-[38px] object-contain"
									/>
								{/if}
								<span>{pill.label}</span>
							</a>
						</li>
					{/each}
				</ul>
			{/if}

			<!-- 4-col desktop grid (3 / 2 / 1 below) -->
			<div class="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
				{#each vehicles as vehicle (vehicle.slug)}
					<VehicleCardClean {vehicle} copy={copy.vehicleCard} />
				{/each}
			</div>
		</div>
	</section>
{/if}
