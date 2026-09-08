<script lang="ts">
	import DesktopBrowseLink from '$lib/components/shared/DesktopBrowseLink.svelte';
	import { resolve } from '$app/paths';
	import {
		desktopOnlyImagePlaceholder,
		desktopOnlySizes,
		desktopOnlySrcset
	} from '$lib/utils/desktop-only-assets';
	import { daynightVehicles } from '$lib/data/daynight-vehicles';

	type CampaignVariant = 'single' | 'campaign-grid';

	let {
		showMetrics = true,
		variant = 'single'
	}: { showMetrics?: boolean; variant?: CampaignVariant } = $props();

	const campaigns = [
		{
			id: 'collection',
			title: 'Вижте колекцията',
			copy: 'Разгледайте селекцията и попитайте за наличност.',
			cta: 'Вижте автомобилите',
			href: '/inventory',
			image: '/assets/images/home-promos/gclass-urus-pair-v4.webp'
		},
		{
			id: 'viewing',
			title: 'Запазете оглед',
			copy: 'Изберете автомобил и уговорете удобно посещение.',
			cta: 'Запазете оглед',
			href: '/contact',
			image: '/assets/automarket/vehicle-14-1.webp'
		},
		{
			id: 'financing',
			title: 'Лизинг и замяна',
			copy: 'Попитайте за индивидуални условия за избрания автомобил.',
			cta: 'Поискайте условия',
			href: '/financing',
			image: '/assets/images/home-promos/leasing-calculator-cutout-v7.webp'
		}
	] as const;

	type Metric = {
		id: string;
		value: string;
		suffix?: string;
		label: string;
		decimals?: string;
		hasDivider?: boolean;
	};

	const metrics: Metric[] = [
		{
			id: 'stock',
			value: String(daynightVehicles.length),
			label: 'Налични автомобила',
			hasDivider: true
		},
		{
			id: 'brands',
			value: String(new Set(daynightVehicles.map((vehicle) => vehicle.brand)).size),
			label: 'марки в наличност',
			hasDivider: true
		},
		{
			id: 'location',
			value: '1',
			label: 'локация в Варна',
			hasDivider: true
		},
		{
			id: 'contact',
			value: '4',
			label: 'директни канала за контакт'
		}
	] as const;
</script>

