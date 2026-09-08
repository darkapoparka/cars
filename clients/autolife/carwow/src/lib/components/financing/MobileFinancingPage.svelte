<script lang="ts">
	import {
		BadgeCheck,
		CarFront,
		ClipboardCheck,
		Clock,
		Phone,
		PhoneCall,
		Send
	} from '@lucide/svelte';
	import { resolve } from '$app/paths';
	import { daynightSite } from '$lib/data/daynight-site';

	const phoneHref = `tel:+359${daynightSite.phone.slice(1)}`;

	const benefits = [
		{
			id: 'documents',
			title: 'Съдействие по документи',
			copy: 'Екипът подготвя документите и съпровожда прехвърлянето от началото до края.',
			icon: ClipboardCheck
		},
		{
			id: 'terms',
			title: 'Ясни условия предварително',
			copy: 'Ориентировъчна месечна вноска и условия още преди да дойдете за оглед.',
			icon: BadgeCheck
		},
		{
			id: 'fast',
			title: 'Отнема няколко минути',
			copy: 'Изпращате запитване с автомобил и бюджет - екипът ще Ви изпрати конкретни стъпки.',
			icon: Clock
		}
	] as const;

	const steps = [
		'Изпращаш запитване с автомобил и месечен бюджет.',
		'Получаваш ориентировъчна вноска и условия.',
		'Оглед в Варна и финализиране с екипа.'
	] as const;

	const faqs = [
		{
			id: 'documents',
			question: 'Какви документи са нужни?',
			answer:
				'Обикновено са достатъчни лична карта и основни данни за дохода; за фирми — фирмени документи. Екипът подготвя останалото.'
		},
		{
			id: 'trade-in',
			question: 'Може ли с бартер?',
			answer: 'Да — оценяваме текущия ви автомобил и стойността му намалява финансираната сума.'
		},
		{
			id: 'speed',
			question: 'Колко време отнема одобрението?',
			answer:
				'Обикновено получавате обратна връзка в рамките на работния ден. Условията се потвърждават при огледа.'
		}
	] as const;
</script>

