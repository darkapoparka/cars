<script lang="ts">
	import { nativeMessage } from '$lib/i18n/native';
	import { page } from '$app/state';
	const nt = (key: import('$lib/i18n/native').NativeKey) =>
		nativeMessage(page.data.locale === 'en' ? 'en' : 'bg', key);
	import type { PageProps } from './$types';
	import PageIntro from '$lib/components/common/PageIntro.svelte';
	import Action from '$lib/components/common/Action.svelte';
	import LeadForm from '$lib/components/common/LeadForm.svelte';
	import DesktopHeroActions from '$lib/components/common/DesktopHeroActions.svelte';
	import { desktopCopy } from '$lib/content/desktop-copy';
	import ContactMobilePage from '$lib/components/contact/ContactMobilePage.svelte';
	import ContactLocation from '$lib/components/contact/ContactLocation.svelte';
	import ImageLinkBanner from '$lib/components/common/ImageLinkBanner.svelte';
	import { desktopContactChannels } from '$lib/content/contact-desktop';
	import LocaleTrigger from '$lib/locale/LocaleTrigger.svelte';
	import Phone from '@lucide/svelte/icons/phone';
	import { receiptMessage } from '$lib/domain/inquiry';
	let { data, form }: PageProps = $props();
	const english = $derived(data.locale === 'en');
	const channels = $derived(desktopContactChannels(data.site, data.locale));
</script>

<svelte:head>
	<title>{data.contactInfo.title} — {data.site.identity.name}</title>
	<meta name="description" content={data.contactInfo.description} />
</svelte:head>
<main id="main-content">
	<div class="site-desktop-only">
		<PageIntro
			title={english ? 'Contact us' : 'Контакти'}
			description={data.site.contact.appointment}
			image="/assets/daynight/proof-studio-import-handoff.webp"
			vehicleArtwork
			artworkPanelWidth="var(--bc-desktop-action-panel-width)"
			align="center"
		>
			{#snippet desktopActions()}
				<DesktopHeroActions>
					<Action href={data.site.contact.phoneHref} size="primary"
						><Phone size={18} aria-hidden="true" />{data.site.contact.phone}</Action
					>
					<Action href="#contact-enquiry" variant="secondary" size="primary"
						>{desktopCopy[data.locale].contactEnquiry}</Action
					>
				</DesktopHeroActions>
			{/snippet}
		</PageIntro>
		<section
			class="site-section site-container contact-overview"
			id="contact-details"
			aria-label={english ? 'Contact details' : 'Връзка с нас'}
		>
			<div class="contact-channels">
				{#each channels as channel (channel.href)}
					<ImageLinkBanner
						class="contact-channel"
						channel={channel.kind}
						href={channel.href}
						image={channel.image}
						external={channel.external}
					>
						{#snippet heading()}<h2 class="contact-channel-title">{channel.title}</h2>{/snippet}
						{channel.text}
					</ImageLinkBanner>
				{/each}
			</div>
		</section>
		<section class="site-section contact-intake">
			<div class="site-container contact-intake-grid">
				<ContactLocation {english} layout="stacked" />
				<div class="contact-form-panel" id="contact-enquiry">
					<header>
						<h2 class="site-heading">{english ? 'Send an enquiry' : 'Изпрати запитване'}</h2>
					</header>
					<LeadForm
						{english}
						source={page.url.searchParams.get('topic') === 'trade-in' ? 'trade-in' : 'contact'}
						result={form}
					/>
				</div>
			</div>
		</section>
	</div>
	<div class="site-mobile-only">
		{#if form?.receipt}<div class="site-panel" role="status">
				{receiptMessage(form.receipt, english)}
			</div>{/if}<ContactMobilePage
			form={data.contactForm}
			info={data.contactInfo}
			embedded
		/>{#if form?.errors}<div class="site-panel">
				<LeadForm
					{english}
					source={page.url.searchParams.get('topic') === 'trade-in' ? 'trade-in' : 'contact'}
					result={form}
				/>
			</div>{/if}
	</div>
	<noscript
		><section class="site-container site-panel site-mobile-only">
			<LocaleTrigger />
			<h2>{nt('ui251')}</h2>
			<LeadForm
				{english}
				source={page.url.searchParams.get('topic') === 'trade-in' ? 'trade-in' : 'contact'}
				result={form}
			/>
		</section></noscript
	>
</main>

<style>
	.contact-overview {
		display: grid;
		gap: var(--bc-space-6);
		padding-block: var(--bc-space-6);
	}
	.contact-channels {
		display: grid;
		grid-template-columns: repeat(3, minmax(0, 1fr));
		gap: var(--bc-space-5);
	}
	.contact-channel-title {
		margin: 0;
		font: var(--bc-weight-heading) var(--bc-desktop-service-title)/var(--bc-leading-h4)
			var(--bc-font-body);
		color: var(--bc-white);
	}
	.contact-intake {
		padding-top: var(--bc-space-2);
	}
	.contact-intake-grid {
		display: grid;
		grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
		align-items: stretch;
		gap: var(--bc-space-6);
	}
	.contact-form-panel {
		scroll-margin-block-start: calc(var(--bc-desktop-header-height) + var(--bc-space-6));
		min-width: 0;
		border: 1px solid var(--bc-border);
		border-radius: var(--bc-radius-panel);
		padding: var(--bc-space-6);
		background: var(--bc-surface-raised);
	}
	.contact-form-panel header {
		margin-bottom: var(--bc-space-6);
		text-align: left;
	}
	@media (max-width: 1023px) {
		.contact-intake-grid {
			grid-template-columns: minmax(0, 1fr);
		}
	}
</style>
