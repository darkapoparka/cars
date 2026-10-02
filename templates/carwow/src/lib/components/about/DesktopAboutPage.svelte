<script lang="ts">
	import { getI18n } from '$lib/locale/context';
	const i18n = getI18n();

	import DesktopBrowseLink from '$lib/components/shared/DesktopBrowseLink.svelte';
	import '$lib/styles/desktop-page-frame.css';
	import {
		ArrowRight,
		Phone,
		MapPin,
		CarFront,
		ArrowLeftRight,
		FileCheck2,
		Clock3
	} from '@lucide/svelte';
	import { resolve } from '$app/paths';
	import DesktopYellowRouteHero from '$lib/components/layout/DesktopYellowRouteHero.svelte';
	import DesktopTeamCard from '$lib/components/team/DesktopTeamCard.svelte';
	import LazyMapEmbed from '$lib/components/shared/map/LazyMapEmbed.svelte';
	import { daynightSite } from '$lib/data/daynight-site';
	import { daynightTeam, daynightTeamDisclosure } from '$lib/data/daynight-team';
	import { youtubeChannelUrl } from '$lib/data/daynight-videos';
	const brands = [
		{ brand: 'Audi', image: 'audi' },
		{ brand: 'BMW', image: 'bmw' },
		{ brand: 'Chevrolet', image: 'chevrolet' },
		{ brand: 'Chrysler', image: 'chrysler' },
		{ brand: 'Citroen', image: 'citroen' },
		{ brand: 'Ford', image: 'ford' },
		{ brand: 'Honda', image: 'honda' },
		{ brand: 'Jaguar', image: 'jaguar' },
		{ brand: 'Land Rover', image: 'land-rover' },
		{ brand: 'Mazda', image: 'mazda' },
		{ brand: 'Opel', image: 'opel' },
		{ brand: 'Peugeot', image: 'peugeot' },
		{ brand: 'Porsche', image: 'porsche' },
		{ brand: 'Skoda', image: 'skoda' },
		{ brand: 'VW', image: 'volkswagen' },
		{ brand: 'Volvo', image: 'volvo' }
	] as const;
	const support = [
		{
			title: i18n.t('copy.d305ebd80044'),
			icon: CarFront,
			description: i18n.t('copy.7be7c320b9a6'),
			href: '/inventory',
			action: 'Виж автомобилите'
		},
		{
			title: i18n.t('copy.6fa7eed90f10'),
			icon: ArrowLeftRight,
			description: i18n.t('copy.d3586a08b233'),
			href: '/sell-your-car',
			action: 'Продай или замени'
		},
		{
			title: i18n.t('copy.3a71741a7f89'),
			icon: FileCheck2,
			description: i18n.t('copy.bc4b92300580'),
			href: '/services',
			action: 'Разгледай услугите'
		}
	] as const;

	const teamMembers = daynightTeam.slice(0, 4);
	const mapEmbedSrc = daynightSite.mapEmbedSrc;
	let mapVisible = $state(false);
</script>