<div class="mobile-financing-app" aria-label="Финансиране от Аутолайф">
	<header class="mobile-financing-hero">
		<img
			class="mobile-financing-hero__bg"
			src={resolve('/assets/images/pages/daynight-services-consultation-v1.webp')}
			alt=""
			aria-hidden="true"
		/>
		<div class="mobile-financing-hero__bar">
			<a href={resolve('/')} aria-label="Аутолайф начало">
				<img
					src={resolve('/assets/autolife/wordmark.svg')}
					alt={daynightSite.shortName}
				/>
			</a>
			<a class="mobile-financing-hero__phone" href={phoneHref} aria-label="Обади се">
				<Phone size={19} strokeWidth={2.45} />
			</a>
		</div>

		<div class="mobile-financing-hero__copy">
			<span>Финансиране</span>
			<h1>Финансиране и разсрочено плащане</h1>
			<p>Ясни условия, ориентировъчна месечна вноска и съдействие от екипа в Варна.</p>
		</div>

		<div class="mobile-financing-actions">
			<a
				class="mobile-financing-action mobile-financing-action--primary"
				href={resolve('/contact')}
			>
				<Send size={18} strokeWidth={2.5} />
				<span>Изпрати запитване</span>
			</a>
			<a
				class="mobile-financing-action mobile-financing-action--secondary"
				href={resolve('/inventory')}
			>
				<CarFront size={19} strokeWidth={2.5} />
				<span>Виж автомобили</span>
			</a>
		</div>
	</header>

	<main id="main-content" tabindex="-1">
		<section class="mobile-financing-section" aria-labelledby="mobile-financing-benefits-title">
			<div class="mobile-financing-heading">
				<span>Предимства</span>
				<h2 id="mobile-financing-benefits-title">Защо с нас</h2>
			</div>

			<div class="mobile-financing-cards">
				{#each benefits as benefit (benefit.id)}
					{@const Icon = benefit.icon}
					<article class="mobile-financing-card">
						<div><Icon size={22} strokeWidth={2.45} /></div>
						<span>
							<strong>{benefit.title}</strong>
							<small>{benefit.copy}</small>
						</span>
					</article>
				{/each}
			</div>
		</section>

		<section class="mobile-financing-section" aria-labelledby="mobile-financing-process-title">
			<div class="mobile-financing-heading">
				<span>Процес</span>
				<h2 id="mobile-financing-process-title">Как работи</h2>
			</div>

			<ol class="mobile-financing-steps">
				{#each steps as step, index (step)}
					<li>
						<strong>{index + 1}</strong>
						<span>{step}</span>
						<BadgeCheck size={18} strokeWidth={2.45} />
					</li>
				{/each}
			</ol>
		</section>

		<section class="mobile-financing-section" aria-labelledby="mobile-financing-faq-title">
			<div class="mobile-financing-heading">
				<span>Въпроси</span>
				<h2 id="mobile-financing-faq-title">Често задавани</h2>
			</div>

			<div class="mobile-financing-faq">
				{#each faqs as faq (faq.id)}
					<article>
						<strong>{faq.question}</strong>
						<small>{faq.answer}</small>
					</article>
				{/each}
			</div>
		</section>

		<section class="mobile-financing-cta" aria-labelledby="mobile-financing-cta-title">
			<div>
				<span>Следваща стъпка</span>
				<h2 id="mobile-financing-cta-title">Кажи автомобил и бюджет</h2>
				<p>Екипът ще Ви изпрати конкретни следващи стъпки в рамките на работния ден.</p>
				<a href={phoneHref}>
					<PhoneCall size={18} strokeWidth={2.45} />
					<span>{daynightSite.phoneLabel}</span>
				</a>
			</div>
		</section>
	</main>
</div>

<style>
	.mobile-financing-app {
		display: none;
		min-height: 100svh;
		background: #fff;
		color: var(--sa-ink);
		font-family: var(--sa-font);
		-webkit-font-smoothing: antialiased;
		text-rendering: optimizeLegibility;
	}

	.mobile-financing-app :where(a) {
		color: inherit;
		text-decoration: none;
	}

	.mobile-financing-app :global(svg),
	.mobile-financing-app :global(svg *) {
		stroke: currentColor !important;
	}

	.mobile-financing-hero {
		position: relative;
		display: grid;
		gap: var(--sa-mobile-gap-md);
		overflow: hidden;
		background: var(--sa-blue);
		padding: calc(env(safe-area-inset-top) + 12px) var(--sa-mobile-gutter-wide) 15px;
		color: #fff;
		isolation: isolate;
	}

	.mobile-financing-hero::after {
		position: absolute;
		inset: 0;
		z-index: -1;
		background: rgba(20, 100, 218, 0.86);
		content: '';
	}

	.mobile-financing-hero__bg {
		position: absolute;
		inset: 0;
		z-index: -2;
		width: 100%;
		height: 100%;
		opacity: 0.45;
		object-fit: cover;
		object-position: center;
	}

	.mobile-financing-hero__bar {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: var(--sa-mobile-gap-md);
	}

	.mobile-financing-hero__bar img {
		display: block;
		width: 170px;
		height: auto;
	}

	.mobile-financing-hero__phone {
		display: grid;
		width: var(--sa-mobile-pill-h);
		height: var(--sa-mobile-pill-h);
		flex: 0 0 auto;
		place-items: center;
		border-radius: 50%;
		background: var(--sa-red);
		color: #fff !important;
	}

	.mobile-financing-hero__phone :global(svg),
	.mobile-financing-hero__phone :global(svg *) {
		color: #fff !important;
		stroke: #fff !important;
	}

	.mobile-financing-hero__copy {
		display: grid;
		gap: var(--sa-mobile-gap-xs);
		max-width: 330px;
	}

	.mobile-financing-hero__copy span,
	.mobile-financing-heading span,
	.mobile-financing-cta span {
		color: rgba(255, 255, 255, 0.76);
		font-size: var(--sa-text-xs);
		font-weight: 800;
		line-height: 1;
		text-transform: uppercase;
	}

	.mobile-financing-hero h1 {
		margin: 0;
		color: #fff;
		font-size: var(--sa-text-2xl);
		font-weight: 800;
		letter-spacing: 0;
		line-height: 1.07;
	}

	.mobile-financing-hero p {
		margin: 0;
		color: rgba(255, 255, 255, 0.88);
		font-size: var(--sa-text-sm);
		font-weight: 700;
		line-height: 1.3;
	}

	.mobile-financing-actions {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: var(--sa-mobile-gap-sm);
	}

	.mobile-financing-action {
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

	.mobile-financing-action span,
	.mobile-financing-action :global(svg),
	.mobile-financing-action :global(svg *) {
		color: #fff !important;
		-webkit-text-fill-color: #fff !important;
		stroke: #fff !important;
	}

	.mobile-financing-action--primary {
		background: var(--sa-red);
	}

	.mobile-financing-action--secondary {
		border: 1px solid rgba(255, 255, 255, 0.34);
		background: rgba(255, 255, 255, 0.12);
	}

	.mobile-financing-app main {
		display: grid;
		gap: var(--sa-mobile-page-gap);
		padding: 13px var(--sa-mobile-gutter) calc(84px + env(safe-area-inset-bottom));
	}

	.mobile-financing-section,
	.mobile-financing-cards,
	.mobile-financing-faq {
		display: grid;
		gap: var(--sa-mobile-section-gap);
	}

	.mobile-financing-heading {
		display: grid;
		gap: 5px;
	}

	.mobile-financing-heading span {
		color: var(--sa-blue);
	}

	.mobile-financing-heading h2 {
		margin: 0;
		color: #111827;
		font-size: var(--sa-text-xl);
		font-weight: 800;
		letter-spacing: 0;
		line-height: 1.1;
	}

	.mobile-financing-card {
		display: grid;
		grid-template-columns: 42px minmax(0, 1fr);
		min-height: 76px;
		align-items: center;
		gap: var(--sa-mobile-gap-sm);
		border-radius: 12px;
		background: var(--sa-fill);
		padding: 10px 12px;
	}

	.mobile-financing-card > div {
		display: grid;
		width: var(--sa-mobile-pill-h);
		height: var(--sa-mobile-pill-h);
		place-items: center;
		border-radius: 50%;
		background: #fff;
		color: var(--sa-blue);
	}

	.mobile-financing-card span {
		display: grid;
		min-width: 0;
		gap: 4px;
	}

	.mobile-financing-card strong {
		color: #111827;
		font-size: var(--sa-text-base);
		font-weight: 800;
		line-height: 1.1;
	}

	.mobile-financing-card small {
		color: #66707a;
		font-size: var(--sa-text-xs);
		font-weight: 700;
		line-height: 1.28;
	}

	.mobile-financing-steps {
		display: grid;
		gap: var(--sa-mobile-gap-sm);
		margin: 0;
		padding: 0;
		list-style: none;
	}

	.mobile-financing-steps li {
		display: grid;
		grid-template-columns: 34px minmax(0, 1fr) 20px;
		min-height: 58px;
		align-items: center;
		gap: var(--sa-mobile-gap-sm);
		border-radius: 12px;
		background: var(--sa-fill);
		padding: 10px 12px;
	}

	.mobile-financing-steps strong {
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

	.mobile-financing-steps span {
		color: #111827;
		font-size: var(--sa-text-sm);
		font-weight: 800;
		line-height: 1.25;
	}

	.mobile-financing-steps :global(svg) {
		color: var(--sa-blue);
	}

	.mobile-financing-faq article {
		display: grid;
		gap: 6px;
		border-radius: 12px;
		background: var(--sa-fill);
		padding: 12px;
	}

	.mobile-financing-faq strong {
		color: #111827;
		font-size: var(--sa-text-base);
		font-weight: 800;
		line-height: 1.15;
	}

	.mobile-financing-faq small {
		color: #66707a;
		font-size: var(--sa-text-sm);
		font-weight: 700;
		line-height: 1.35;
	}

	.mobile-financing-cta {
		display: grid;
		overflow: hidden;
		border-radius: 12px;
		background: var(--sa-blue);
		padding: 16px var(--sa-mobile-gutter-wide);
		color: #fff;
	}

	.mobile-financing-cta > div {
		display: grid;
		gap: 8px;
		justify-items: start;
	}

	.mobile-financing-cta h2 {
		margin: 0;
		color: #fff;
		font-size: var(--sa-text-xl);
		font-weight: 800;
		line-height: 1.1;
	}

	.mobile-financing-cta p {
		margin: 0;
		color: rgba(255, 255, 255, 0.86);
		font-size: var(--sa-text-sm);
		font-weight: 700;
		line-height: 1.3;
	}

	.mobile-financing-cta a {
		display: inline-flex;
		min-height: var(--sa-mobile-hero-cta-h);
		align-items: center;
		gap: 7px;
		margin-top: 4px;
		border-radius: 999px;
		background: #fff;
		padding: 0 14px;
		color: var(--sa-blue) !important;
		font-size: var(--sa-text-sm);
		font-weight: 800;
	}

	.mobile-financing-cta a :global(svg) {
		color: var(--sa-blue) !important;
		stroke: var(--sa-blue) !important;
	}

	@media (max-width: 991px) {
		.mobile-financing-app {
			display: block;
		}
	}
</style>
