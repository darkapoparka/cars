<script lang="ts">
	import { nativeMessage } from '$lib/i18n/native';
	import { page } from '$app/state';
	const nt = (key: import('$lib/i18n/native').NativeKey) =>
		nativeMessage(page.data.locale === 'en' ? 'en' : 'bg', key);
	import type { PageProps } from './$types';
	import PageIntro from '$lib/components/common/PageIntro.svelte';
	import ProcessSteps from '$lib/components/common/ProcessSteps.svelte';
	import ModeTabs from '$lib/components/common/MobileModeTabs.svelte';
	import Action from '$lib/components/common/Action.svelte';
	import SellCarWizard from '$lib/components/sell-your-car/SellCarWizard.svelte';
	import SellYourCarMobilePage from '$lib/components/sell-your-car/SellYourCarMobilePage.svelte';
	let { data }: PageProps = $props();
	let mode = $state('vin');
	let session = $state(0);
	const english = $derived(data.locale === 'en');
	const title = $derived(english ? 'Sell your car' : 'Продай автомобила си');
</script>

<svelte:head
	><title>{title} — {data.site.identity.name}</title><meta
		name="description"
		content={english
			? 'Request a vehicle appraisal with its VIN or make and model.'
			: 'Заяви оценка с VIN или марка и модел на автомобила.'}
	/></svelte:head
>
<main id="main-content">
	<noscript
		><div class="site-container nojs-request">
			<p>{nt('ui252')}</p>
			<Action href="/contact">{nt('ui253')}</Action>
		</div></noscript
	>
	<div class="site-desktop-only">
		<PageIntro
			align="center"
			{title}
			image="/assets/daynight/services/sell-car-service.webp"
			description={english
				? 'Share the car details and discuss the next step.'
				: 'Сподели данните за автомобила и обсъди следващата стъпка.'}
		/>
		<section class="site-section">
			<div class="site-container sell-page">
				<div class="site-panel site-stack service-intake">
					<ModeTabs
						bind:value={mode}
						surface="light"
						label={english ? 'Vehicle identification' : 'Данни за автомобила'}
						idPrefix="desktop-sell-mode"
						options={[
							{ value: 'vin', label: 'VIN', panelId: 'desktop-sell-intake' },
							{
								value: 'manual',
								label: english ? 'Make / model' : 'Марка / модел',
								panelId: 'desktop-sell-intake'
							}
						]}
					/>
					<div
						id="desktop-sell-intake"
						role="tabpanel"
						aria-labelledby={'desktop-sell-mode-' + mode}
					>
						{#key mode + session}<SellCarWizard
								initial={{ vin: data.vin }}
								manualEntry={mode === 'manual'}
								embedded
								onclose={() => (session += 1)}
							/>{/key}
					</div>
				</div>
				<div class="service-process">
					<h2 class="site-heading">
						{english ? 'How the appraisal works' : 'Как протича оценката'}
					</h2>
					<ProcessSteps steps={data.steps} horizontal /><Action
						href={data.site.contact.phoneHref}
						variant="secondary"
						>{english ? 'Contact us' : 'Свържи се с нас'} · {data.site.contact.phone}</Action
					>
				</div>
			</div>
		</section>
	</div>
	<div class="site-mobile-only">
		<h1 class="sr-only">{title}</h1>
		<SellYourCarMobilePage
			copy={data.mobileCopy}
			form={data.form}
			steps={data.mobileSteps}
			embedded
		/>
	</div>
</main>

<style>
	.nojs-request {
		display: grid;
		gap: var(--bc-space-3);
		margin-block: var(--bc-space-4);
		padding: var(--bc-space-4);
		border-radius: var(--bc-radius-card);
		background: var(--bc-surface);
	}
	.sell-page {
		display: grid;
		grid-template-columns: minmax(0, 1fr);
		gap: var(--bc-section-sm);
	}
	.service-intake {
		width: min(100%, 860px);
		margin-inline: auto;
		padding: var(--bc-space-8);
	}
	.service-process {
		display: grid;
		gap: var(--bc-space-6);
	}
	.service-process > h2 {
		text-align: center;
	}
	.service-process > :global(.site-action) {
		justify-self: center;
	}
</style>
