<script lang="ts">
	import { getI18n } from '$lib/locale/context';
	const i18n = getI18n();

	import { ChevronRight, ClipboardCheck, MapPin, Repeat, ShieldCheck } from '@lucide/svelte';
	import { resolve } from '$app/paths';
	import { daynightSite } from '$lib/data/daynight-site';
	import MobileInfoHero from '$lib/components/shared/mobile/MobileInfoHero.svelte';
	import MobileHomeFooter from '$lib/components/home/mobile/MobileHomeFooter.svelte';
	import '$lib/styles/mobile-info-page.css';
	import { daynightTeam, daynightTeamDisclosure } from '$lib/data/daynight-team';

	const teamMembers = daynightTeam.slice(0, 3);

	const trustPoints = [
		{
			id: 'history',
			title: i18n.t('copy.949f155329f3'),
			copy: i18n.t('copy.99a4d3e05804'),
			icon: ShieldCheck
		},
		{
			id: 'documents',
			title: i18n.t('copy.b7ce7bc1a709'),
			copy: i18n.t('copy.a205e634fead'),
			icon: ClipboardCheck
		},
		{
			id: 'trade',
			title: i18n.t('copy.48b06561777d'),
			copy: i18n.t('copy.595528588afb'),
			icon: Repeat
		}
	] as const;

	const steps = [
		'Избирате автомобил според бюджет и нужди.',
		'Организираме оглед, въпроси и проверка.',
		'Подреждаме документите и следващите стъпки.'
	] as const;

	function teamThumb(path: string): `/assets/${string}` {
		return path.replace('-v1.webp', '-v1-thumb.webp') as `/assets/${string}`;
	}

	function teamHref(slug: string): `/team/${string}` {
		return `/team/${slug}`;
	}
</script>

