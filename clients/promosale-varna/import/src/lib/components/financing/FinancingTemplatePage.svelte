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
		eyebrow: 'Promosale Varna финансиране',
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
			.replace(/\u202f/g, ' ')} EUR`;

	const steps = [
		{
			text: 'Избери автомобил от наличните или заяви подбор на автомобили — вноската се смята от реалната крайна цена.',
			title: 'Избери автомобил'
		},
		{
			text: 'Изпрати запитване с избрания автомобил. Promosale Varna подготвя офертата с партньорска банка.',
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
	title="Финансиране — Promosale Varna"
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
		background: var(--bc-bg);
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
		margin: 0 0 8px;
		color: var(--primary);
		font-size: 12px;
		font-weight: 700;
		letter-spacing: 0.04em;
		line-height: 18px;
		text-transform: uppercase;
	}

	.daynight-financing-page__copy h2 {
		max-width: 620px;
		margin: 0 0 16px;
		color: #111111;
		font-size: clamp(34px, 4vw, 52px);
		font-weight: 700;
		letter-spacing: 0;
		line-height: 1.08;
	}

	.daynight-financing-page__steps {
		display: grid;
		grid-template-columns: repeat(3, minmax(0, 1fr));
		gap: 12px;
	}

	.daynight-financing-page__steps article {
		border: 1px solid var(--bc-border);
		border-radius: 8px;
		background: var(--bc-surface);
		padding: 18px;
	}

	.daynight-financing-page__steps article:hover {
		background: var(--bc-surface-hover);
	}

	.daynight-financing-page__steps span {
		display: block;
		margin-bottom: 8px;
		color: var(--primary);
		font-size: 12px;
		font-weight: 700;
		letter-spacing: 0.04em;
		line-height: 16px;
		text-transform: uppercase;
	}

	.daynight-financing-page__steps h3 {
		margin: 0 0 8px;
		color: #111111;
		font-size: 18px;
		font-weight: 700;
		letter-spacing: 0;
		line-height: 24px;
	}

	.daynight-financing-page__steps p {
		margin: 0;
		color: #5f5f5f;
		font-size: 14px;
		line-height: 21px;
	}

	.daynight-financing-page__ctas {
		display: flex;
		flex-wrap: wrap;
		gap: 12px;
		margin-top: 22px;
	}

	.daynight-financing-page__cta-primary,
	.daynight-financing-page__cta-secondary {
		display: inline-flex;
		min-height: 48px;
		align-items: center;
		justify-content: center;
		border-radius: var(--bc-radius-control);
		font-size: 15px;
		font-weight: 600;
		padding: 0 22px;
		text-decoration: none !important;
		transition:
			background-color 0.2s ease,
			border-color 0.2s ease,
			color 0.2s ease;
	}

	.daynight-financing-page__cta-primary {
		background: #1c1c1c;
		color: #ffffff !important;
	}

	.daynight-financing-page__cta-primary:hover,
	.daynight-financing-page__cta-primary:focus-visible {
		background: var(--bc-accent-hover);
		color: #ffffff !important;
	}

	.daynight-financing-page__cta-secondary {
		border: 1px solid var(--bc-border);
		background: var(--bc-surface-soft);
		color: #1c1c1c !important;
	}

	.daynight-financing-page__cta-secondary:hover,
	.daynight-financing-page__cta-secondary:focus-visible {
		border-color: var(--bc-accent);
		background: #ffffff;
		color: #1c1c1c !important;
	}

	.daynight-financing-page__card {
		border: 1px solid var(--bc-border);
		border-radius: 8px;
		background: #ffffff;
		padding: 26px;
	}

	.daynight-financing-page__card h3 {
		margin: 0 0 18px;
		color: #111111;
		font-size: 22px;
		font-weight: 700;
		line-height: 28px;
	}

	.daynight-financing-page__fields {
		display: grid;
		grid-template-columns: repeat(2, minmax(0, 1fr));
		gap: 14px;
	}

	.daynight-financing-page__fields label {
		display: block;
	}

	.daynight-financing-page__fields span {
		display: block;
		margin-bottom: 6px;
		color: #4b4b4b;
		font-size: 13px;
		font-weight: 600;
		line-height: 18px;
	}

	.daynight-financing-page__fields input,
	.daynight-financing-page__fields select {
		width: 100%;
		min-height: 48px;
		border: 1px solid var(--bc-border);
		border-radius: 8px;
		background: var(--bc-surface-soft);
		color: #1c1c1c;
		font-size: 16px;
		font-weight: 600;
		padding: 0 14px;
	}

	.daynight-financing-page__fields input:focus-visible,
	.daynight-financing-page__fields select:focus-visible {
		border-color: var(--bc-accent);
		background: #ffffff;
		outline: none;
	}

	.daynight-financing-page__summary {
		margin: 20px 0 0;
		border-top: 1px solid var(--bc-border);
		padding-top: 16px;
	}

	.daynight-financing-page__summary div {
		display: flex;
		align-items: baseline;
		justify-content: space-between;
		gap: 16px;
		padding: 5px 0;
	}

	.daynight-financing-page__summary dt {
		color: #5f5f5f;
		font-size: 14px;
		line-height: 20px;
	}

	.daynight-financing-page__summary dd {
		margin: 0;
		color: #1c1c1c;
		font-size: 16px;
		font-weight: 600;
		line-height: 22px;
		white-space: nowrap;
	}

	.daynight-financing-page__summary-main {
		margin-top: 8px;
		border-top: 1px solid var(--bc-border);
		padding-top: 12px !important;
	}

	.daynight-financing-page__summary-main dd {
		border-radius: 8px;
		background: rgba(227, 6, 47, 0.16);
		font-size: 26px;
		font-weight: 700;
		line-height: 34px;
		padding: 2px 12px;
	}

	.daynight-financing-page__summary-main dd small {
		font-size: 15px;
		font-weight: 600;
	}

	.daynight-financing-page__note {
		margin: 16px 0 0;
		color: #6f6f6f;
		font-size: 13px;
		line-height: 19px;
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
