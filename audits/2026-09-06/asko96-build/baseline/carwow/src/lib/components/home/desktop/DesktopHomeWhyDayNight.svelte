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
			image: '/assets/images/home-promos/phone-portrait-generated-v7.webp'
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
			label: 'локация в София',
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
							<DesktopBrowseLink href={resolve(campaign.href)} label={campaign.cta} />
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
							'/assets/images/home-promos/kristian-financing-campaign-v1.webp',
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
		gap: clamp(12px, 1.4vw, 18px);
	}

	.daynight-home-campaign-card {
		background: #25292b;
		border-radius: 16px;
		isolation: isolate;
		min-height: clamp(360px, 31vw, 430px);
		overflow: hidden;
		position: relative;
	}

	.daynight-home-campaign-card__media {
		inset: max(46%, 208px) 0 0;
		overflow: hidden;
		position: absolute;
		z-index: -1;
	}

	.daynight-home-campaign-card__media img {
		display: block;
		position: absolute;
		max-width: none;
		object-fit: contain;
		object-position: right bottom;
	}
	.daynight-home-campaign-card--collection .daynight-home-campaign-card__media img {
		width: 110%;
		height: auto;
		right: 0;
		bottom: -4px;
		/* Let the cars meet the card edges, excluding the transparent ground. */
		transform: translate(1.4%, 16.3%);
	}
	.daynight-home-campaign-card--viewing .daynight-home-campaign-card__media {
		inset: 116px 0 0;
	}
	.daynight-home-campaign-card--viewing .daynight-home-campaign-card__media img {
		height: auto;
		width: 85%;
		right: -11%;
		top: 0;
		/* Keep the head beside the action and the shoulders visible below it. */
		transform: translateY(-5%);
	}
	.daynight-home-campaign-card--financing .daynight-home-campaign-card__media img {
		height: auto;
		width: 90%;
		right: 0;
		top: 0;
		/* Crop the paper at the bottom edge; keep the calculator and keys prominent. */
		transform: translate(2.1%, -18.4%);
	}

	.daynight-home-campaign-card__content {
		align-items: flex-start;
		box-sizing: border-box;
		display: flex;
		flex-direction: column;
		padding: clamp(24px, 2.2vw, 32px);
		position: relative;
		width: 100%;
		z-index: 1;
	}

	.daynight-home-campaign-card h2 {
		color: #fff;
		font-size: clamp(25px, 1.7vw, 32px);
		font-weight: 720;
		letter-spacing: -0.03em;
		line-height: 1.08;
		margin: 0 0 10px;
		white-space: nowrap;
	}

	.daynight-home-campaign-card p {
		color: #e5e7eb;
		font-size: clamp(15px, 1vw, 16px);
		font-weight: 400;
		line-height: 1.45;
		margin: 0 0 22px;
		max-width: 34ch;
		min-height: 2.9em;
	}

	@media (max-width: 1350px) {
		.daynight-home-campaign-card--viewing .daynight-home-campaign-card__media img {
			right: -16%;
		}
	}

	@media (max-width: 1120px) {
		.daynight-home-campaign-card__content {
			padding: 24px;
		}

		.daynight-home-campaign-card h2 {
			font-size: 25px;
		}

		.daynight-home-campaign-card p {
			font-size: 15px;
			max-width: 31ch;
		}
	}
</style>