<div class="mobile-about-app mobile-info-page">
	<MobileInfoHero
		title={i18n.t('copy.6e9ec45d6d0b')}
		description={i18n.t('pattern.6650866ec396', {
			v0: daynightSite.shortName,
			v1: i18n.dealer('city')
		})}
	>
		<a href={i18n.href(resolve('/inventory'))}
			>{i18n.t('copy.f698657835c5')} <ChevronRight size={18} strokeWidth={2} /></a
		>
		<a href={i18n.href(daynightSite.mapUrl)} target="_blank" rel="noopener noreferrer"
			><MapPin size={18} strokeWidth={2} /> {i18n.t('copy.2751c9100018')}</a
		>
	</MobileInfoHero>

	<main id="main-content" tabindex="-1">
		<section class="mobile-about-section" aria-labelledby="mobile-about-trust-title">
			<div class="mobile-about-heading">
				<h2 id="mobile-about-trust-title">{i18n.t('copy.d7f9d774faef')}</h2>
			</div>

			<div class="mobile-about-cards">
				{#each trustPoints as point (point.id)}
					{@const Icon = point.icon}
					<article class="mobile-about-card">
						<div><Icon size={22} strokeWidth={2} /></div>
						<span>
							<strong>{i18n.text(point.title)}</strong>
							<small>{i18n.text(point.copy)}</small>
						</span>
					</article>
				{/each}
			</div>
		</section>

		<section class="mobile-about-location" aria-labelledby="mobile-about-location-title">
			<img
				src={i18n.asset(resolve('/assets/images/pages/daynight-about-consultation-v1.webp'))}
				alt={i18n.t('pattern.beb4e52447e5', { v0: daynightSite.shortName })}
				loading="lazy"
				decoding="async"
			/>
			<div>
				<h2 id="mobile-about-location-title">{i18n.t('copy.0c7b625d8984')}</h2>
				<p>{i18n.dealer('address')}</p>
				<a href={i18n.href(daynightSite.mapUrl)} target="_blank" rel="noopener noreferrer">
					<MapPin size={18} strokeWidth={2} />
					<span>{i18n.t('copy.d0f804364b2c')}</span>
				</a>
			</div>
		</section>

		<section class="mobile-about-section" aria-labelledby="mobile-about-process-title">
			<div class="mobile-about-heading">
				<h2 id="mobile-about-process-title">{i18n.t('copy.4dbb828642ef')}</h2>
			</div>

			<ol class="mobile-about-steps">
				{#each steps as step, index (step)}
					<li>
						<strong>{index + 1}</strong>
						<span>{i18n.text(step)}</span>
					</li>
				{/each}
			</ol>
		</section>

		<section class="mobile-about-section" aria-labelledby="mobile-about-team-title">
			<div class="mobile-about-heading mobile-about-heading--row">
				<div>
					<h2 id="mobile-about-team-title">{i18n.t('copy.5960311fe331')}</h2>
				</div>
				<a href={i18n.href(resolve('/team'))}>
					<span>{i18n.t('copy.117d98cb652c')}</span>
					<ChevronRight size={16} strokeWidth={2} />
				</a>
			</div>

			<p>{i18n.text(daynightTeamDisclosure)}</p>
			<div class="mobile-about-team">
				{#each teamMembers as member (member.slug)}
					<a class="mobile-about-team-card" href={i18n.href(resolve(teamHref(member.slug)))}>
						<img
							src={i18n.asset(resolve(teamThumb(member.image)))}
							alt={i18n.text(member.name)}
							loading="lazy"
							decoding="async"
						/>
						<span>
							<strong>{i18n.text(member.name)}</strong>
							<small>{i18n.text(member.role)}</small>
						</span>
					</a>
				{/each}
			</div>
		</section>
	</main>
	<MobileHomeFooter />
</div>

<style>
	.mobile-about-section,
	.mobile-about-cards,
	.mobile-about-team {
		display: grid;
		gap: 14px;
	}
	.mobile-about-heading--row {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 12px;
	}
	.mobile-about-heading--row > a {
		display: inline-flex;
		align-items: center;
		gap: 4px;
		min-height: var(--sa-mobile-action-h);
		font-size: var(--sa-type-body);
	}
	.mobile-about-card {
		display: grid;
		grid-template-columns: 44px minmax(0, 1fr);
		gap: 12px;
		align-items: start;
		padding: 0 0 14px;
		border-bottom: 1px solid var(--sa-line);
	}
	.mobile-about-card:last-child {
		border-bottom: 0;
		padding-bottom: 0;
	}
	.mobile-about-card > div {
		display: grid;
		place-items: center;
		width: 44px;
		height: 44px;
		border: 1px solid var(--sa-line);
		border-radius: 50%;
	}
	.mobile-about-card span,
	.mobile-about-team-card span {
		display: grid;
		gap: 4px;
		min-width: 0;
	}
	.mobile-about-card strong,
	.mobile-about-team-card strong {
		font-size: var(--sa-type-body);
		font-weight: var(--sa-weight-medium);
	}
	.mobile-about-card small,
	.mobile-about-team-card small {
		color: var(--sa-ink-soft);
		font-size: var(--sa-type-body);
		line-height: var(--sa-mobile-leading-body);
	}
	.mobile-about-location {
		overflow: hidden;
		border: 1px solid var(--sa-line);
		border-radius: var(--sa-r-md);
	}
	.mobile-about-location > img {
		display: block;
		width: 100%;
		aspect-ratio: 16/9;
		object-fit: cover;
	}
	.mobile-about-location > div {
		display: grid;
		gap: 10px;
		padding: 16px;
	}
	.mobile-about-location a {
		display: inline-flex;
		align-items: center;
		justify-self: start;
		gap: 8px;
		min-height: var(--sa-mobile-action-h);
		padding: 0 14px;
		border: 1px solid var(--sa-line);
		border-radius: 999px;
		font-size: var(--sa-type-body);
	}
	.mobile-about-steps {
		display: grid;
		gap: 16px;
		margin: 0;
		padding: 0;
		list-style: none;
	}
	.mobile-about-steps li {
		display: grid;
		grid-template-columns: 32px minmax(0, 1fr);
		align-items: start;
		gap: 12px;
	}
	.mobile-about-steps strong {
		display: grid;
		place-items: center;
		width: 32px;
		height: 32px;
		border-radius: 50%;
		background: var(--sa-fill);
		font-size: var(--sa-type-body);
		font-weight: var(--sa-weight-medium);
	}
	.mobile-about-steps span {
		padding-top: 3px;
	}
	.mobile-about-team-card {
		display: grid;
		grid-template-columns: 58px minmax(0, 1fr);
		align-items: center;
		gap: 12px;
	}
	.mobile-about-team-card img {
		width: 58px;
		height: 58px;
		border-radius: var(--sa-r-md);
		object-fit: cover;
	}
</style>
