<script lang="ts">
	import { publicPageCopy } from '$lib/content/desktop-copy';
	import { nativeMessage } from '$lib/i18n/native';
	import { page } from '$app/state';
	const nt = (key: import('$lib/i18n/native').NativeKey) =>
		nativeMessage(page.data.locale === 'en' ? 'en' : 'bg', key);
	import type { PageProps } from './$types';
	import { tick, type Snippet } from 'svelte';
	import Link2 from '@lucide/svelte/icons/link-2';
	import Search from '@lucide/svelte/icons/search';
	import PageIntro from '$lib/components/common/PageIntro.svelte';
	import DesktopDiscoveryPanel from '$lib/components/common/DesktopDiscoveryPanel.svelte';
	import ServiceIntakeFrame from '$lib/components/services/ServiceIntakeFrame.svelte';
	import ModeTabs from '$lib/components/common/MobileModeTabs.svelte';
	import Action from '$lib/components/common/Action.svelte';
	import ImportRequestWizard from '$lib/components/services/ImportRequestWizard.svelte';
	import ImportRequestMobilePage from '$lib/components/services/ImportRequestMobilePage.svelte';
	import type { ImportIntent } from '$lib/domain/import-entry';
	let { data }: PageProps = $props();
	const copy = $derived(publicPageCopy[data.locale].import);
	let modeOverride = $state<ImportIntent | null>(null);
	let overrideKey = $state('');
	const mode = $derived(
		overrideKey === data.desktopEntry.key && modeOverride ? modeOverride : data.desktopEntry.intent
	);
	function setMode(value: string) {
		modeOverride = value === 'source' ? 'source' : 'listing';
		overrideKey = data.desktopEntry.key;
	}
	let session = $state(0);
	const title = $derived(copy.title);
	const resetSession = async () => {
		session += 1;
		await tick();
		document.getElementById('desktop-import-mode-' + mode)?.focus();
	};
</script>

<svelte:head
	><title>{title} — {data.site.identity.name}</title><meta
		name="description"
		content={copy.description}
	/></svelte:head
>
{#snippet modeSelector()}
	<ModeTabs
		value={mode}
		onchange={setMode}
		surface="light"
		appearance="choices"
		class="import-mode-selector"
		label={copy.requestType}
		idPrefix="desktop-import-mode"
		options={[
			{ value: 'listing', label: copy.linkVin, icon: Link2, panelId: 'desktop-import-intake' },
			{ value: 'source', label: copy.find, icon: Search, panelId: 'desktop-import-intake' }
		]}
	/>
{/snippet}
{#snippet intakePanel(wizard: Snippet)}
	<div id="desktop-import-intake" role="tabpanel" aria-labelledby={'desktop-import-mode-' + mode}>
		{@render wizard()}
	</div>
{/snippet}
{#snippet importLayout(wizard: Snippet, entry: boolean)}
	{#snippet heroActions()}
		<DesktopDiscoveryPanel header={modeSelector}>
			<p class="sr-only">{copy.heroDescription}</p>
			{@render intakePanel(wizard)}
		</DesktopDiscoveryPanel>
	{/snippet}
	{#snippet laterSteps()}
		{@render modeSelector()}
		{@render intakePanel(wizard)}
	{/snippet}
	<PageIntro
		{title}
		image="/assets/daynight/services/premium-cars-banner-generated.webp"
		vehicleArtwork
		compact={!entry}
		description={copy.heroDescription}
		desktopActions={entry ? heroActions : undefined}
	/>
	<ServiceIntakeFrame
		steps={data.steps}
		processTitle={copy.process}
		actionHref={data.site.contact.phoneHref}
		actionLabel={copy.discuss + ' · ' + data.site.contact.phone}
		children={entry ? undefined : laterSteps}
	/>
{/snippet}
<main id="main-content">
	<noscript
		><div class="site-container nojs-request">
			<p>{nt('ui252')}</p>
			<Action href="/contact">{nt('ui253')}</Action>
		</div></noscript
	>
	<div class="site-desktop-only">
		{#key data.desktopEntry.key + mode + session}<ImportRequestWizard
				initialIntent={mode === 'source' ? 'source' : 'listing'}
				initialVehicle={data.form.vehicleField.value ?? ''}
				initialCriteria={data.criteria}
				initialStep={mode === data.desktopEntry.intent ? data.desktopEntry.step : 0}
				embedded
				desktopLayout={importLayout}
				onclose={resetSession}
			/>{/key}
	</div>
	<div class="site-mobile-only">
		<h1 class="sr-only">{title}</h1>
		<ImportRequestMobilePage
			intakeOptions={data.intakeOptions}
			form={data.form}
			serviceVehicles={data.serviceVehicles}
			browse={data.browse}
			embedded
		/>
	</div>
</main>

<style>
	@media (min-width: 768px) {
		:global(.site-desktop-only .import-mode-selector) {
			max-width: 420px;
			margin-inline: auto;
		}
	}
	.nojs-request {
		display: grid;
		gap: var(--bc-space-3);
		margin-block: var(--bc-space-4);
		padding: var(--bc-space-4);
		border-radius: var(--bc-radius-card);
		background: var(--bc-surface);
	}
</style>
