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
	import SocialLinks from '$lib/components/common/SocialLinks.svelte';
	import { contactDesktopCopy } from '$lib/content/contact-desktop';
	import { dealerCopy } from '$lib/config/dealer-copy';
	import LocaleTrigger from '$lib/locale/LocaleTrigger.svelte';
	import Phone from '@lucide/svelte/icons/phone';
	import MapPin from '@lucide/svelte/icons/map-pin';
	import Mail from '@lucide/svelte/icons/mail';
	import MessageSquare from '@lucide/svelte/icons/message-square';
	import { receiptMessage } from '$lib/domain/inquiry';
	let { data, form }: PageProps = $props();
	const english = $derived(data.locale === 'en');
	const copy = $derived(contactDesktopCopy[data.locale]);
	const emailHref = $derived(
		data.site.contact.contactHref.startsWith('mailto:') ? data.site.contact.contactHref : undefined
	);
	const emailLabel = $derived(emailHref ? new URL(emailHref).pathname : '');
</script>

<svelte:head>
	<title>{data.contactInfo.title} — {data.site.identity.name}</title>
	<meta name="description" content={data.contactInfo.description} />
</svelte:head>
<main id="main-content">
	<div class="site-desktop-only">
		<PageIntro
			title={copy.title}
			description={dealerCopy[data.locale].address}
			image="/assets/daynight/proof-studio-import-handoff.webp"
			vehicleArtwork
			artworkPanelWidth="var(--bc-desktop-action-panel-width)"
		>
			{#snippet desktopActions(caption: string | undefined)}
				<DesktopHeroActions description={caption}>
					{#snippet descriptionContent()}
						<a
							class="contact-hero-location"
							href={data.site.contact.mapHref}
							target="_blank"
							rel="noopener noreferrer"
						>
							<MapPin size={16} aria-hidden="true" />{caption ?? data.site.contact.address}
						</a>
						{#if emailHref && emailLabel}
							<a class="contact-hero-email" href={emailHref}>
								<Mail size={16} aria-hidden="true" />{emailLabel}
							</a>
						{/if}
					{/snippet}
					{#snippet secondaryActions()}
						<SocialLinks links={data.site.socials ?? []} tone="plain" />
					{/snippet}
					<Action href={data.site.contact.phoneHref} variant="strong" size="primary"
						><Phone size={18} aria-hidden="true" />{data.site.contact.phone}</Action
					>
					<Action href="#contact-enquiry" variant="secondary" size="primary"
						><MessageSquare size={18} aria-hidden="true" />{copy.enquiry}</Action
					>
				</DesktopHeroActions>
			{/snippet}
		</PageIntro>
		<section class="site-section contact-intake" id="contact-details" aria-label={copy.details}>
			<div class="site-container contact-intake-grid">
				<ContactLocation {english} layout="stacked" desktopFramed />
				<div class="contact-form-panel" id="contact-enquiry">
					<header>
						<h2 class="site-heading">{desktopCopy[data.locale].contactEnquiry}</h2>
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
	.contact-hero-location,
	.contact-hero-email {
		display: inline-flex;
		align-items: center;
		vertical-align: top;
		gap: var(--bc-space-1);
		color: var(--bc-copy);
		text-decoration: underline;
		text-decoration-color: var(--bc-muted-light);
		text-underline-offset: var(--bc-space-1);
	}
	.contact-hero-email {
		margin-inline-start: var(--bc-space-6);
	}
	.contact-hero-location:hover,
	.contact-hero-email:hover {
		color: var(--bc-ink);
		text-decoration-color: currentColor;
	}
	.contact-intake {
		padding-block: var(--bc-space-8);
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
		border-radius: var(--bc-desktop-card-radius);
		padding: var(--bc-space-6);
		background: var(--bc-surface-raised);
		box-shadow: var(--bc-editorial-shadow);
	}
	.contact-form-panel header {
		margin-bottom: var(--bc-space-6);
		text-align: left;
	}
	@media (min-width: 768px) {
		.contact-form-panel {
			padding: var(--bc-space-8);
		}
	}
	@media (max-width: 1023px) {
		.contact-intake-grid {
			grid-template-columns: minmax(0, 1fr);
		}
	}
</style>
