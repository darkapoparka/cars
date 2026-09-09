<script lang="ts">
	// Native 1:1 rebuild of the localized /team/[slug] (sale-agents-details.html)
	// desktop content: breadcrumb + consultant profile (photo + bio + contact facts)
	// + recommended vehicles + reviews + contact + "more of the team". Self-contained
	// scoped styles reproduce the effective app.css + daynight-template-head.css +
	// StorefrontTemplateContent :global blend, measured via getComputedStyle at 1440px
	// on the prod build. Brand blue routes through --sa-blue; template neutrals stay
	// literal. Runes-only, no :global except the lucide breadcrumb chevron sizing.

	import { resolve } from '$app/paths';
	import { ChevronRight } from '@lucide/svelte';
	import LazyMapEmbed from '$lib/components/shared/map/LazyMapEmbed.svelte';
	import { featuredDayNightVehicles } from '$lib/data/daynight-vehicles';
	import { daynightReviews, daynightReviewDisclosure } from '$lib/data/daynight-reviews';
	import { daynightSite } from '$lib/data/daynight-site';
	import { daynightTeamDisclosure, type DayNightTeamMember } from '$lib/data/daynight-team';

	let {
		member,
		members
	}: {
		member: DayNightTeamMember;
		members: DayNightTeamMember[];
	} = $props();

	const otherMembers = $derived(members.filter((candidate) => candidate.slug !== member.slug));
	const recommendedVehicles = featuredDayNightVehicles.slice(0, 3);
	const reviews = daynightReviews.slice(0, 3);
	const mapEmbedSrc = daynightSite.mapEmbedSrc;
	const phoneLinkProps = $derived({ href: `tel:${member.phone}` });
	const mapLinkProps = {
		href: daynightSite.mapUrl,
		target: '_blank',
		rel: 'noopener'
	} as const;
</script>

