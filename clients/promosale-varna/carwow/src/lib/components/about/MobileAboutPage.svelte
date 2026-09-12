<script lang="ts">
	import {
		BadgeCheck,
		CarFront,
		ChevronRight,
		ClipboardCheck,
		MapPin,
		Phone,
		Repeat,
		ShieldCheck
	} from '@lucide/svelte';
	import { resolve } from '$app/paths';
	import { daynightSite } from '$lib/data/daynight-site';
	import { daynightTeam, daynightTeamDisclosure } from '$lib/data/daynight-team';

	const phoneHref = `tel:+359${daynightSite.phone.slice(1)}`;
	const teamMembers = daynightTeam.slice(0, 3);

	const trustPoints = [
		{
			id: 'history',
			title: 'Ясна история',
			copy: 'Проверка на документи, състояние и реална наличност.',
			icon: ShieldCheck
		},
		{
			id: 'documents',
			title: 'Документи',
			copy: 'Съдействие при договор, регистрация и предаване.',
			icon: ClipboardCheck
		},
		{
			id: 'trade',
			title: 'Бартер',
			copy: 'Оценка, замяна или директно изкупуване на автомобил.',
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

	function openMap() {
		window.open(daynightSite.mapUrl, '_blank', 'noopener,noreferrer');
	}
</script>

<div class="mobile-about-app" aria-label="За Promosale Varna">
	<header class="mobile-about-hero">
		<img
			class="mobile-about-hero__bg"
			src={resolve('/dealer/showroom.webp')}
			alt=""
			aria-hidden="true"
		/>
		<div class="mobile-about-hero__bar">
			<a href={resolve('/')} aria-label="Promosale Varna начало">
				<img src={resolve('/dealer/logo.png')} alt={daynightSite.shortName} />
			</a>
			<a class="mobile-about-hero__phone" href={phoneHref} aria-label="Обади се">
				<Phone size={19} strokeWidth={2.45} />
			</a>
		</div>

		<div class="mobile-about-hero__copy">
			<span>За нас</span>
			<h1>Проверени автомобили и ясен процес</h1>
			<p>Promosale Varna във Варна помага с избор, оглед, документи, финансиране и бартер.</p>
		</div>

		<div class="mobile-about-actions">
			<a class="mobile-about-action mobile-about-action--primary" href={resolve('/inventory')}>
				<CarFront size={19} strokeWidth={2.5} />
				<span>Виж автомобили</span>
			</a>
			<button
				class="mobile-about-action mobile-about-action--secondary"
				type="button"
				onclick={openMap}
			>
				<MapPin size={19} strokeWidth={2.5} />
				<span>Локация</span>
			</button>
		</div>
	</header>

	<main id="main-content" tabindex="-1">
		<section class="mobile-about-section" aria-labelledby="mobile-about-trust-title">
			<div class="mobile-about-heading">
				<span>Promosale Varna</span>
				<h2 id="mobile-about-trust-title">Защо при нас</h2>
			</div>

			<div class="mobile-about-cards">
				{#each trustPoints as point (point.id)}
					{@const Icon = point.icon}
					<article class="mobile-about-card">
						<div><Icon size={22} strokeWidth={2.45} /></div>
						<span>
							<strong>{point.title}</strong>
							<small>{point.copy}</small>
						</span>
					</article>
				{/each}
			</div>
		</section>

		<section class="mobile-about-location" aria-labelledby="mobile-about-location-title">
			<img
				src={resolve('/assets/images/pages/daynight-about-consultation-v1.webp')}
				alt="Консултация със Promosale Varna"
				loading="lazy"
				decoding="async"
			/>
			<div>
				<span>Шоурум във Варна</span>
				<h2 id="mobile-about-location-title">Огледи и съдействие на място</h2>
				<p>{daynightSite.location}</p>
				<button type="button" onclick={openMap}>
					<MapPin size={18} strokeWidth={2.45} />
					<span>Отвори карта</span>
				</button>
			</div>
		</section>

		<section class="mobile-about-section" aria-labelledby="mobile-about-process-title">
			<div class="mobile-about-heading">
				<span>Процес</span>
				<h2 id="mobile-about-process-title">Как работи</h2>
			</div>

			<ol class="mobile-about-steps">
				{#each steps as step, index (step)}
					<li>
						<strong>{index + 1}</strong>
						<span>{step}</span>
						<BadgeCheck size={18} strokeWidth={2.45} />
					</li>
				{/each}
			</ol>
		</section>

		<section class="mobile-about-section" aria-labelledby="mobile-about-team-title">
			<div class="mobile-about-heading mobile-about-heading--row">
				<div>
					<span>Екип</span>
					<h2 id="mobile-about-team-title">Кой помага</h2>
				</div>
				<a href={resolve('/team')}>
					<span>Всички</span>
					<ChevronRight size={16} strokeWidth={2.45} />
				</a>
			</div>

			<p>{daynightTeamDisclosure}</p>
			<div class="mobile-about-team">
				{#each teamMembers as member (member.slug)}
					<a class="mobile-about-team-card" href={resolve(teamHref(member.slug))}>
						<img
							src={resolve(teamThumb(member.image))}
							alt={member.name}
							loading="lazy"
							decoding="async"
						/>
						<span>
							<strong>{member.name}</strong>
							<small>{member.role}</small>
						</span>
					</a>
				{/each}
			</div>
		</section>
	</main>
</div>

<style>
	.mobile-about-app {
		display: none;
		min-height: 100svh;
		background: #fff;
		color: var(--sa-ink);
		font-family: var(--sa-font);
		-webkit-font-smoothing: antialiased;
		text-rendering: optimizeLegibility;
	}

	.mobile-about-app :where(a) {
		color: inherit;
		text-decoration: none;
	}

	.mobile-about-app :where(button) {
		appearance: none;
		border: 0;
		background: transparent;
		color: inherit;
		cursor: pointer;
		font: inherit;
		letter-spacing: 0;
		padding: 0;
	}

	.mobile-about-app :global(svg),
	.mobile-about-app :global(svg *) {
		stroke: currentColor !important;
	}

	.mobile-about-hero {
		position: relative;
		display: grid;
		gap: var(--sa-mobile-gap-md);
		overflow: hidden;
		background: var(--sa-blue);
		padding: calc(env(safe-area-inset-top) + 12px) var(--sa-mobile-gutter-wide) 15px;
		color: #fff;
		isolation: isolate;
	}

	.mobile-about-hero::after {
		position: absolute;
		inset: 0;
		z-index: -1;
		background: rgba(20, 100, 218, 0.86);
		content: '';
	}

	.mobile-about-hero__bg {
		position: absolute;
		inset: 0;
		z-index: -2;
		width: 100%;
		height: 100%;
		opacity: 0.45;
		object-fit: cover;
		object-position: center;
	}

	.mobile-about-hero__bar {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: var(--sa-mobile-gap-md);
	}

	.mobile-about-hero__bar img {
		display: block;
		width: 170px;
		height: auto;
	}

	.mobile-about-hero__phone {
		display: grid;
		width: var(--sa-mobile-pill-h);
		height: var(--sa-mobile-pill-h);
		flex: 0 0 auto;
		place-items: center;
		border-radius: 50%;
		background: var(--sa-red);
		color: #fff !important;
	}

	.mobile-about-hero__phone :global(svg),
	.mobile-about-hero__phone :global(svg *) {
		color: #fff !important;
		stroke: #fff !important;
	}

	.mobile-about-hero__copy {
		display: grid;
		gap: var(--sa-mobile-gap-xs);
		max-width: 330px;
	}

	.mobile-about-hero__copy span,
	.mobile-about-heading span,
	.mobile-about-location span {
		color: rgba(255, 255, 255, 0.76);
		font-size: var(--sa-text-xs);
		font-weight: 800;
		line-height: 1;
		text-transform: uppercase;
	}

	.mobile-about-hero h1 {
		margin: 0;
		color: #fff;
		font-size: var(--sa-text-2xl);
		font-weight: 800;
		letter-spacing: 0;
		line-height: 1.07;
	}

	.mobile-about-hero p {
		margin: 0;
		color: rgba(255, 255, 255, 0.88);
		font-size: var(--sa-text-sm);
		font-weight: 700;
		line-height: 1.3;
	}

	.mobile-about-actions {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: var(--sa-mobile-gap-sm);
	}

	.mobile-about-action {
		display: inline-flex;
		min-height: var(--sa-mobile-action-h);
		align-items: center;
		justify-content: center;
		gap: var(--sa-mobile-gap-xs);
		border-radius: 8px;
		color: #fff !important;
		font-size: var(--sa-text-sm);
		font-weight: 800;
		line-height: 1;
		overflow: hidden;
		padding: 0 8px;
		white-space: nowrap;
	}

	.mobile-about-action span,
	.mobile-about-action :global(svg),
	.mobile-about-action :global(svg *) {
		color: #fff !important;
		-webkit-text-fill-color: #fff !important;
		stroke: #fff !important;
	}

	.mobile-about-action--primary {
		background: var(--sa-red);
	}

	.mobile-about-action--secondary {
		border: 1px solid rgba(255, 255, 255, 0.34);
		background: rgba(255, 255, 255, 0.12);
	}

	.mobile-about-app main {
		display: grid;
		gap: var(--sa-mobile-page-gap);
		padding: 13px var(--sa-mobile-gutter) calc(84px + env(safe-area-inset-bottom));
	}

	.mobile-about-section,
	.mobile-about-cards,
	.mobile-about-team {
		display: grid;
		gap: var(--sa-mobile-section-gap);
	}

	.mobile-about-heading {
		display: grid;
		gap: 5px;
	}

	.mobile-about-heading--row {
		display: flex;
		align-items: end;
		justify-content: space-between;
		gap: var(--sa-mobile-gap-sm);
	}

	.mobile-about-heading--row > div {
		display: grid;
		min-width: 0;
		gap: 5px;
	}

	.mobile-about-heading span,
	.mobile-about-location span {
		color: var(--sa-blue);
	}

	.mobile-about-heading h2,
	.mobile-about-location h2 {
		margin: 0;
		color: #111827;
		font-size: var(--sa-text-xl);
		font-weight: 800;
		letter-spacing: 0;
		line-height: 1.1;
	}

	.mobile-about-heading--row > a {
		display: inline-flex;
		min-height: var(--sa-mobile-card-action);
		align-items: center;
		gap: 2px;
		color: var(--sa-blue) !important;
		font-size: var(--sa-text-xs);
		font-weight: 800;
		white-space: nowrap;
	}

	.mobile-about-card {
		display: grid;
		grid-template-columns: 42px minmax(0, 1fr);
		min-height: 76px;
		align-items: center;
		gap: var(--sa-mobile-gap-sm);
		border-radius: 8px;
		background: #f4f6f9;
		padding: 10px 12px;
	}

	.mobile-about-card > div {
		display: grid;
		width: var(--sa-mobile-pill-h);
		height: var(--sa-mobile-pill-h);
		place-items: center;
		border-radius: 50%;
		background: #fff;
		color: var(--sa-blue);
	}

	.mobile-about-card span,
	.mobile-about-team-card span {
		display: grid;
		min-width: 0;
		gap: 4px;
	}

	.mobile-about-card strong,
	.mobile-about-team-card strong {
		color: #111827;
		font-size: var(--sa-text-base);
		font-weight: 800;
		line-height: 1.1;
	}

	.mobile-about-card small,
	.mobile-about-team-card small {
		color: #66707a;
		font-size: var(--sa-text-xs);
		font-weight: 700;
		line-height: 1.28;
	}

	.mobile-about-location {
		display: grid;
		gap: var(--sa-mobile-gap-sm);
		overflow: hidden;
		border-radius: 8px;
		background: #f4f6f9;
		padding: 12px;
	}

	.mobile-about-location > img {
		display: block;
		width: 100%;
		aspect-ratio: 16 / 9;
		border-radius: 8px;
		object-fit: cover;
	}

	.mobile-about-location > div {
		display: grid;
		gap: 7px;
	}

	.mobile-about-location p {
		margin: 0;
		color: #66707a;
		font-size: var(--sa-text-sm);
		font-weight: 700;
		line-height: 1.35;
	}

	.mobile-about-location :is(a, button) {
		display: inline-flex;
		width: fit-content;
		min-height: var(--sa-mobile-hero-cta-h);
		align-items: center;
		justify-content: center;
		gap: 6px;
		border-radius: 999px;
		background: #fff;
		padding: 0 13px;
		color: var(--sa-blue) !important;
		font-size: var(--sa-text-xs);
		font-weight: 800;
	}

	.mobile-about-steps {
		display: grid;
		gap: var(--sa-mobile-gap-sm);
		margin: 0;
		padding: 0;
		list-style: none;
	}

	.mobile-about-steps li {
		display: grid;
		grid-template-columns: 34px minmax(0, 1fr) 20px;
		min-height: 58px;
		align-items: center;
		gap: var(--sa-mobile-gap-sm);
		border-radius: 8px;
		background: #f4f6f9;
		padding: 10px 12px;
	}

	.mobile-about-steps strong {
		display: grid;
		width: 32px;
		height: 32px;
		place-items: center;
		border-radius: 50%;
		background: var(--sa-blue);
		color: #fff;
		font-size: var(--sa-text-sm);
		font-weight: 800;
	}

	.mobile-about-steps span {
		color: #111827;
		font-size: var(--sa-text-sm);
		font-weight: 800;
		line-height: 1.25;
	}

	.mobile-about-steps :global(svg) {
		color: var(--sa-blue);
	}

	.mobile-about-team-card {
		display: grid;
		grid-template-columns: 58px minmax(0, 1fr);
		min-height: 72px;
		align-items: center;
		gap: var(--sa-mobile-gap-sm);
		border-radius: 8px;
		background: #f4f6f9;
		padding: 9px 12px 9px 9px;
	}

	.mobile-about-team-card img {
		display: block;
		width: 58px;
		height: 58px;
		border-radius: 8px;
		object-fit: cover;
	}

	@media (max-width: 991px) {
		.mobile-about-app {
			display: block;
		}
	}
</style>
