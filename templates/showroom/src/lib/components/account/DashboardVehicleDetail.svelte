<script lang="ts">
	import { resolve } from '$app/paths';
	import {
		ArrowLeft,
		Calendar,
		Fuel,
		Gauge,
		GitCompare,
		Heart,
		MapPin,
		MessageSquare,
		ShieldCheck
	} from '@lucide/svelte';
	import type { Vehicle } from '$lib/data/vehicles';

	let { vehicle }: { vehicle: Vehicle } = $props();

	const specs = $derived([
		{ icon: Calendar, label: 'Year', value: String(vehicle.year) },
		{ icon: Gauge, label: 'Mileage', value: `${vehicle.mileage.toLocaleString('fr-FR')} km` },
		{ icon: Fuel, label: 'Fuel', value: vehicle.fuel },
		{ icon: GitCompare, label: 'Transmission', value: vehicle.transmission },
		{ icon: MapPin, label: 'Location', value: vehicle.location },
		{ icon: ShieldCheck, label: 'Stock', value: vehicle.stockNumber }
	]);
</script>

<section class="dash-grid gap-4" data-eliqauto-dashboard-vehicle={vehicle.slug}>
	<div class="flex flex-wrap items-center justify-between gap-3">
		<a href={resolve('/account/favorites')} class="dash-secondary-button">
			<ArrowLeft size={16} strokeWidth={2.1} aria-hidden="true" />
			Back to Favorites
		</a>
		<div class="flex flex-wrap gap-2">
			<a href={resolve('/account/compare')} class="dash-secondary-button">
				<GitCompare size={16} strokeWidth={2.1} aria-hidden="true" />
				Compare
			</a>
			<a href={resolve('/account/messages')} class="dash-primary-button">
				<MessageSquare size={16} strokeWidth={2.1} aria-hidden="true" />
				Message Team
			</a>
		</div>
	</div>

	<div class="dash-card overflow-hidden">
		<div class="grid gap-0 xl:grid-cols-[minmax(0,1.25fr)_minmax(320px,0.75fr)]">
			<div class="relative min-h-72 bg-[#fff8f8]">
				<img src={vehicle.image} alt={vehicle.title} class="h-full min-h-72 w-full object-cover" />
				<span
					class="absolute top-4 left-4 rounded-full bg-[var(--dash-primary)] px-3 py-1 text-xs font-black text-white"
				>
					{vehicle.tag}
				</span>
			</div>
			<div class="grid content-between gap-6 p-6">
				<div>
					<p class="dash-kicker">{vehicle.brand}</p>
					<h2 class="m-0 text-2xl leading-tight font-black text-[var(--dash-heading)]">
						{vehicle.title}
					</h2>
					<p class="m-0 mt-3 text-2xl font-black text-[var(--dash-primary)]">
						{vehicle.priceLabel}
					</p>
					<p class="m-0 mt-4 text-sm leading-6 font-semibold text-[var(--dash-muted)]">
						{vehicle.description}
					</p>
				</div>
				<div class="flex flex-wrap gap-2">
					<span class="dash-status-pill">
						<Heart size={15} strokeWidth={2.1} fill="currentColor" aria-hidden="true" />
						Saved
					</span>
					<span class="dash-status-pill">{vehicle.condition}</span>
				</div>
			</div>
		</div>
	</div>

	<section class="dash-grid dash-grid--stats" aria-label="Vehicle specs">
		{#each specs as spec (spec.label)}
			{@const Icon = spec.icon}
			<div class="dash-card p-4">
				<div class="flex items-center gap-3">
					<div class="dash-stat-card__icon h-10 w-10">
						<Icon size={18} strokeWidth={2.1} aria-hidden="true" />
					</div>
					<div class="min-w-0">
						<p class="m-0 text-xs font-black text-[var(--dash-muted)] uppercase">
							{spec.label}
						</p>
						<p class="m-0 truncate text-sm font-black text-[var(--dash-heading)]">
							{spec.value}
						</p>
					</div>
				</div>
			</div>
		{/each}
	</section>

	<section class="dash-card">
		<div class="dash-card__head">
			<div>
				<h2 class="dash-card__title">Features</h2>
				<p class="dash-card__subtitle">Equipment and review notes kept inside the dashboard.</p>
			</div>
		</div>
		<div class="dash-card__body">
			<div class="dash-checkbox-grid md:grid-cols-2 xl:grid-cols-3">
				{#each vehicle.features.slice(0, 12) as feature (feature)}
					<span class="dash-check">
						<ShieldCheck size={15} strokeWidth={2.1} aria-hidden="true" />
						{feature}
					</span>
				{/each}
			</div>
		</div>
	</section>
</section>
