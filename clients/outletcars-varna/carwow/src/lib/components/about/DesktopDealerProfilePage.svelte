<script lang="ts">
	// Native /about/dealer (dealer profile). Self-contained: no
	// StorefrontTemplateContent wrapper, scoped styles reproduce the shared blend
	// (container/headings/breadcrumb/cards) using --sa-* tokens; dealer-specific
	// layout kept below. Breadcrumb chevrons -> @lucide ChevronRight. Runes only.

	import { resolve } from '$app/paths';
	import { ChevronRight } from '@lucide/svelte';
	import LazyMapEmbed from '$lib/components/shared/map/LazyMapEmbed.svelte';
	import { featuredDayNightVehicles } from '$lib/data/daynight-vehicles';
	import { daynightReviews, daynightReviewDisclosure } from '$lib/data/daynight-reviews';
	import { daynightSite } from '$lib/data/daynight-site';
	import { daynightTeam, daynightTeamDisclosure } from '$lib/data/daynight-team';

	const highlights = [
		'Проверени автомобили с реална наличност',
		'Съдействие за документи, регистрация и финансиране',
		'Бартер, оценка и оглед в доверен сервиз'
	] as const;
	const vehicles = featuredDayNightVehicles.slice(0, 3);
	const reviews = daynightReviews.slice(0, 3);
	const team = daynightTeam.slice(0, 3);
	const mapEmbedSrc = daynightSite.mapEmbedSrc;
	const phoneLinkProps = {
		href: `tel:${daynightSite.phone}`
	} as const;
	const mapLinkProps = {
		href: daynightSite.mapUrl,
		target: '_blank',
		rel: 'noopener'
	} as const;
</script>

