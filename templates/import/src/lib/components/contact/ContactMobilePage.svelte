<script lang="ts">
	import { assetHref } from '$lib/utils/assets';
	import { dealerCopy } from '$lib/config/dealer-copy';
	import { nativeMessage } from '$lib/i18n/native';

	const nt = (key: import('$lib/i18n/native').NativeKey) =>
		nativeMessage(page.data.locale === 'en' ? 'en' : 'bg', key);
	import { page } from '$app/state';
	import MessageCircle from '@lucide/svelte/icons/message-circle';
	import PhoneCall from '@lucide/svelte/icons/phone-call';
	import { linkHref } from '$lib/utils/links';
	import { daynightContact } from '$lib/config/dealer';
	import type { AuxeroContactFormData, AuxeroContactPageInfo } from '$lib/auxero/contact';
	import MobilePageHero from '$lib/components/common/MobilePageHero.svelte';
	import Action from '$lib/components/common/Action.svelte';
	import MobileSheet from '$lib/components/common/MobileSheet.svelte';
	import LeadForm from '$lib/components/common/LeadForm.svelte';
	import SocialLinks from '$lib/components/common/SocialLinks.svelte';
	let {
		form,
		info,
		embedded = false
	}: { form: AuxeroContactFormData; info: AuxeroContactPageInfo; embedded?: boolean } = $props();
	let formOpen = $state(false);
	const english = $derived(page.data.locale === 'en');
	const copy = $derived(dealerCopy[english ? 'en' : 'bg']);
	const mapHref = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(daynightContact.addressLabel)}`;
	const hrefAttributes = (href: string) => ({ href: linkHref(href) });
	const openForm = () => {
		formOpen = true;
	};
</script>

<svelte:head>
	<link
		rel="preload"
		as="image"
		href={assetHref('/assets/daynight/proof-studio-import-handoff.webp')}
		media="(max-width: 767px)"
		fetchpriority="high"
	/>
</svelte:head>

<div
	class="daynight-contact-mobile"
	data-daynight-contact-mobile
	data-form-open={formOpen ? 'true' : 'false'}
>
	<svelte:element this={embedded ? 'section' : 'main'} class="daynight-contact-mobile__main">
		<MobilePageHero
			title={english ? 'Contact us' : 'Контакти'}
			description={copy.appointment}
			image="/assets/daynight/proof-studio-import-handoff.webp"
			titleId="contact-mobile-title"
			align="center"
		>
			{#snippet actions()}
				<nav class="daynight-contact-mobile__actions" aria-label={nt('ui36')}>
					<Action href={info.phoneHref} variant="secondary" size="compact"
						><PhoneCall size={18} strokeWidth={2.25} aria-hidden="true" />{nt('ui37')}</Action
					>
					<Action href={daynightContact.viberHref} variant="glass" size="compact"
						><MessageCircle size={18} strokeWidth={2.25} aria-hidden="true" />{nt('ui38')}</Action
					>
				</nav>
			{/snippet}
		</MobilePageHero>
		<div class="daynight-contact-mobile__body">
			<section class="daynight-contact-mobile__location" aria-label={nt('ui19')}>
				<iframe
					src={daynightContact.mapEmbedUrl}
					title={copy.address}
					loading="lazy"
					referrerpolicy="no-referrer-when-downgrade"
					allowfullscreen
				></iframe>
				<div>
					<h2>{copy.address}</h2>
					<Action href={mapHref} variant="quiet" size="compact" target="_blank" rel="noreferrer">
						{nt('ui44')}
					</Action>
				</div>
			</section>
			<section class="daynight-contact-mobile__info" aria-label={nt('ui41')}>
				<div>
					<p>{nt('ui23')}</p>
					<a {...hrefAttributes(info.phoneHref)}>{info.phoneLabel}</a>
					{#if info.secondaryPhoneHref !== info.phoneHref || info.secondaryPhoneLabel !== info.phoneLabel}
						<a {...hrefAttributes(info.secondaryPhoneHref)}>{info.secondaryPhoneLabel}</a>
					{/if}
				</div>
				<div>
					{#if info.emailHref.startsWith('mailto:')}<p>{nt('ui42')}</p>{/if}
					<a {...hrefAttributes(info.emailHref)}>{info.emailLabel}</a>
				</div>
			</section>

			<Action
				variant="strong"
				size="primary"
				onclick={openForm}
				aria-label={nt('ui39')}
				aria-haspopup="dialog"
				aria-expanded={formOpen}
			>
				{english ? 'Send an enquiry' : 'Изпрати запитване'}
			</Action>
			<div class="daynight-contact-mobile__socials">
				<p>{english ? 'Follow us' : 'Последвай ни'}</p>
				<SocialLinks />
			</div>
		</div>
	</svelte:element>

	<MobileSheet bind:open={formOpen} title={form.title}
		><LeadForm
			{english}
			source={page.url.searchParams.get('topic') === 'trade-in' ? 'trade-in' : 'contact'}
		/></MobileSheet
	>
</div>

<style>
	.daynight-contact-mobile {
		min-height: 100svh;
		background: var(--bc-bg-strong);
		color: var(--bc-ink);
	}
	.daynight-contact-mobile__body {
		display: grid;
		gap: var(--bc-space-4);
		padding: var(--bc-space-4) var(--bc-mobile-gutter)
			calc(var(--bc-mobile-nav-height) + var(--bc-space-6));
	}
	.daynight-contact-mobile__actions {
		display: flex;
		justify-content: center;
		flex-wrap: wrap;
		gap: var(--bc-space-2);
	}
	.daynight-contact-mobile__actions :global(.site-action) {
		border-radius: var(--bc-radius-pill);
		padding-inline: var(--bc-space-4);
	}
	.daynight-contact-mobile__location {
		overflow: hidden;
		border-radius: var(--bc-radius-card);
		background: var(--bc-white);
	}
	.daynight-contact-mobile__location iframe {
		display: block;
		width: 100%;
		height: 184px;
		border: 0;
		background: var(--bc-surface);
	}
	.daynight-contact-mobile__location > div {
		padding: var(--bc-space-3) var(--bc-space-4) 0;
	}
	.daynight-contact-mobile__location h2 {
		margin: 0;
		font: var(--bc-weight-heading) var(--bc-mobile-card-title)/1.4 var(--bc-font-body);
	}
	.daynight-contact-mobile__location :global(.site-action) {
		padding-inline: 0;
		font-weight: var(--bc-weight-body);
		text-decoration: underline;
		text-underline-offset: 3px;
	}
	.daynight-contact-mobile__info {
		display: grid;
		gap: var(--bc-space-4);
		padding-inline: var(--bc-space-1);
	}
	.daynight-contact-mobile__info > div {
		display: grid;
		gap: var(--bc-space-1);
		min-width: 0;
	}
	.daynight-contact-mobile__info p {
		margin: 0;
		color: var(--bc-muted);
		font: var(--bc-weight-body) var(--bc-mobile-label)/1.25 var(--bc-font-body);
	}
	.daynight-contact-mobile__info div > a {
		color: var(--bc-ink);
		font: var(--bc-weight-heading) var(--bc-mobile-card-title)/1.333333 var(--bc-font-body);
		overflow-wrap: anywhere;
		text-decoration: none;
	}
	.daynight-contact-mobile__info div > a {
		display: inline-flex;
		min-height: var(--bc-control-height-standard);
		align-items: center;
	}
	.daynight-contact-mobile__socials {
		display: grid;
		gap: var(--bc-space-2);
		padding-top: var(--bc-space-2);
		text-align: center;
	}
	.daynight-contact-mobile__socials p {
		margin: 0;
		color: var(--bc-muted);
		font: var(--bc-weight-body) var(--bc-mobile-label)/1.25 var(--bc-font-body);
	}
</style>
