<script lang="ts">
	import { getI18n } from '$lib/locale/context';
	const i18n = getI18n();

	import DesktopBrowseLink from '$lib/components/shared/DesktopBrowseLink.svelte';
	import {
		ArrowRight,
		Phone,
		MapPin,
		CarFront,
		ArrowLeftRight,
		FileCheck2,
		Clock3
	} from '@lucide/svelte';
	import SiteChromeIcon from '$lib/components/layout/SiteChromeIcon.svelte';
	import { resolve } from '$app/paths';
	import DesktopYellowRouteHero from '$lib/components/layout/DesktopYellowRouteHero.svelte';
	import LazyMapEmbed from '$lib/components/shared/map/LazyMapEmbed.svelte';
	import { daynightSite } from '$lib/data/daynight-site';
	import { daynightTeam, daynightTeamDisclosure } from '$lib/data/daynight-team';
	import { youtubeChannelUrl } from '$lib/data/daynight-videos';
	type AssetHref = `/assets/${string}`;
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
	function teamHref(slug: string): `/team/${string}` {
		return `/team/${slug}`;
	}
</script>

<main id="main-content" tabindex="-1" class="about-page">
	<DesktopYellowRouteHero
		headingId="daynight-about-title"
		title={i18n.t('pattern.558d5da46c92', { v0: daynightSite.shortName })}
		panel="light"
		compact
	>
		<div class="about-hero-panel">
			<div class="about-hero-primary">
				<strong>{i18n.t('copy.3667f9f676c2')}</strong>
				<a class="sa-cta sa-cta-primary" href={i18n.href(resolve('/inventory'))}
					>{i18n.t('copy.f20a4411e8d6')}</a
				>
			</div>
			<nav class="about-hero-contact" aria-label={i18n.t('copy.3618c24ea260')}>
				<a href={i18n.href(daynightSite.mapUrl)} target="_blank" rel="noopener noreferrer"
					><MapPin size={18} />{i18n.dealer('locationShort')}</a
				>
				<a href={i18n.href(daynightSite.phoneHref)}><Phone size={18} />{daynightSite.phoneLabel}</a>
				<div class="about-hero-socials">
					<a
						href="https://www.facebook.com/61566304063141/"
						target="_blank"
						rel="noopener noreferrer"
						aria-label={i18n.t('copy.d41f5b4977ee')}><SiteChromeIcon name="facebook" /></a
					>
					<a
						href="https://www.instagram.com/daynight.auto.plovdiv/"
						target="_blank"
						rel="noopener noreferrer"
						aria-label={i18n.t('copy.bad57ef7837c')}><SiteChromeIcon name="instagram" /></a
					>
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
		</div>
	</DesktopYellowRouteHero>

	<section class="about-section about-team" aria-labelledby="about-team-title">
		<div class="about-container">
			<div class="about-section-heading">
				<h2 id="about-team-title">{i18n.t('copy.f92fc966857c')}</h2>
				<DesktopBrowseLink href={i18n.href(resolve('/team'))} label={i18n.t('copy.4815fed6958b')} />
			</div>
			<p class="about-demo-label">{i18n.text(daynightTeamDisclosure)}</p>
			<div class="about-team-grid">
				{#each teamMembers as member (member.slug)}
					<article class="about-team-card">
						<a class="about-team-card__image" href={i18n.href(resolve(teamHref(member.slug)))}
							><img
								src={i18n.asset(resolve(member.image as AssetHref))}
								alt={i18n.t('pattern.141e9e4edaa0', { v0: i18n.text(member.name) })}
								width="500"
								height="500"
								loading="lazy"
							/></a
						>
						<div class="about-team-card__body">
							<h3>
								<a href={i18n.href(resolve(teamHref(member.slug)))}>{i18n.text(member.name)}</a>
							</h3>
							<p class="about-team-card__role">{i18n.text(member.role)}</p>
							<div class="about-team-card__contact">
								<a
									class="about-seller-contact"
									href={i18n.href(`tel:${member.phone}`)}
									aria-label={i18n.t('pattern.83d5aea4691e', { v0: i18n.text(member.role) })}
									><Phone size={18} /></a
								>
							</div>
						</div>
					</article>
				{/each}
			</div>
			<div class="about-social-row">
				<a class="about-reviews-link about-text-link" href={i18n.href(resolve('/reviews'))}
					>{i18n.t('copy.93b3d88de23a')} <ArrowRight size={18} /></a
				>
			</div>
		</div>
	</section>

	<section class="about-section" aria-labelledby="about-story-title">
		<div class="about-container about-story">
			<img
				class="about-story__image"
				src={i18n.asset(resolve('/assets/images/services/service-card-trade-in-daynight-v2.webp'))}
				alt={i18n.t('pattern.52479dcffce2', { v0: daynightSite.shortName })}
				width="1200"
				height="800"
				loading="lazy"
			/>
			<div>
				<h2 id="about-story-title">
					{i18n.t('copy.8e364ad977c2')}<br />{i18n.t('copy.26f103de55d7')}
				</h2>
				<p>
					{daynightSite.shortName}
					{i18n.t('copy.6e5947b6b2ee')}
					{i18n.dealer('city')}{i18n.t('copy.c2bf91e6c61c')}
				</p>
				<p>
					{i18n.t('copy.054350d6d3b9')}
				</p>
				<DesktopBrowseLink
					href={i18n.href(resolve('/contact'))}
					label={i18n.t('copy.0a896165cc28')}
				/>
			</div>
		</div>
	</section>

	<section class="about-section" aria-labelledby="about-brands-title">
		<div class="about-container">
			<div class="about-section-heading">
				<h2 id="about-brands-title">{i18n.t('copy.6381cc76ef70')}</h2>
				<DesktopBrowseLink
					href={i18n.href(resolve('/inventory'))}
					label={i18n.t('copy.8666797b13d9')}
				/>
			</div>
			<div class="about-brands">
				{#each brands as brand (brand.brand)}
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
						<item.icon size={28} strokeWidth={1.8} aria-hidden="true" />
						<h3>{i18n.text(item.title)}</h3>
						<p>{i18n.text(item.description)}</p>
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
		gap: 12px;
		padding: 14px;
	}

	.about-hero-primary {
		display: grid;
		grid-template-columns: minmax(0, 1fr) auto;
		align-items: center;
		gap: 16px;
	}

	.about-hero-primary strong {
		font: var(--sa-weight-semibold) var(--sa-text-lg)/1.35 var(--sa-font);
		text-align: left;
	}

	.about-hero-primary .sa-cta {
		min-width: 190px;
	}

	.about-hero-contact {
		display: grid;
		grid-template-columns: minmax(0, 1fr) minmax(0, 1fr) auto;
		align-items: center;
		gap: 10px;
	}

	.about-hero-contact a {
		display: inline-flex;
		min-height: 44px;
		align-items: center;
		justify-content: center;
		gap: 8px;
		border: 1px solid var(--desktop-control-border);
		border-radius: 8px;
		background: var(--desktop-field);
		color: var(--sa-ink);
		font: var(--sa-button-font-weight) var(--sa-text-caption)/1.35 var(--sa-font);
		padding: 0 12px;
	}

	.about-hero-contact > a:hover,
	.about-hero-contact > a:focus-visible,
	.about-hero-socials a:hover,
	.about-hero-socials a:focus-visible {
		border-color: var(--desktop-secondary-hover);
		background: var(--desktop-secondary-hover);
	}

	.about-hero-socials {
		display: flex;
		gap: 8px;
	}

	.about-hero-socials a {
		width: 44px;
		padding: 0;
		border-radius: 50%;
		background: #fff;
	}

	.about-hero-socials img {
		filter: brightness(0);
	}
	.about-social-row {
		display: flex;
		justify-content: space-between;
		align-items: center;
		gap: 24px;
		margin-top: 24px;
	}
	.about-page {
		background: #f4f5f6;
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
		width: calc(100% - 96px);
		max-width: 1280px;
		margin-inline: auto;
	}
	.about-section {
		padding: 40px 0;
	}
	.about-page h2 {
		font: var(--sa-weight-strong) var(--sa-text-desktop-section-title)/1.1 var(--sa-font);
		letter-spacing: -0.025em;
		color: var(--sa-ink);
		margin: 0;
	}
	.about-page p {
		font: var(--sa-weight-regular) var(--sa-text-lg)/1.5 var(--sa-font);
		color: var(--sa-ink);
		margin: 20px 0 0;
	}
	.about-page .sa-cta-primary {
		color: #fff;
		--sa-cta-height: 48px;
		--sa-cta-font-size: var(--sa-button-font-size);
		gap: 12px;
		padding-inline: 22px;
	}
	.about-story {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 40px;
		background: #25292b;
		border-radius: 16px;
		overflow: hidden;
		align-items: center;
	}
	.about-story__image {
		width: 100%;
		height: 100%;
		min-height: 380px;
		object-fit: cover;
		object-position: center bottom;
		border-radius: 0;
	}
	.about-text-link {
		display: inline-flex;
		align-items: center;
		gap: 12px;
		font: var(--sa-weight-semibold) var(--sa-text-base)/1.4 var(--sa-font);
		min-height: 44px;
	}
	.about-story :global(.desktop-browse-link) {
		margin-top: 20px;
	}
	.about-story > div {
		padding: 36px 36px 36px 0;
	}
	.about-story h2 {
		color: #fff;
	}
	.about-story p {
		color: #d9dcde;
		font-size: var(--sa-type-body);
		margin-top: 16px;
	}
	.about-section-heading {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 24px;
		margin-bottom: 32px;
	}
	.about-team {
		padding-top: 48px;
		padding-bottom: 16px;
	}
	.about-team-grid {
		display: grid;
		grid-template-columns: repeat(4, minmax(0, 1fr));
		gap: 20px;
	}
	.about-team-card {
		background: #25292b;
		border-radius: 12px;
		overflow: hidden;
		display: grid;
		grid-template-rows: 190px 1fr;
		padding: 0;
	}
	.about-team-card__image {
		display: block;
		overflow: hidden;
	}
	.about-team-card__image img {
		display: block;
		width: 100%;
		height: 100%;
		min-height: 0;
		object-fit: cover;
		object-position: center top;
	}
	.about-team-card__body {
		padding: 18px;
		text-align: left;
		display: grid;
		grid-template-columns: minmax(0, 1fr) 44px;
		column-gap: 12px;
		align-content: start;
	}
	.about-team-card h3 {
		font: var(--sa-weight-strong) var(--sa-text-lg)/1.3 var(--sa-font);
		color: #fff;
		margin: 0;
	}
	.about-team-card__contact {
		display: flex;
		align-items: center;
		grid-column: 2;
		grid-row: 1 / 3;
	}
	.about-team-card__contact .about-seller-contact {
		display: flex;
		gap: 8px;
		align-items: center;
		min-height: 44px;
		width: 100%;
		justify-content: center;
		font: var(--sa-weight-semibold) var(--sa-text-base)/1.4 var(--sa-font);
		color: var(--sa-ink);
		background: #fff;
		border-radius: 8px;
		padding-inline: 8px;
	}
	.about-seller-contact :global(svg) {
		color: var(--sa-ink);
	}
	.about-team-card__contact .about-seller-contact:hover {
		background: var(--sa-yellow);
	}
	.about-page .about-team-card__role {
		grid-column: 1;
		font: var(--sa-weight-regular) var(--sa-text-caption)/1.4 var(--sa-font);
		margin: 6px 0 0;
		color: #d9dcde;
	}
	.about-page .about-demo-label {
		font: var(--sa-weight-regular) var(--sa-text-caption)/1.4 var(--sa-font);
		color: #59616c;
		margin: -20px 0 24px;
	}
	.about-reviews-link {
		margin-top: 0;
	}
	.about-support-grid {
		display: grid;
		grid-template-columns: repeat(3, minmax(0, 1fr));
		gap: 24px;
	}
	.about-brands {
		display: grid;
		grid-template-columns: repeat(8, minmax(0, 1fr));
		gap: 12px;
	}
	.about-brands a {
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 8px;
		border-radius: 8px;
		background: #e9ecee;
		padding: 12px 8px;
		min-height: 64px;
		font: var(--sa-button-font-weight) var(--sa-text-caption)/1.4 var(--sa-font);
	}
	.about-brands img {
		width: 36px;
		height: 28px;
		object-fit: contain;
	}
	.about-brands a:hover {
		background: #fff;
	}
	.about-support-card {
		display: flex;
		flex-direction: column;
		align-items: flex-start;
		border-radius: 12px;
		background: #e9ecee;
		padding: 28px;
	}
	.about-support-card h3 {
		font: var(--sa-weight-strong) var(--sa-text-card-title)/1.3 var(--sa-font);
		color: var(--sa-ink);
		margin: 20px 0 0;
	}
	.about-support-card p {
		font: var(--sa-weight-regular) var(--sa-text-base)/1.5 var(--sa-font);
		color: #444c52;
		margin: 10px 0 24px;
		flex: 1;
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
		background: #e0e4e6;
		color: var(--sa-ink);
	}
	.about-support-card:is(:hover, :focus-visible) .about-support-action {
		text-decoration: underline;
		text-underline-offset: 4px;
	}
	.about-support {
		padding-bottom: 48px;
	}
	.about-page .about-team-card h3 a:hover {
		color: var(--sa-yellow);
	}
	.about-page a:not(.sa-cta):hover {
		color: var(--sa-red);
	}
	.about-page :is(a, button):focus-visible {
		outline: 2px solid var(--sa-red);
		outline-offset: 4px;
	}
	.about-visit {
		padding: 8px 0 64px;
	}
	.about-visit__banner {
		display: grid;
		grid-template-columns: 1fr 1.1fr;
		align-items: center;
		background: var(--sa-yellow);
		border-radius: 16px;
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
	@media (max-width: 1199px) {
		.about-container {
			width: calc(100% - 64px);
		}
		.about-story {
			gap: 32px;
		}
		.about-team-grid {
			gap: 16px;
		}
		.about-team-card__body {
			padding: 16px;
		}
		.about-team-card__image img {
			height: 100%;
		}
	}
	@media (max-width: 991px) {
		.about-page {
			display: none;
		}
	}
</style>