<div class="dealer-page">
	<section class="background-light mb-32">
		<div class="container">
			<ul class="breadcrumb">
				<li><a href={resolve('/')}>Начало</a></li>
				<li class="breadcrumb__icon" aria-hidden="true"><ChevronRight size={14} /></li>
				<li><a href={resolve('/about')}>За нас</a></li>
				<li class="breadcrumb__icon" aria-hidden="true"><ChevronRight size={14} /></li>
				<li><span>Профил на OUTLETCARS.BG — Варна</span></li>
			</ul>
		</div>
	</section>

	<section class="dealer-profile-hero pb-80">
		<div class="container">
			<div class="dealer-profile-hero__grid">
				<div class="dealer-profile-hero__content">
					<p class="eyebrow">Проверена автокъща</p>
					<h1>OUTLETCARS.BG — Варна Варна</h1>
					<p class="h7 text-secondary line-height-28 mb-24">
						Автокъща във Варна с подбрани употребявани автомобили, ясна информация за състояние,
						съдействие при документи и практични следващи стъпки след оглед.
					</p>
					<ul class="dealer-profile-hero__highlights">
						{#each highlights as highlight (highlight)}
							<li>
								<img src="/assets/icons/check.svg" alt="" aria-hidden="true" />
								{highlight}
							</li>
						{/each}
					</ul>
					<div class="dealer-profile-hero__actions">
						<a href={resolve('/inventory')} class="sa-cta sa-cta-secondary"> Виж наличните </a>
						<a {...phoneLinkProps} class="sa-cta sa-cta-ghost">
							{daynightSite.phoneLabel}
						</a>
					</div>
				</div>
				<div class="dealer-profile-card">
					<img class="dealer-profile-card__logo" src="/dealer/logo-on-light-v2.svg" alt="" />
					<p class="dealer-profile-card__title mb-6">OUTLETCARS.BG — Варна</p>
					<p class="text-secondary mb-18">{daynightSite.location}</p>
					<a {...mapLinkProps} class="text-highlight">Виж локация</a>
				</div>
			</div>
		</div>
	</section>

	<section class="background-light py-80">
		<div class="container">
			<div class="title-section mb-30">
				<h2>Налични автомобили</h2>
				<a href={resolve('/inventory')} class="sa-cta sa-cta-ghost"> Виж всички </a>
			</div>
			<div class="md-grid-cols-1 grid grid-cols-3 gap-24">
				{#each vehicles as vehicle (vehicle.slug)}
					<a
						href={resolve('/inventory/[slug]', { slug: vehicle.slug })}
						class="dealer-vehicle-card"
					>
						<img src={vehicle.image} alt={vehicle.shortTitle} loading="lazy" decoding="async" />
						<div>
							<p class="dealer-vehicle-card__title mb-8">
								{vehicle.shortTitle}
								{vehicle.year}
							</p>
							<p class="text-secondary mb-10">{vehicle.mileage} · {vehicle.fuel}</p>
							<p class="dealer-vehicle-card__price text-highlight">{vehicle.priceEur}</p>
						</div>
					</a>
				{/each}
			</div>
		</div>
	</section>

	<section class="py-80">
		<div class="container">
			<div class="dealer-about-grid">
				<div>
					<p class="eyebrow">За автокъщата</p>
					<h2>Подреден процес от избора до документите</h2>
					<p class="h7 text-secondary line-height-28 mb-24">
						Екипът помага с сравнение на автомобили, запазване на оглед, проверка на документи,
						регистрация, финансиране и бартер. Фокусът е клиентът да има реална информация преди
						решение, без излишни обещания.
					</p>
					<a href={resolve('/contact')} class="sa-cta sa-cta-primary"> Свържете се </a>
				</div>
				<LazyMapEmbed src={mapEmbedSrc} title="Карта до OUTLETCARS.BG — Варна Варна" height="330" />
			</div>
		</div>
	</section>

	<section class="background-light py-80">
		<div class="container">
			<div class="title-section mb-30">
				<h2>Екип</h2>
				<a href={resolve('/team')} class="sa-cta sa-cta-ghost">Виж екипа</a>
			</div>
			<p class="text-secondary mb-18">{daynightTeamDisclosure}</p>
			<div class="md-grid-cols-1 grid grid-cols-3 gap-24">
				{#each team as member (member.slug)}
					<a href={resolve('/team/[slug]', { slug: member.slug })} class="dealer-team-card">
						<img src={member.image} alt={member.name} loading="lazy" decoding="async" />
						<div>
							<p class="dealer-team-card__name mb-4">{member.name}</p>
							<p class="text-secondary">{member.role}</p>
						</div>
					</a>
				{/each}
			</div>
		</div>
	</section>

	<section class="py-80">
		<div class="container">
			<div class="title-section mb-30">
				<div>
					<h2>Отзиви от клиенти</h2>
					<p class="text-secondary">{daynightReviewDisclosure}</p>
				</div>
				<a href={resolve('/reviews')} class="sa-cta sa-cta-ghost"> Виж всички </a>
			</div>
			<div class="md-grid-cols-1 grid grid-cols-3 gap-24">
				{#each reviews as review (review.id)}
					<article class="dealer-review-card">
						<p class="h7 line-height-28 mb-18">{review.text}</p>
						<strong>{review.name}</strong>
						<span>{review.label}</span>
					</article>
				{/each}
			</div>
		</div>
	</section>
</div>

<style>
	.dealer-page,
	.dealer-page * {
		box-sizing: border-box;
	}

	.dealer-page * {
		margin: 0;
	}

	.dealer-page {
		color: #1c1c1c;
		font-size: 16px;
		font-weight: 400;
		line-height: 26px;
	}

	.dealer-page a {
		text-decoration: none;
	}

	.dealer-page a:not(.sa-cta) {
		color: inherit;
	}

	.dealer-page img {
		display: block;
		max-width: 100%;
	}

	.container {
		width: min(100% - 48px, 1320px);
		max-width: 1440px;
		margin: 0 auto;
		padding: 0 15px;
	}

	.dealer-page h1 {
		color: #111827;
		font-size: clamp(36px, 4vw, 56px);
		font-weight: 700;
		line-height: 1.08;
		text-align: center;
	}

	.dealer-page h2 {
		color: #111827;
		font-size: clamp(32px, 3.2vw, 48px);
		font-weight: 700;
		line-height: 1.08;
	}

	/* Utilities */
	.grid {
		display: grid;
	}

	.grid-cols-3 {
		grid-template-columns: repeat(3, minmax(0, 1fr));
	}

	.gap-24 {
		gap: 24px;
	}

	.mb-4 {
		margin-bottom: 4px;
	}

	.mb-6 {
		margin-bottom: 6px;
	}

	.mb-8 {
		margin-bottom: 8px;
	}

	.mb-10 {
		margin-bottom: 10px;
	}

	.mb-18 {
		margin-bottom: 18px;
	}

	.mb-24 {
		margin-bottom: 24px;
	}

	.mb-30 {
		margin-bottom: 30px;
	}

	.mb-32 {
		margin-bottom: 32px;
	}

	.text-secondary {
		color: #667085;
	}

	.text-highlight {
		color: var(--sa-blue);
	}

	.line-height-28 {
		line-height: 28px;
	}

	.h7 {
		font-size: 18px;
		font-weight: 500;
		line-height: var(--sa-leading-body);
	}

	.eyebrow {
		margin-bottom: 12px;
		color: var(--sa-blue);
		font-size: 13px;
		font-weight: 700;
		line-height: 1;
		text-transform: uppercase;
	}

	.background-light {
		background: #f5f7fb;
	}

	.pb-80 {
		padding-bottom: 80px;
	}

	.py-80 {
		padding-top: 80px;
		padding-bottom: 80px;
	}

	.breadcrumb {
		display: flex;
		min-height: 76px;
		align-items: center;
		flex-wrap: wrap;
		gap: 10px;
		margin: 0;
		padding: 0;
		color: #5f6877;
		font-size: 14px;
		font-weight: 700;
		line-height: 22px;
		list-style: none;
	}

	.breadcrumb a,
	.breadcrumb span {
		font-size: 14px;
		font-weight: 400;
		line-height: 22px;
	}

	.breadcrumb a {
		display: inline-flex;
		min-height: 44px;
		align-items: center;
		color: #1c1c1c;
	}

	.breadcrumb span {
		color: #667085;
	}

	.breadcrumb__icon {
		display: inline-flex;
		align-items: center;
		color: #5f6877;
	}

	.breadcrumb__icon :global(svg) {
		width: 14px;
		height: 14px;
	}

	.title-section {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 24px;
	}

	/* ---- Dealer-specific layout ---- */
	.dealer-profile-hero__grid,
	.dealer-about-grid {
		align-items: center;
		display: grid;
		gap: 48px;
		grid-template-columns: minmax(0, 1.1fr) minmax(280px, 0.9fr);
	}

	.dealer-profile-hero__content h1 {
		margin-bottom: 16px;
		text-align: left;
	}

	.dealer-profile-hero__highlights {
		display: grid;
		gap: 12px;
		margin-bottom: 28px;
	}

	.dealer-profile-hero__highlights li {
		align-items: center;
		display: flex;
		gap: 10px;
		color: #263244;
		font-weight: var(--sa-weight-semibold);
	}

	.dealer-profile-hero__highlights img {
		width: 20px;
		height: 20px;
		flex: 0 0 auto;
	}

	.dealer-profile-hero__actions {
		display: flex;
		flex-wrap: wrap;
		gap: 14px;
	}

	.dealer-profile-card,
	.dealer-vehicle-card,
	.dealer-team-card,
	.dealer-review-card {
		background: #fff;
		border: 1px solid #e5e7eb;
		border-radius: 12px;
		overflow: hidden;
	}

	.dealer-profile-card {
		padding: 42px;
		text-align: center;
	}

	.dealer-profile-card__logo {
		height: 116px;
		margin: 0 auto 20px;
		object-fit: contain;
		width: 116px;
	}

	.dealer-profile-card__title {
		color: #111827;
		font-size: var(--sa-text-xl);
		font-weight: var(--sa-weight-semibold);
		line-height: var(--sa-leading-tight);
	}

	.dealer-vehicle-card img,
	.dealer-team-card img {
		aspect-ratio: 1.45 / 1;
		height: auto;
		object-fit: cover;
		width: 100%;
	}

	.dealer-vehicle-card div,
	.dealer-team-card div,
	.dealer-review-card {
		padding: 20px;
	}

	.dealer-vehicle-card__title,
	.dealer-vehicle-card__price,
	.dealer-team-card__name {
		color: #111827;
		font-size: var(--sa-text-xl);
		font-weight: var(--sa-weight-semibold);
		line-height: var(--sa-leading-snug);
	}

	.dealer-review-card span {
		color: #6b7280;
		display: block;
		font-size: 14px;
		margin-top: 4px;
	}

	@media (max-width: 991px) {
		.container {
			width: calc(100% - 32px);
			padding: 0;
		}
		.pb-80 {
			padding-bottom: 40px;
		}
		.py-80 {
			padding-block: 32px;
		}
		.dealer-profile-hero__grid,
		.dealer-about-grid {
			gap: 24px;
		}
		.dealer-profile-card__logo {
			width: 72px;
			height: 72px;
			margin-bottom: 12px;
		}
		.dealer-vehicle-card,
		.dealer-team-card {
			display: grid;
			grid-template-columns: 96px minmax(0, 1fr);
		}
		.dealer-vehicle-card img,
		.dealer-team-card img {
			height: 100%;
			aspect-ratio: auto;
		}
		.dealer-vehicle-card div,
		.dealer-team-card div,
		.dealer-review-card {
			padding: 12px;
		}
		.dealer-vehicle-card__title,
		.dealer-team-card__name {
			font-size: 18px;
		}
		.gap-24 {
			gap: 16px;
		}

		.dealer-profile-hero__grid,
		.dealer-about-grid {
			grid-template-columns: 1fr;
		}

		.dealer-profile-hero__content h1 {
			font-size: 34px;
			line-height: 1.12;
		}

		.dealer-profile-card {
			padding: 28px;
		}

		.md-grid-cols-1.grid.grid-cols-3 {
			grid-template-columns: 1fr;
		}
	}
</style>
