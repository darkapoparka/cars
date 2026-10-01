<script lang="ts">
	import type { PageProps } from './$types';
	import PageIntro from '$lib/components/common/PageIntro.svelte';
	import ProcessSteps from '$lib/components/common/ProcessSteps.svelte';
	import FinanceEstimator from '$lib/components/financing/FinanceEstimator.svelte';
	import Action from '$lib/components/common/Action.svelte';
	let { data }: PageProps = $props();
	const english = $derived(data.locale === 'en');
	const title = $derived(english ? 'Car financing' : 'Финансиране на автомобил');
	const steps = $derived(
		english
			? [
					{
						title: 'Choose a car',
						body: 'Use the vehicle price to calculate an illustrative payment.'
					},
					{
						title: 'Request the terms',
						body: 'Discuss the deposit, term, fees and insurance before making a decision.'
					},
					{
						title: 'Review the offer',
						body: 'The lender confirms the final terms for your circumstances.'
					}
				]
			: [
					{
						title: 'Избери автомобил',
						body: 'Използвай цената на избрания автомобил за примерна месечна вноска.'
					},
					{
						title: 'Заяви условия',
						body: 'Уточни първоначалната вноска, срока, таксите и застраховките преди решение.'
					},
					{
						title: 'Прегледай офертата',
						body: 'Кредиторът потвърждава конкретните условия според твоите обстоятелства.'
					}
				]
	);
</script>

<svelte:head
	><title>{title} — {data.site.identity.name}</title><meta
		name="description"
		content={english
			? 'Calculate an illustrative monthly payment and ask about financing terms.'
			: 'Изчисли примерна месечна вноска и попитай за условията на финансиране.'}
	/></svelte:head
>
<main id="main-content">
	<PageIntro
		{title}
		align="center"
		image="/assets/daynight/services/evaluate-link-service.webp"
		description={english
			? 'An illustrative payment before you decide.'
			: 'Ориентировъчна вноска преди да решиш.'}
	/>
	<section class="site-section site-container finance-page">
		<div class="finance-page__calculator">
			{#key data.initialPrice}<FinanceEstimator
					initialPrice={data.initialPrice}
					{english}
					inquiryHref={'/contact?service=financing' +
						(data.vehicleSlug ? '&vehicle=' + encodeURIComponent(data.vehicleSlug) : '') +
						(english ? '&lang=en' : '')}
				/>{/key}
		</div>
		<section class="finance-process site-stack">
			<h2 class="site-heading">
				{data.vehicleTitle ?? (english ? 'Understand the full cost' : 'Разбери крайната цена')}
			</h2>
			<ProcessSteps
				steps={steps.map((step) => ({ title: step.title, text: step.body }))}
				horizontal
			/>
			<Action href={'/inventory' + (english ? '?lang=en' : '')} variant="strong"
				>{english ? 'Browse cars' : 'Разгледай автомобилите'}</Action
			>
		</section>
	</section>
</main>

<style>
	.finance-page {
		display: grid;
		grid-template-columns: minmax(0, 1fr);
		gap: var(--bc-section-sm);
	}
	.finance-page__calculator {
		width: min(100%, 860px);
		margin-inline: auto;
	}
	.finance-process > h2 {
		text-align: center;
	}
	.finance-process > :global(.site-action) {
		justify-self: center;
	}
</style>