<section class="daynight-home-section daynight-home-section--why">
	<div class="daynight-home-container">
		{#if variant === 'campaign-grid'}
			<div class="daynight-home-campaign-grid" aria-label="Възможности за покупка и контакт">
				{#each campaigns as campaign (campaign.id)}
					<article
						class={`daynight-home-campaign-card daynight-home-campaign-card--${campaign.id}`}
					>
						<div class="daynight-home-campaign-card__media" aria-hidden="true">
							<img
								src={desktopOnlyImagePlaceholder}
								srcset={desktopOnlySrcset(campaign.image, 1536)}
								sizes={desktopOnlySizes('min(420px, calc((100vw - 80px) / 3))')}
								width="1536"
								height="1024"
								alt=""
								loading="lazy"
								decoding="async"
							/>
						</div>

						<div class="daynight-home-campaign-card__content">
							<h2>{campaign.title}</h2>
							<p>{campaign.copy}</p>
							<DesktopBrowseLink
								href={resolve(campaign.href)}
								label={campaign.cta}
								tone={campaign.id === 'collection' ? 'light' : 'dark'}
							/>
						</div>
					</article>
				{/each}
			</div>
		{:else}
			<div class="daynight-home-why">
				<div class="daynight-home-why__media" aria-hidden="true">
					<img
						src={desktopOnlyImagePlaceholder}
						srcset={desktopOnlySrcset(
							'/assets/automarket/vehicle-14-1.webp',
							1800
						)}
						sizes={desktopOnlySizes('min(1320px, calc(100vw - 48px))')}
						width="1800"
						height="400"
						alt=""
					/>
				</div>

				<div class="daynight-home-why__content">
					<h2 class="daynight-home-why__title">Лизинг и замяна</h2>
					<p class="daynight-home-why__copy">
						Попитайте за индивидуални условия според избрания автомобил.
					</p>

					<a href={resolve('/financing')} class="daynight-home-why__cta">
						<span>Поискайте условия</span>
						<svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
							<path
								d="M5 12h14M13 6l6 6-6 6"
								fill="none"
								stroke="currentColor"
								stroke-width="2.4"
							/>
						</svg>
					</a>
				</div>
			</div>
		{/if}

		{#if showMetrics}
			<div class="daynight-home-metrics">
				{#each metrics as metric (metric.id)}
					<div
						class={['daynight-home-metric', metric.hasDivider && 'daynight-home-metric--divided']}
					>
						<div class="daynight-home-metric__content">
							<div class="daynight-home-metric__counter">
								<div class="daynight-home-metric__number">
									<span
										class="daynight-home-metric__value"
										data-to={metric.value}
										data-speed="1500"
										data-decimals={metric.decimals}
										data-inviewport="yes">{metric.value}</span
									>{metric.suffix ?? ''}
								</div>
							</div>
							<p class="daynight-home-metric__label">{metric.label}</p>
						</div>
					</div>
				{/each}
			</div>
		{/if}
	</div>
</section>

<style>
	.daynight-home-campaign-grid {
		display: grid;
		grid-template-columns: repeat(3, minmax(0, 1fr));
		gap: 16px;
	}

	.daynight-home-campaign-card {
		--campaign-ink: #fff;
		--campaign-copy: #e5e7eb;
		--desktop-focus: #fff;
		background: var(--desktop-action);
		border: 1px solid transparent;
		border-radius: 12px;
		box-shadow: none;
		display: grid;
		grid-template-rows: auto minmax(220px, 1fr);
		min-height: 440px;
		overflow: hidden;
		position: relative;
	}
	.daynight-home-campaign-card--viewing {
		--campaign-ink: var(--desktop-action);
		--campaign-copy: var(--desktop-action);
		--desktop-focus: var(--desktop-action);
		background: var(--sa-yellow);
	}
	.daynight-home-campaign-card--financing {
		--campaign-ink: var(--desktop-action);
		--campaign-copy: var(--discovery-muted);
		--desktop-focus: var(--desktop-action);
		background: var(--desktop-panel);
		border-color: var(--desktop-control-border);
	}
	.daynight-home-campaign-card__media {
		grid-row: 2;
		min-width: 0;
		overflow: hidden;
		position: relative;
	}
	.daynight-home-campaign-card__media img {
		display: block;
		position: absolute;
		max-width: none;
		object-fit: contain;
		object-position: right bottom;
	}
	.daynight-home-campaign-card--collection .daynight-home-campaign-card__media img {
		width: 104%;
		height: auto;
		right: 0;
		bottom: -16%;
	}
	.daynight-home-campaign-card--viewing .daynight-home-campaign-card__media img {
		height: 320px;
		width: 320px;
		right: 12px;
		top: 0;
	}
	.daynight-home-campaign-card--financing .daynight-home-campaign-card__media img {
		height: auto;
		width: 88%;
		right: 0;
		top: -16%;
	}
	.daynight-home-campaign-card__content {
		align-items: flex-start;
		box-sizing: border-box;
		display: flex;
		flex-direction: column;
		grid-row: 1;
		padding: 28px 28px 16px;
		position: relative;
		min-width: 0;
	}
	.daynight-home-campaign-card h2 {
		color: var(--campaign-ink);
		font-size: clamp(24px, 1.8vw, 30px);
		font-weight: 700;
		letter-spacing: -0.025em;
		line-height: 1.15;
		margin: 0 0 12px;
		overflow-wrap: break-word;
	}
	.daynight-home-campaign-card p {
		color: var(--campaign-copy);
		font-size: 16px;
		font-weight: 400;
		line-height: 1.5;
		margin: 0 0 20px;
		max-width: 34ch;
		min-height: 3em;
	}
	.daynight-home-campaign-card__content :global(.desktop-browse-link) {
		margin-top: auto;
		max-width: 100%;
		white-space: normal;
	}
	.daynight-home-campaign-card__content :global(.desktop-browse-link svg),
	.daynight-home-campaign-card__content :global(.desktop-browse-link svg *) {
		color: inherit !important;
		stroke: currentColor !important;
	}
	@media (max-width: 1120px) {
		.daynight-home-campaign-card__content {
			padding: 24px 20px 16px;
		}
		.daynight-home-campaign-card--viewing .daynight-home-campaign-card__media img {
			right: -16px;
		}
	}
</style>