<main id="main-content" tabindex="-1" class="about-page">
	<DesktopYellowRouteHero
		headingId="daynight-about-title"
		title={i18n.t('pattern.558d5da46c92', { v0: daynightSite.shortName })}
		deckLayout="segmented"
	>
		<div class="about-hero-panel">
			<nav
				class="about-hero-contact desktop-hero-controls"
				aria-label={i18n.t('copy.3618c24ea260')}
			>
				<a href={i18n.href(daynightSite.phoneHref)}
					><Phone size={18} aria-hidden="true" />{daynightSite.phoneLabel}</a
				>
				<div class="about-hero-socials">
					<a
						href="https://www.facebook.com/61566304063141/"
						target="_blank"
						rel="noopener noreferrer"
						aria-label={i18n.t('copy.d41f5b4977ee')}
					>
						<img
							src={i18n.asset(resolve('/assets/icons/input-facebook.svg'))}
							alt=""
							width="24"
							height="24"
						/>
					</a>
					<a
						href="https://www.instagram.com/daynight.auto.plovdiv/"
						target="_blank"
						rel="noopener noreferrer"
						aria-label={i18n.t('copy.bad57ef7837c')}
					>
						<img
							src={i18n.asset(resolve('/assets/icons/input-instagram.svg'))}
							alt=""
							width="24"
							height="24"
						/>
					</a>
					<a
						href={i18n.href(youtubeChannelUrl)}
						target="_blank"
						rel="noopener noreferrer"
						aria-label={i18n.t('copy.fb7accfff8c6')}
					>
						<img
							src={i18n.asset(resolve('/assets/icons/youtube-footer.svg'))}
							alt=""
							width="22"
							height="22"
						/>
					</a>
				</div>
			</nav>
			<div class="about-hero-body desktop-hero-panel-body">
				<div class="about-hero-details">
					<a
						class="about-hero-location"
						href={i18n.href(daynightSite.mapUrl)}
						target="_blank"
						rel="noopener noreferrer"
					>
						<MapPin size={18} aria-hidden="true" />{i18n.dealer('locationShort')}
					</a>
					<span class="about-hero-hours">{i18n.text(daynightSite.hoursLabel)}</span>
				</div>
				<div class="about-hero-actions">
					<a class="sa-cta sa-cta-primary" href={i18n.href(resolve('/contact'))}
						>{i18n.t('copy.d117eaf5db9d')} <ArrowRight size={18} aria-hidden="true" /></a
					>
					<a class="about-hero-browse" href={i18n.href(resolve('/inventory'))}
						>{i18n.t('copy.f20a4411e8d6')} <ArrowRight size={18} aria-hidden="true" /></a
					>
				</div>
			</div>
		</div>
	</DesktopYellowRouteHero>

	<section class="about-section about-team" aria-labelledby="about-team-title">
		<div class="about-container">
			<div class="about-section-heading">
				<h2 id="about-team-title">{i18n.t('copy.f92fc966857c')}</h2>
				<DesktopBrowseLink href={i18n.href(resolve('/team'))} label={i18n.t('copy.4815fed6958b')} />
			</div>
			<p class="about-team-intro">{i18n.t('about.desktop.intro')}</p>
			<div class="about-team-grid">
				{#each teamMembers as member (member.slug)}
					<DesktopTeamCard {member} />
				{/each}
			</div>
			<div class="about-social-row">
				<p class="about-demo-label">{i18n.text(daynightTeamDisclosure)}</p>
				<a class="about-reviews-link about-text-link" href={i18n.href(resolve('/reviews'))}
					>{i18n.t('copy.93b3d88de23a')} <ArrowRight size={18} /></a
				>
			</div>
		</div>
	</section>

	<section class="about-section" aria-labelledby="about-brands-title">
		<div class="about-container">
			<div class="about-section-heading about-section-heading--centered">
				<h2 id="about-brands-title">{i18n.t('copy.6381cc76ef70')}</h2>
			</div>
			<div class="about-brands">
				{#each brands.slice(0, 15) as brand (brand.brand)}
					<a href={i18n.href(resolve(`/inventory?brand=${encodeURIComponent(brand.brand)}`))}>
						<img
							src={i18n.asset(resolve(`/assets/images/brand/mobile/${brand.image}.svg`))}
							alt=""
							width="36"
							height="28"
							loading="lazy"
						/>
						<span>{brand.brand}</span>
					</a>
				{/each}
				<a class="about-brands-all" href={i18n.href(resolve('/inventory'))}>
					<ArrowRight size={24} aria-hidden="true" />
					<span>{i18n.t('copy.8666797b13d9')}</span>
				</a>
			</div>
		</div>
	</section>

	<section class="about-section about-support" aria-labelledby="about-support-title">
		<div class="about-container">
			<div class="about-section-heading">
				<h2 id="about-support-title">{i18n.t('copy.634ff4b2bcec')}</h2>
			</div>
			<div class="about-support-grid">
				{#each support as item (item.href)}
					<a class="about-support-card" href={i18n.href(resolve(item.href))}>
						<item.icon size={24} strokeWidth={2} aria-hidden="true" />
						<h3>{i18n.text(item.title)}</h3>
						<p title={i18n.text(item.description)}>{i18n.text(item.description)}</p>
						<span class="about-support-action"
							>{i18n.text(item.action)}<ArrowRight size={18} aria-hidden="true" /></span
						>
					</a>
				{/each}
			</div>
		</div>
	</section>

	<section class="about-visit" aria-labelledby="about-visit-title">
		<div class="about-container about-visit__banner">
			<div class="about-visit__copy">
				<h2 id="about-visit-title">
					{i18n.t('copy.6743c626ebbe')}<br />{i18n.t('copy.3a7eae8de6f0')}
				</h2>
				<address class="about-visit-address">
					<MapPin size={20} aria-hidden="true" /><span>{i18n.dealer('address')}</span>
				</address>
				<div class="about-visit-hours">
					<Clock3 size={20} aria-hidden="true" />
					<div><strong>{i18n.text(daynightSite.hoursLabel)}</strong></div>
				</div>
				<a class="sa-cta sa-cta-primary" href={i18n.href(resolve('/contact'))}
					>{i18n.t('copy.d117eaf5db9d')} <ArrowRight size={18} /></a
				>
			</div>
			<div class="about-visit__map">
				{#if mapVisible}
					<LazyMapEmbed
						src={i18n.asset(mapEmbedSrc)}
						title={i18n.t('pattern.69c703e84da6', {
							v0: daynightSite.shortName,
							v1: i18n.dealer('city')
						})}
						height="280"
					/>
				{:else}
					<button class="about-map-preview" onclick={() => (mapVisible = true)}>
						<MapPin size={36} aria-hidden="true" />
						<strong>{i18n.t('copy.ccfa430a19e9')} {i18n.dealer('city')}</strong>
						<span>{i18n.t('copy.da1cb832975e')} <ArrowRight size={18} aria-hidden="true" /></span>
					</button>
				{/if}
				<a
					href={i18n.href(daynightSite.mapUrl)}
					target="_blank"
					rel="noopener"
					class="about-map-link"
					><MapPin size={18} />{i18n.t('copy.a097cde80791')} <ArrowRight size={18} /></a
				>
			</div>
		</div>
	</section>
</main>

<style>
	.about-hero-panel {
		display: grid;
		padding: 0;
	}

	.about-hero-body {
		display: grid;
		align-content: center;
		gap: 12px;
	}
	.about-hero-details {
		display: grid;
		justify-items: center;
		gap: 4px;
	}
	.about-page .about-hero-location {
		display: inline-flex;
		align-items: center;
		gap: 8px;
		color: #fff;
		font: var(--sa-weight-semibold) var(--sa-text-base)/1.35 var(--sa-font);
	}
	.about-hero-location:hover {
		text-decoration: underline;
		text-underline-offset: 4px;
	}
	.about-hero-hours {
		color: var(--desktop-hero-copy);
		font: var(--sa-weight-regular) var(--sa-text-caption)/1.4 var(--sa-font);
	}
	.about-hero-actions {
		display: flex;
		justify-content: center;
		gap: 12px;
	}
	.about-hero-actions > a {
		--sa-cta-height: 44px;
		display: inline-flex;
		align-items: center;
		justify-content: center;
		gap: 12px;
		min-width: 0;
		min-height: 44px;
		padding: 0 16px;
		border: 1px solid transparent;
		border-radius: 8px;
		font: var(--sa-weight-semibold) var(--sa-text-base)/1.3 var(--sa-font);
		white-space: nowrap;
	}
	.about-page .about-hero-browse {
		border-color: #858d93;
		background: transparent;
		color: #fff;
		transition:
			background-color 140ms ease,
			border-color 140ms ease,
			color 140ms ease;
	}
	.about-page .about-hero-browse:hover {
		border-color: #fff;
		background: #fff;
		color: var(--desktop-action);
	}

	.about-hero-contact {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 12px;
		padding: 0 12px;
	}

	.about-page .about-hero-contact a {
		display: inline-flex;
		min-height: var(--desktop-hero-tab-height);
		align-items: center;
		justify-content: center;
		gap: 8px;
		border: 0;
		border-radius: 0;
		background: transparent;
		color: #fff;
		font: var(--sa-weight-medium) var(--sa-text-body-sm)/1.2 var(--sa-font);
		padding: 0 12px;
	}

	.about-hero-contact > a:hover,
	.about-hero-contact > a:focus-visible,
	.about-hero-socials a:hover,
	.about-hero-socials a:focus-visible {
		background: #4b5256;
	}
	.about-hero-contact a:focus-visible {
		outline-offset: -4px !important;
	}

	.about-hero-socials {
		display: flex;
		gap: 0;
	}

	.about-page .about-hero-socials a {
		width: var(--desktop-hero-tab-height);
		padding: 0;
	}

	.about-hero-socials :global(img) {
		width: 18px;
		height: 18px;
		object-fit: contain;
		filter: brightness(0) invert(1);
	}
	.about-social-row {
		display: flex;
		justify-content: space-between;
		align-items: center;
		gap: 16px;
		margin-top: 16px;
	}
	.about-page {
		background: var(--desktop-canvas);
		color: var(--sa-ink);
		font-family: var(--sa-font);
	}
	.about-page a {
		text-decoration: none;
		color: inherit;
	}
	.about-page :global(svg),
	.about-page :global(svg *) {
		stroke: currentColor !important;
	}
	.about-container {
		width: var(--desktop-content-width);
		max-width: var(--desktop-content-max);
		margin-inline: auto;
	}
	.about-section {
		padding: var(--sa-desktop-section-y-sm) 0;
	}
	.about-page h2 {
		font: var(--sa-weight-strong) var(--sa-heading-section)/1.15 var(--sa-font);
		letter-spacing: -0.8px;
		color: var(--sa-ink);
		margin: 0;
	}
	.about-page p {
		font: var(--sa-weight-regular) var(--sa-text-lg)/1.5 var(--sa-font);
		color: var(--sa-ink);
		margin: 20px 0 0;
	}
	.about-text-link {
		display: inline-flex;
		align-items: center;
		gap: 12px;
		font: var(--sa-weight-semibold) var(--sa-text-base)/1.4 var(--sa-font);
		min-height: 44px;
	}
	.about-section-heading {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 24px;
		margin-bottom: 24px;
	}
	.about-section-heading--centered {
		justify-content: center;
		text-align: center;
	}
	.about-team {
		padding-top: var(--sa-desktop-section-y-md);
		padding-bottom: 12px;
	}
	.about-team-grid {
		display: grid;
		grid-template-columns: repeat(4, minmax(0, 1fr));
		gap: 20px;
	}
	.about-page .about-team-intro {
		margin: -12px 0 24px;
		font: var(--sa-weight-regular) var(--sa-text-base)/1.5 var(--sa-font);
		color: var(--sa-muted);
	}
	.about-page .about-demo-label {
		margin: 0;
		font: var(--sa-weight-regular) var(--sa-text-caption)/1.45 var(--sa-font);
		color: var(--sa-muted);
	}
	.about-social-row > a {
		flex: none;
	}
	.about-reviews-link {
		margin-top: 0;
	}
	.about-support-grid {
		display: grid;
		grid-template-columns: repeat(3, minmax(0, 1fr));
		gap: 20px;
	}
	.about-brands {
		display: grid;
		grid-template-columns: repeat(8, minmax(0, 1fr));
		gap: 12px;
	}
	.about-brands a {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		text-align: center;
		gap: 8px;
		border-radius: 12px;
		background: var(--desktop-panel);
		border: 1px solid var(--desktop-control-border);
		padding: 12px 8px;
		min-height: 96px;
		font: var(--sa-button-font-weight) var(--sa-text-caption)/1.4 var(--sa-font);
	}
	.about-brands img {
		width: 36px;
		height: 28px;
		object-fit: contain;
	}
	.about-brands a:hover {
		background: var(--desktop-secondary-hover);
	}
	.about-brands .about-brands-all {
		background: var(--sa-yellow);
		border-color: var(--sa-yellow);
		color: var(--desktop-action);
	}
	.about-brands .about-brands-all:hover {
		background: color-mix(in srgb, var(--sa-yellow) 92%, var(--desktop-action));
		border-color: color-mix(in srgb, var(--sa-yellow) 92%, var(--desktop-action));
	}
	.about-support-card {
		display: flex;
		flex-direction: column;
		align-items: flex-start;
		border-radius: 12px;
		background: var(--desktop-panel);
		border: 1px solid var(--desktop-control-border);
		padding: 20px;
	}
	.about-support-card h3 {
		font: var(--sa-weight-semibold) var(--sa-text-lg)/1.3 var(--sa-font);
		color: var(--sa-ink);
		margin: 12px 0 0;
	}
	.about-support-card p {
		font: var(--sa-weight-regular) var(--sa-text-caption)/1.5 var(--sa-font);
		color: var(--sa-muted);
		margin: 8px 0 16px;
		flex: 1;
		display: -webkit-box;
		-webkit-box-orient: vertical;
		-webkit-line-clamp: 2;
		line-clamp: 2;
		overflow: hidden;
	}
	.about-support-action {
		display: inline-flex;
		align-items: center;
		gap: 12px;
		font: var(--sa-button-font-weight) var(--sa-button-font-size) / var(--sa-button-line-height)
			var(--sa-font);
		margin-top: auto;
		color: var(--sa-ink);
	}
	.about-page .about-support-card:hover {
		border-color: var(--discovery-border-hover);
		color: var(--sa-ink);
	}
	.about-support-card:is(:hover, :focus-visible) .about-support-action {
		text-decoration: underline;
		text-underline-offset: 4px;
	}
	.about-support {
		padding-bottom: 48px;
	}
	.about-text-link:hover {
		text-decoration: underline;
		text-underline-offset: 4px;
	}
	.about-page :is(a, button):focus-visible {
		outline: 2px solid var(--desktop-focus);
		outline-offset: 3px;
	}
	.about-visit {
		padding: 8px 0 64px;
	}
	.about-visit__banner {
		display: grid;
		grid-template-columns: 1fr 1.1fr;
		align-items: center;
		background: var(--sa-yellow);
		border-radius: 12px;
		overflow: hidden;
	}
	.about-visit__copy {
		padding: 40px;
	}
	.about-visit__copy .sa-cta {
		margin-top: 24px;
	}
	.about-visit-address,
	.about-visit-hours {
		display: flex;
		align-items: flex-start;
		gap: 12px;
		font: var(--sa-weight-regular) var(--sa-text-base)/1.5 var(--sa-font);
		margin-top: 24px;
	}
	.about-visit-address :global(svg),
	.about-visit-hours :global(svg) {
		flex-shrink: 0;
		margin-top: 2px;
	}
	.about-visit-hours {
		margin-top: 16px;
	}
	.about-visit-hours strong {
		display: block;
		font: inherit;
	}
	.about-visit-hours strong {
		font-weight: var(--sa-weight-heading);
	}
	.about-visit__map {
		padding: 24px 24px 24px 0;
		min-width: 0;
	}
	.about-visit__map :global(.lazy-map-embed) {
		background: #e9ecee;
		border-radius: 10px 10px 0 0;
		overflow: hidden;
	}
	.about-map-preview {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		gap: 16px;
		width: 100%;
		min-height: 280px;
		padding: 24px;
		border: 0;
		border-radius: 10px 10px 0 0;
		background: #25292b;
		color: #fff;
		cursor: pointer;
		font: var(--sa-weight-semibold) var(--sa-text-lg)/1.4 var(--sa-font);
	}
	.about-map-preview strong {
		font: inherit;
		color: inherit;
	}
	.about-map-preview span {
		display: inline-flex;
		align-items: center;
		gap: 8px;
		color: var(--sa-yellow);
		font: var(--sa-weight-semibold) var(--sa-text-base)/1.4 var(--sa-font);
	}
	.about-map-preview:hover {
		background: #343a3d;
	}
	.about-map-link {
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 10px;
		background: #fff;
		min-height: 48px;
		font: var(--sa-weight-semibold) var(--sa-text-base)/1.4 var(--sa-font);
		border-radius: 0 0 10px 10px;
	}
	.about-map-link:hover {
		background: var(--desktop-secondary-hover);
	}
	@media (max-width: 991px) {
		.about-page {
			display: none;
		}
	}
</style>
