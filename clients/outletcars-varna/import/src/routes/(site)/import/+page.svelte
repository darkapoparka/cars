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
	import ImportRequestWizard from '$lib/components/services/ImportRequestWizard.svelte';
	import ImportRequestMobilePage from '$lib/components/services/ImportRequestMobilePage.svelte';
	let { data }: PageProps = $props();
	let mode = $state('listing');
	let session = $state(0);
	const english = $derived(data.locale === 'en');
	const title = $derived(english ? 'Import a car' : 'Внос на автомобил');
</script>

<svelte:head
	><title>{title} — {data.site.identity.name}</title><meta
		name="description"
		content={english
			? 'Send a listing or VIN, or describe the car you are looking for.'
			: 'Изпрати линк или VIN, или опиши автомобила, който търсиш.'}
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
			image="/assets/daynight/services/premium-cars-banner-generated.webp"
			description={english
				? 'Send a listing or VIN. Understand the car and the costs before deciding.'
				: 'Изпрати линк или VIN. Уточни автомобила и разходите преди решение.'}
		/>
		<section class="site-section">
			<div class="site-container import-page">
				<div class="site-panel site-stack service-intake">
					<ModeTabs
						bind:value={mode}
						surface="light"
						label={english ? 'Request type' : 'Начин за заявка'}
						idPrefix="desktop-import-mode"
						options={[
							{ value: 'listing', label: 'LINK / VIN', panelId: 'desktop-import-intake' },
							{
								value: 'source',
								label: english ? 'Find a car' : 'Нямам линк',
								panelId: 'desktop-import-intake'
							}
						]}
					/>
					<div
						id="desktop-import-intake"
						role="tabpanel"
						aria-labelledby={'desktop-import-mode-' + mode}
					>
						{#key mode + session}<ImportRequestWizard
								initialIntent={mode === 'source' ? 'source' : 'listing'}
								initialVehicle={data.form.vehicleField.value ?? ''}
								initialCriteria={data.criteria}
								embedded
								onclose={() => (session += 1)}
							/>{/key}
					</div>
				</div>
				<div class="service-process">
					<h2 class="site-heading">
						{english ? 'From a listing to a decision' : 'От обява до решение'}
					</h2>
					<ProcessSteps steps={data.steps} horizontal /><Action
						href={data.site.contact.phoneHref}
						variant="secondary"
						>{english ? 'Discuss your search' : 'Обсъди търсенето'} · {data.site.contact
							.phone}</Action
					>
				</div>
			</div>
		</section>
	</div>
	<div class="site-mobile-only">
		<h1 class="sr-only">{title}</h1>
		<ImportRequestMobilePage form={data.form} serviceVehicles={data.serviceVehicles} embedded />
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
	.import-page {
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
