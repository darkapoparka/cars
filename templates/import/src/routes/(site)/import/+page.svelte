<script lang="ts">
	import { publicPageCopy } from '$lib/content/desktop-copy';
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
	const copy = $derived(publicPageCopy[data.locale].import);
	let mode = $state('listing');
	let session = $state(0);
	const title = $derived(copy.title);
</script>

<svelte:head
	><title>{title} — {data.site.identity.name}</title><meta
		name="description"
		content={copy.description}
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
			{title}
			image="/assets/daynight/services/premium-cars-banner-generated.webp"
			description={copy.heroDescription}
		/>
		<section class="site-section">
			<div class="site-container import-page">
				<div class="site-panel site-stack service-intake">
					<ModeTabs
						bind:value={mode}
						surface="light"
						label={copy.requestType}
						idPrefix="desktop-import-mode"
						options={[
							{ value: 'listing', label: copy.linkVin, panelId: 'desktop-import-intake' },
							{
								value: 'source',
								label: copy.find,
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
						{copy.process}
					</h2>
					<ProcessSteps steps={data.steps} horizontal /><Action
						href={data.site.contact.phoneHref}
						variant="secondary">{copy.discuss} · {data.site.contact.phone}</Action
					>
				</div>
			</div>
		</section>
	</div>
	<div class="site-mobile-only">
		<h1 class="sr-only">{title}</h1>
		<ImportRequestMobilePage
			form={data.form}
			serviceVehicles={data.serviceVehicles}
			browse={data.browse}
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
