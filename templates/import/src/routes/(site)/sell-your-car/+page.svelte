<script lang="ts">
	import { publicPageCopy } from '$lib/content/desktop-copy';
	import { nativeMessage } from '$lib/i18n/native';
	import { page } from '$app/state';
	const nt = (key: import('$lib/i18n/native').NativeKey) =>
		nativeMessage(page.data.locale === 'en' ? 'en' : 'bg', key);
	import type { PageProps } from './$types';
	import PageIntro from '$lib/components/common/PageIntro.svelte';
	import ServiceIntakeFrame from '$lib/components/services/ServiceIntakeFrame.svelte';
	import ModeTabs from '$lib/components/common/MobileModeTabs.svelte';
	import Action from '$lib/components/common/Action.svelte';
	import SellCarWizard from '$lib/components/sell-your-car/SellCarWizard.svelte';
	import SellYourCarMobilePage from '$lib/components/sell-your-car/SellYourCarMobilePage.svelte';
	let { data }: PageProps = $props();
	const copy = $derived(publicPageCopy[data.locale].sell);
	let mode = $state('vin');
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
			image="/assets/daynight/services/sell-car-service.webp"
			vehicleArtwork
			artworkPanelWidth="var(--bc-desktop-action-panel-width)"
			description={copy.heroDescription}
		/>
		<ServiceIntakeFrame
			steps={data.steps}
			processTitle={copy.process}
			actionHref={data.site.contact.phoneHref}
			actionLabel={copy.contact + ' · ' + data.site.contact.phone}
		>
			<ModeTabs
				bind:value={mode}
				surface="light"
				label={copy.identification}
				idPrefix="desktop-sell-mode"
				options={[
					{ value: 'vin', label: copy.vin, panelId: 'desktop-sell-intake' },
					{
						value: 'manual',
						label: copy.makeModel,
						panelId: 'desktop-sell-intake'
					}
				]}
			/>
			<div id="desktop-sell-intake" role="tabpanel" aria-labelledby={'desktop-sell-mode-' + mode}>
				{#key mode + session}<SellCarWizard
						initial={{ vin: data.vin }}
						manualEntry={mode === 'manual'}
						embedded
						onclose={() => (session += 1)}
					/>{/key}
			</div>
		</ServiceIntakeFrame>
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
</style>