<div class="team-member-page">
	<section class="background-light mb-32">
		<div class="container">
			<ul class="breadcrumb">
				<li><a href={resolve('/')}>Начало</a></li>
				<li class="breadcrumb__icon" aria-hidden="true"><ChevronRight size={14} /></li>
				<li><a href={resolve('/team')}>Екип</a></li>
				<li class="breadcrumb__icon" aria-hidden="true"><ChevronRight size={14} /></li>
				<li><span>{member.name}</span></li>
			</ul>
		</div>
	</section>

	<section class="team-member-profile pb-80">
		<div class="container">
			<div class="team-member-profile__grid">
				<div class="team-member-profile__media">
					<img src={member.image} alt={member.name} loading="eager" decoding="async" />
				</div>
				<div class="team-member-profile__content">
					<p class="eyebrow">Примерен профил</p>
					<h1>{member.name}</h1>
					<p class="text-secondary mb-18">{daynightTeamDisclosure}</p>
					<p class="h5 text-highlight mb-18">{member.role}</p>
					<p class="h7 text-secondary line-height-28 mb-22">{member.bio}</p>
					<p class="h7 line-height-28 mb-30">{member.detail}</p>
					<div class="team-member-profile__actions">
						<a {...phoneLinkProps} class="sa-cta-large sa-cta sa-cta-primary">
							Обади се за оглед
						</a>
						{#if member.email}
							<a href={`mailto:${member.email}`} class="sa-cta sa-cta-ghost"> Изпрати имейл </a>
						{/if}
					</div>
					<div class="team-member-profile__facts">
						<div>
							<span>Телефон</span>
							<a {...phoneLinkProps}>{member.phone}</a>
						</div>
						{#if member.email}
							<div>
								<span>Имейл</span>
								<a href={`mailto:${member.email}`}>{member.email}</a>
							</div>
						{/if}
						<div>
							<span>Локация</span>
							<a {...mapLinkProps}>Бургас</a>
						</div>
					</div>
				</div>
			</div>
		</div>
	</section>

	<section class="pb-80">
		<div class="container">
			<div class="title-section mb-30">
				<h2>Препоръчани автомобили</h2>
				<a href={resolve('/inventory')} class="sa-cta-compact sa-cta sa-cta-ghost"> Виж всички </a>
			</div>
			<div class="md-grid-cols-1 grid grid-cols-3 gap-24">
				{#each recommendedVehicles as vehicle (vehicle.slug)}
					<a href={resolve('/inventory/[slug]', { slug: vehicle.slug })} class="team-vehicle-card">
						<img src={vehicle.image} alt={vehicle.shortTitle} loading="lazy" decoding="async" />
						<div>
							<p class="h5 mb-8">{vehicle.shortTitle} {vehicle.year}</p>
							<p class="text-secondary mb-10">{vehicle.mileage} · {vehicle.fuel}</p>
							<p class="h5 text-highlight">{vehicle.priceEur}</p>
						</div>
					</a>
				{/each}
			</div>
		</div>
	</section>

	<section class="background-light py-80">
		<div class="container">
			<div class="title-section mb-30">
				<div>
					<h2>Отзиви от клиенти</h2>
					<p class="text-secondary">{daynightReviewDisclosure}</p>
				</div>
				<a href={resolve('/reviews')} class="sa-cta-compact sa-cta sa-cta-ghost"> Виж всички </a>
			</div>
			<div class="md-grid-cols-1 grid grid-cols-3 gap-24">
				{#each reviews as review (review.id)}
					<article class="team-review-card">
						<p class="h7 line-height-28 mb-18">{review.text}</p>
						<strong>{review.name}</strong>
						<span>{review.label}</span>
					</article>
				{/each}
			</div>
		</div>
	</section>

	<section class="py-80">
		<div class="container">
			<div class="team-member-contact">
				<div>
					<p class="eyebrow">Автосалон Тодоров Бургас</p>
					<h2>Запази час за оглед</h2>
					<p class="h7 text-secondary line-height-28 mb-24">
						Свържете се с екипа за актуална наличност, оглед, документи, бартер или финансиране.
					</p>
					<a {...phoneLinkProps} class="sa-cta sa-cta-primary">
						{daynightSite.phoneCta}
					</a>
				</div>
				<LazyMapEmbed src={mapEmbedSrc} title="Карта до Автосалон Тодоров Бургас" height="320" />
			</div>
		</div>
	</section>

	{#if otherMembers.length}
		<section class="pb-100">
			<div class="container">
				<h2 class="mb-30">Още от екипа</h2>
				<div class="md-grid-cols-1 grid grid-cols-3 gap-24">
					{#each otherMembers as teammate (teammate.slug)}
						<a href={resolve('/team/[slug]', { slug: teammate.slug })} class="team-teammate-card">
							<img src={teammate.image} alt={teammate.name} loading="lazy" decoding="async" />
							<div>
								<p class="h5 mb-4">{teammate.name}</p>
								<p class="text-secondary">{teammate.role}</p>
							</div>
						</a>
					{/each}
				</div>
			</div>
		</section>
	{/if}
</div>

<style>
	.team-member-page,
	.team-member-page * {
		box-sizing: border-box;
	}

	/* Reproduce app.css's universal `* { margin: 0 }` reset (the legacy rhythm depends
	   on it; without it default heading/list margins drift the layout). */
	.team-member-page * {
		margin: 0;
	}

	.team-member-page {
		color: #1c1c1c;
		font-family: var(--sa-font, 'Manrope', ui-sans-serif, system-ui, sans-serif);
		font-size: 16px;
		font-weight: 400;
		line-height: 26px;
	}

	.team-member-page a:not(.sa-cta) {
		color: inherit;
		text-decoration: none;
	}

	.team-member-page img {
		display: block;
		max-width: 100%;
	}

	.container {
		width: min(100% - 48px, 1320px);
		max-width: 1440px;
		margin: 0 auto;
		padding: 0 15px;
	}

	/* Headings (verified #111827; h1 clamp 36-56 -> 56 centered; section h2 clamp
	   32-48 -> 46.08, left). */
	.team-member-page h1 {
		color: #111827;
		font-size: clamp(36px, 4vw, 56px);
		font-weight: 700;
		line-height: 1.08;
		text-align: center;
	}

	.team-member-page h2 {
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

	.mb-8 {
		margin-bottom: 8px;
	}

	.mb-10 {
		margin-bottom: 10px;
	}

	.mb-18 {
		margin-bottom: 18px;
	}

	.mb-22 {
		margin-bottom: 22px;
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

	.font-weight-600 {
		font-weight: 600;
	}

	.text-secondary {
		color: #667085;
	}

	.text-highlight {
		color: var(--sa-red);
	}

	.line-height-28 {
		line-height: 28px;
	}

	.h7 {
		font-size: 18px;
		font-weight: 500;
		line-height: var(--sa-leading-body);
	}

	.h5 {
		font-size: 20px;
		font-weight: var(--sa-weight-semibold);
		line-height: 1.35;
	}

	.eyebrow {
		margin-bottom: 12px;
		color: var(--sa-red);
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

	.pb-100 {
		padding-bottom: 100px;
	}

	/* Buttons (verified: 54px, radius 8, padding 0 26, weight 700; primary blue fill,
	   line = white with #d9e0ea border #111827 text). */
	.btn {
		display: inline-flex;
		min-height: 52px;
		align-items: center;
		justify-content: center;
		gap: 9px;
		border: 1px solid #1c1c1c;
		border-radius: 8px;
		background: #fff;
		color: #1c1c1c;
		font-size: 18px;
		padding: 0 24px;
		font-weight: 700;
		line-height: 1;
	}

	.btn-large {
		min-height: 54px;
		padding-right: 26px;
		padding-left: 26px;
	}

	.btn-primary {
		border-color: var(--sa-blue);
		background: var(--sa-blue);
		color: #fff;
	}

	.btn-line {
		border-color: #d9e0ea;
		background: #fff;
		color: #111827;
	}

	.btn:hover,
	.btn:focus-visible {
		border-color: var(--sa-blue);
		background: var(--sa-blue);
		color: #fff;
	}

	/* Breadcrumb (verified: min-height 76, gap 10, ul 14/700 #5f6877, a #1c1c1c 14/400,
	   icon 14px). The /assets/right.svg chevrons become @lucide ChevronRight. */
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

	/* ---- Profile + contact split (verified grid 0.82fr / 1.18fr, gap 48; photo
	   aspect 4/5 radius 18; facts cards #e5e7eb radius 12). ---- */
	.team-member-profile__grid,
	.team-member-contact {
		align-items: center;
		display: grid;
		gap: 48px;
		grid-template-columns: minmax(280px, 0.82fr) minmax(0, 1.18fr);
	}

	.team-member-profile__media img {
		aspect-ratio: 4 / 5;
		border-radius: 18px;
		height: auto;
		object-fit: cover;
		width: 100%;
	}

	.team-member-profile__content h1 {
		margin-bottom: 10px;
		text-align: left;
	}

	.team-member-profile__actions,
	.team-member-profile__facts {
		display: flex;
		flex-wrap: wrap;
		gap: 14px;
	}

	.team-member-profile__facts {
		margin-top: 28px;
	}

	.team-member-profile__facts div {
		border: 1px solid #e5e7eb;
		border-radius: 12px;
		min-width: 180px;
		padding: 16px;
	}

	.team-member-profile__actions .sa-cta {
		min-width: 176px;
	}

	.team-member-profile__facts span,
	.team-review-card span {
		color: #6b7280;
		display: block;
		font-size: 14px;
		margin-bottom: 4px;
	}

	.team-vehicle-card,
	.team-teammate-card,
	.team-review-card {
		background: #fff;
		border: 1px solid #e5e7eb;
		border-radius: 12px;
		overflow: hidden;
		transition:
			border-color 160ms var(--sa-ease),
			box-shadow 160ms var(--sa-ease),
			transform 160ms var(--sa-ease);
	}

	.team-vehicle-card:hover,
	.team-vehicle-card:focus-visible,
	.team-teammate-card:hover,
	.team-teammate-card:focus-visible {
		border-color: var(--sa-line-strong);
		box-shadow: none;
		outline: 2px solid var(--sa-line-strong);
		outline-offset: 2px;
	}

	.team-vehicle-card img,
	.team-teammate-card img {
		aspect-ratio: 1.45 / 1;
		height: auto;
		object-fit: cover;
		width: 100%;
	}

	.team-vehicle-card div,
	.team-teammate-card div,
	.team-review-card {
		padding: 20px;
	}

	/* Renders desktop-narrow on phones (no MobileTeamMemberPage). */
	@media (max-width: 991px) {
		.container {
			width: calc(100% - 32px);
			padding: 0;
		}
		.pb-80,
		.pb-100 {
			padding-bottom: 40px;
		}
		.py-80 {
			padding-block: 32px;
		}
		.team-member-profile__grid,
		.team-member-contact {
			gap: 20px;
		}
		.team-member-profile__media {
			width: 96px;
		}
		.team-member-profile__media img {
			aspect-ratio: 1;
			border-radius: 12px;
		}
		.team-member-profile__content .h7 {
			font-size: 16px;
			line-height: 1.6;
		}
		.team-member-profile__facts {
			gap: 12px;
			margin-top: 20px;
		}
		.team-member-profile__facts div {
			min-width: 0;
			flex: 1 1 120px;
			padding: 12px;
		}
		.team-vehicle-card,
		.team-teammate-card {
			display: grid;
			grid-template-columns: 96px minmax(0, 1fr);
		}
		.team-vehicle-card img,
		.team-teammate-card img {
			height: 100%;
			aspect-ratio: auto;
		}
		.team-vehicle-card div,
		.team-teammate-card div,
		.team-review-card {
			padding: 12px;
		}
		.team-vehicle-card .h5,
		.team-teammate-card .h5 {
			font-size: 18px;
		}
		.gap-24 {
			gap: 16px;
		}

		.team-member-profile__grid,
		.team-member-contact {
			grid-template-columns: 1fr;
		}

		.team-member-profile__content h1 {
			font-size: 34px;
			line-height: 1.12;
		}

		.md-grid-cols-1.grid.grid-cols-3 {
			grid-template-columns: 1fr;
		}
	}
</style>
