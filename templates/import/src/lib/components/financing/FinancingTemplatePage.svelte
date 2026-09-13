<script lang="ts">
	import type { AuxeroPageDocument } from '$lib/auxero/page-document';
	import type {
		HomeFiveFooterData,
		HomeFiveHeaderData,
		HomeFiveModalsData
	} from '$lib/auxero/home-five';
	import type { HomePageCopy } from '$lib/i18n/messages';
	import { resolve } from '$app/paths';
	import PageBanner from '$lib/components/common/PageBanner.svelte';
	import AuxeroPublicShell from '$lib/components/layout/AuxeroPublicShell.svelte';

	let {
		initialPrice,
		pageDocument,
		shellCopy,
		shellFooter,
		shellHeader,
		shellModals,
		shellRuntimeHtml
	}: {
		initialPrice: number;
		pageDocument: AuxeroPageDocument;
		shellCopy: HomePageCopy;
		shellFooter: HomeFiveFooterData;
		shellHeader: HomeFiveHeaderData;
		shellModals?: HomeFiveModalsData;
		shellRuntimeHtml: string;
	} = $props();

	const banner = {
		description:
			'Ориентировъчна месечна вноска за избрания автомобил. Финалните условия се потвърждават с партньорска банка преди покупка.',
		eyebrow: 'Day Night Auto финансиране',
		image: '/assets/daynight/services/evaluate-link-service.webp',
		title: 'Финансиране на автомобил'
	};

	const termOptions = [12, 24, 36, 48, 60, 72, 84];

	// The URL param seeds the field once; user edits then own the state.
	// svelte-ignore state_referenced_locally
	let price = $state(initialPrice);
	let downPayment = $state(1000);
	// 72 months is the basis the card "EUR/мес." teasers use (price / 72).
	let months = $state(72);
	let annualRate = $state(1.2);

	const financed = $derived(Math.max(0, (price || 0) - (downPayment || 0)));

	const monthly = $derived.by(() => {
		if (!financed || !months) return 0;

		const monthlyRate = (annualRate || 0) / 100 / 12;
		if (monthlyRate <= 0) return financed / months;

		return (financed * monthlyRate) / (1 - Math.pow(1 + monthlyRate, -months));
	});

	const totalCost = $derived(monthly * months + (downPayment || 0));

	const formatEur = (value: number) =>
		`${Math.round(value)
			.toLocaleString('fr-FR')
			.replace(/\u202f/g, ' ')} €`;

	const steps = [
		{
			text: 'Избери автомобил от наличните или заяви подбор на автомобили — вноската се смята от реалната крайна цена.',
			title: 'Избери автомобил'
		},
		{
			text: 'Изпрати запитване с избрания автомобил. Day Night Auto подготвя офертата с партньорска банка.',
			title: 'Заяви оферта'
		},
		{
			text: 'Получаваш конкретни условия, срок и вноска преди оглед — без ангажимент.',
			title: 'Потвърди условията'
		}
	];
</script>

<AuxeroPublicShell
	copy={shellCopy}
	footer={shellFooter}
	header={shellHeader}
	modals={shellModals}
	{pageDocument}
	runtimeHtml={shellRuntimeHtml}
	title="Финансиране — Day Night Auto"
>
	<div class="daynight-financing-page" data-daynight-financing>
		<PageBanner {banner} />

		<section class="background-light py-100">
			<div class="container">
				<div class="daynight-financing-page__grid">
					<div class="daynight-financing-page__copy">
						<p class="daynight-financing-page__eyebrow">Как работи</p>
						<h2>Ясна вноска преди оглед</h2>

						<div class="daynight-financing-page__steps">
							{#each steps as step, index (step.title)}
								<article>
									<span>Стъпка {index + 1}</span>
									<h3>{step.title}</h3>
									<p>{step.text}</p>
								</article>
							{/each}
						</div>

						<div class="daynight-financing-page__ctas">
							<a href={resolve('/inventory')} class="daynight-financing-page__cta-primary">
								Виж наличните автомобили
							</a>
							<a href={resolve('/contact')} class="daynight-financing-page__cta-secondary">
								Запитване за финансиране
							</a>
						</div>
					</div>

					<aside class="daynight-financing-page__card" aria-label="Калкулатор за месечна вноска">
						<h3>Изчисли месечна вноска</h3>

						<div class="daynight-financing-page__fields">
							<label>
								<span>Цена на автомобила (EUR)</span>
								<input type="number" inputmode="numeric" min="1000" step="500" bind:value={price} />
							</label>
							<label>
								<span>Първоначална вноска (EUR)</span>
								<input
									type="number"
									inputmode="numeric"
									min="0"
									step="500"
									bind:value={downPayment}
								/>
							</label>
							<label>
								<span>Срок (месеци)</span>
								<select bind:value={months}>
									{#each termOptions as option (option)}
										<option value={option}>{option} месеца</option>
									{/each}
								</select>
							</label>
							<label>
								<span>Лихвен процент (%)</span>
								<input
									type="number"
									inputmode="decimal"
									min="0"
									step="0.1"
									bind:value={annualRate}
								/>
							</label>
						</div>

						<dl class="daynight-financing-page__summary">
							<div>
								<dt>Финансирана сума</dt>
								<dd>{formatEur(financed)}</dd>
							</div>
							<div>
								<dt>Ориентировъчна обща сума</dt>
								<dd>{formatEur(totalCost)}</dd>
							</div>
							<div class="daynight-financing-page__summary-main">
								<dt>Месечна вноска</dt>
								<dd>{formatEur(monthly)}<small>/мес.</small></dd>
							</div>
						</dl>

						<p class="daynight-financing-page__note">
							Сумите са ориентировъчни. Конкретната оферта зависи от партньорската банка и профила
							на купувача.
						</p>
					</aside>
				</div>
			</div>
		</section>
	</div>
</AuxeroPublicShell>

<style>
	.daynight-financing-page {
		background: var(--bc-bg-strong);
	}

	.daynight-financing-page :global(.background-light) {
		background: var(--bc-bg) !important;
	}

	.daynight-financing-page__grid {
		display: grid;
		grid-template-columns: minmax(0, 1.15fr) minmax(0, 1fr);
		gap: 30px;
		align-items: start;
	}

	.daynight-financing-page__eyebrow {
		margin: 0 0 var(--bc-space-2);
		color: var(--primary);
		font-size: var(--bc-mobile-meta);
		font-weight: 700;
		letter-spacing: 0.04em;
		line-height: var(--bc-mobile-label-leading);
		text-transform: uppercase;
	}

	.daynight-financing-page__copy h2 {
		max-width: 620px;
		margin: 0 0 var(--bc-space-4);
		color: var(--bc-ink);
		font-size: clamp(34px, 4vw, 52px);
		font-weight: 700;
		letter-spacing: 0;
		line-height: 1.08;
	}

	.daynight-financing-page__steps {
		display: grid;
		grid-template-columns: repeat(3, minmax(0, 1fr));
		gap: var(--bc-space-3);
	}

	.daynight-financing-page__steps article {
		border: 1px solid var(--bc-border);
		border-radius: var(--bc-radius-card);
		background: var(--bc-surface-raised);
		padding: var(--bc-space-4);
	}

	.daynight-financing-page__steps article:hover {
		background: var(--bc-surface-hover);
	}

	.daynight-financing-page__steps span {
		display: block;
		margin-bottom: 8px;
		color: var(--primary);
		font-size: var(--bc-mobile-meta);
		font-weight: 700;
		letter-spacing: 0.04em;
		line-height: 16px;
		text-transform: uppercase;
	}

	.daynight-financing-page__steps h3 {
		margin: 0 0 var(--bc-space-2);
		color: var(--bc-ink);
		font-size: var(--bc-mobile-card-title);
		font-weight: 700;
		letter-spacing: 0;
		line-height: var(--bc-mobile-card-title-leading);
	}

	.daynight-financing-page__steps p {
		margin: 0;
		color: var(--bc-copy);
		font-size: var(--bc-mobile-body);
		line-height: var(--bc-mobile-body-leading);
	}

	.daynight-financing-page__ctas {
		display: flex;
		flex-wrap: wrap;
		gap: var(--bc-space-3);
		margin-top: var(--bc-space-5);
	}

	.daynight-financing-page__cta-primary,
	.daynight-financing-page__cta-secondary {
		display: inline-flex;
		min-height: var(--bc-control-height-primary);
		align-items: center;
		justify-content: center;
		border-radius: var(--bc-radius-control);
		font-size: var(--bc-mobile-body);
		font-weight: 600;
		padding: 0 var(--bc-space-5);
		text-decoration: none !important;
		transition:
			background-color 0.2s ease,
			border-color 0.2s ease,
			color 0.2s ease;
	}

	.daynight-financing-page__cta-primary {
		background: var(--bc-ink);
		color: var(--bc-white) !important;
	}

	.daynight-financing-page__cta-primary:hover,
	.daynight-financing-page__cta-primary:focus-visible {
		background: var(--bc-accent-hover);
		color: var(--bc-white) !important;
	}

	.daynight-financing-page__cta-secondary {
		border: 1px solid var(--bc-border);
		background: var(--bc-surface-soft);
		color: var(--bc-ink) !important;
	}

	.daynight-financing-page__cta-secondary:hover,
	.daynight-financing-page__cta-secondary:focus-visible {
		border-color: var(--bc-accent);
		background: var(--bc-white);
		color: var(--bc-ink) !important;
	}

	.daynight-financing-page__card {
		border: 1px solid var(--bc-border);
		border-radius: var(--bc-radius-card);
		background: var(--bc-white);
		padding: var(--bc-space-6);
	}

	.daynight-financing-page__card h3 {
		margin: 0 0 var(--bc-space-4);
		color: var(--bc-ink);
		font-size: var(--bc-mobile-section-title);
		font-weight: 700;
		line-height: var(--bc-mobile-section-title-leading);
	}

	.daynight-financing-page__fields {
		display: grid;
		grid-template-columns: repeat(2, minmax(0, 1fr));
		gap: var(--bc-space-3);
	}

	.daynight-financing-page__fields label {
		display: block;
	}

	.daynight-financing-page__fields span {
		display: block;
		margin-bottom: var(--bc-space-2);
		color: var(--bc-copy);
		font-size: var(--bc-mobile-label);
		font-weight: 600;
		line-height: var(--bc-mobile-label-leading);
	}

	.daynight-financing-page__fields input,
	.daynight-financing-page__fields select {
		width: 100%;
		min-height: var(--bc-control-height-primary);
		border: 1px solid var(--bc-border);
		border-radius: var(--bc-radius-card);
		background: var(--bc-surface-soft);
		color: var(--bc-ink);
		font-size: 16px;
		font-weight: 600;
		padding: 0 var(--bc-mobile-gutter);
	}

	.daynight-financing-page__fields input:focus-visible,
	.daynight-financing-page__fields select:focus-visible {
		border-color: var(--bc-accent);
		background: var(--bc-white);
		outline: none;
	}

	.daynight-financing-page__summary {
		margin: var(--bc-space-5) 0 0;
		border-top: 1px solid var(--bc-border);
		padding-top: var(--bc-space-4);
	}

	.daynight-financing-page__summary div {
		display: flex;
		align-items: baseline;
		justify-content: space-between;
		gap: var(--bc-space-4);
		padding: 5px 0;
	}

	.daynight-financing-page__summary dt {
		color: var(--bc-copy);
		font-size: var(--bc-mobile-body);
		line-height: 20px;
	}

	.daynight-financing-page__summary dd {
		margin: 0;
		color: var(--bc-ink);
		font-size: 16px;
		font-weight: 600;
		line-height: 22px;
		white-space: nowrap;
	}

	.daynight-financing-page__summary-main {
		margin-top: var(--bc-space-2);
		border-top: 1px solid var(--bc-border);
		padding-top: var(--bc-space-3) !important;
	}

	.daynight-financing-page__summary-main dd {
		border-radius: var(--bc-radius-card);
		background: var(--bc-accent-tint);
		font-size: var(--bc-mobile-price);
		font-weight: 700;
		line-height: var(--bc-mobile-price-leading);
		padding: 2px var(--bc-space-3);
	}

	.daynight-financing-page__summary-main dd small {
		font-size: var(--bc-mobile-body);
		font-weight: 600;
	}

	.daynight-financing-page__note {
		margin: 16px 0 0;
		color: var(--bc-muted);
		font-size: var(--bc-mobile-label);
		line-height: 19px;
	}

	@media (max-width: 767.98px) {
		.daynight-financing-page :global(.background-light) {
			padding-top: var(--bc-space-8) !important;
			padding-bottom: var(--bc-space-8) !important;
		}

		.daynight-financing-page__grid {
			gap: var(--bc-space-6);
		}

		.daynight-financing-page__copy h2 {
			font-size: var(--bc-mobile-page-title);
			line-height: var(--bc-mobile-page-title-leading);
		}

		.daynight-financing-page__steps article,
		.daynight-financing-page__card {
			padding: var(--bc-space-4);
		}
	}

	@media (max-width: 767.98px) {
		.daynight-financing-page :global(.background-light) {
			padding-top: var(--bc-space-8) !important;
			padding-bottom: var(--bc-space-8) !important;
		}

		.daynight-financing-page__grid {
			gap: var(--bc-space-6);
		}

		.daynight-financing-page__copy h2 {
			font-size: var(--bc-mobile-page-title);
			line-height: var(--bc-mobile-page-title-leading);
		}

		.daynight-financing-page__steps article,
		.daynight-financing-page__card {
			padding: var(--bc-space-4);
		}
	}

	@media (max-width: 991px) {
		.daynight-financing-page__grid {
			grid-template-columns: 1fr;
		}

		.daynight-financing-page__steps {
			grid-template-columns: 1fr;
		}
	}

	@media (max-width: 575px) {
		.daynight-financing-page__fields {
			grid-template-columns: 1fr;
		}
	}
</style>
