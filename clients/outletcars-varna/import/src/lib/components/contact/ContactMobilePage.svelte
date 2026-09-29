<script lang="ts">
	import { dealerCopy } from '$lib/config/dealer-copy';
	import { nativeMessage } from '$lib/i18n/native';

	const nt = (key: import('$lib/i18n/native').NativeKey) =>
		nativeMessage(page.data.locale === 'en' ? 'en' : 'bg', key);
	import { page } from '$app/state';
	import Mail from '@lucide/svelte/icons/mail';
	import MapPin from '@lucide/svelte/icons/map-pin';
	import MessageCircle from '@lucide/svelte/icons/message-circle';
	import Navigation from '@lucide/svelte/icons/navigation';
	import PhoneCall from '@lucide/svelte/icons/phone-call';
	import Plus from '@lucide/svelte/icons/plus';
	import { linkHref } from '$lib/utils/links';
	import { daynightContact } from '$lib/config/dealer';
	import type { AuxeroContactFormData, AuxeroContactPageInfo } from '$lib/auxero/contact';
	import MobileAppbar from '$lib/components/layout/MobileAppbar.svelte';
	import MobileSheet from '$lib/components/common/MobileSheet.svelte';
	import LeadForm from '$lib/components/common/LeadForm.svelte';
	import SocialLinks from '$lib/components/common/SocialLinks.svelte';
	let {
		form,
		info,
		embedded = false
	}: { form: AuxeroContactFormData; info: AuxeroContactPageInfo; embedded?: boolean } = $props();
	let formOpen = $state(false);
	const mapHref = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(daynightContact.addressLabel)}`;
	const hrefAttributes = (href: string) => ({ href: linkHref(href) });
	const openForm = () => {
		formOpen = true;
	};
</script>

<div
	class="daynight-contact-mobile"
	data-daynight-contact-mobile
	data-form-open={formOpen ? 'true' : 'false'}
>
	<MobileAppbar surface="dark" />

	<svelte:element this={embedded ? 'section' : 'main'} class="daynight-contact-mobile__main">
		<section class="daynight-contact-mobile__hero" aria-labelledby="contact-mobile-title">
			<div>
				<h1 id="contact-mobile-title">{page.data.locale === 'en' ? 'Contact us' : 'Контакти'}</h1>
				<span>{dealerCopy[page.data.locale === 'en' ? 'en' : 'bg'].appointment}</span>
			</div>
		</section>
		<nav class="daynight-contact-mobile__actions" aria-label={nt('ui36')}>
			<a {...hrefAttributes(info.phoneHref)}
				><PhoneCall size={18} strokeWidth={2.25} aria-hidden="true" />{nt('ui37')}</a
			>
			<a {...hrefAttributes(daynightContact.viberHref)}
				><MessageCircle size={18} strokeWidth={2.25} aria-hidden="true" />{nt('ui38')}</a
			>
			<button
				type="button"
				onclick={openForm}
				aria-label={nt('ui39')}
				aria-haspopup="dialog"
				aria-expanded={formOpen}
				><Plus size={18} strokeWidth={2.35} aria-hidden="true" />{nt('ui40')}</button
			>
		</nav>

		<SocialLinks />

		<section class="daynight-contact-mobile__info" aria-label={nt('ui41')}>
			<article>
				<span><MapPin size={18} strokeWidth={2.25} aria-hidden="true" /></span>
				<div>
					<p>{info.officeLabel}</p>
					<strong>{dealerCopy[page.data.locale === 'en' ? 'en' : 'bg'].address}</strong>
					<small>{dealerCopy[page.data.locale === 'en' ? 'en' : 'bg'].appointment}</small>
				</div>
			</article>
			<article>
				<span><PhoneCall size={18} strokeWidth={2.25} aria-hidden="true" /></span>
				<div>
					<p>{nt('ui23')}</p>
					<a {...hrefAttributes(info.phoneHref)}>{info.phoneLabel}</a>
					{#if info.secondaryPhoneHref !== info.phoneHref || info.secondaryPhoneLabel !== info.phoneLabel}
						<a {...hrefAttributes(info.secondaryPhoneHref)}>{info.secondaryPhoneLabel}</a>
					{/if}
				</div>
			</article>
			<article>
				<span><Mail size={18} strokeWidth={2.25} aria-hidden="true" /></span>
				<div>
					<p>{nt('ui42')}</p>
					<a {...hrefAttributes(info.emailHref)}>{info.emailLabel}</a>
				</div>
			</article>
		</section>

		<section class="daynight-contact-mobile__map-card" aria-label={nt('ui19')}>
			<div class="daynight-contact-mobile__map-preview" aria-hidden="true">
				<span class="road road-a"></span>
				<span class="road road-b"></span>
				<span class="road road-c"></span>
				<span class="pin"><MapPin size={24} strokeWidth={2.45} /></span>
			</div>
			<div>
				<p>{nt('ui43')}</p>
				<strong>{dealerCopy[page.data.locale === 'en' ? 'en' : 'bg'].address}</strong>
				<a {...hrefAttributes(mapHref)} target="_blank" rel="noreferrer">
					{nt('ui44')}
					<Navigation size={17} strokeWidth={2.3} aria-hidden="true" />
				</a>
			</div>
		</section>
	</svelte:element>

	<MobileSheet bind:open={formOpen} title={form.title}
		><LeadForm
			english={page.data.locale === 'en'}
			source={page.url.searchParams.get('topic') === 'trade-in' ? 'trade-in' : 'contact'}
		/></MobileSheet
	>
</div>

<style>
	.daynight-contact-mobile {
		position: relative;
		min-height: 100svh;
		overflow-x: hidden;
		background: var(--bc-bg-strong);
		color: var(--bc-ink);
	}

	.daynight-contact-mobile__main {
		display: grid;
		gap: var(--bc-space-3);
		padding: var(--bc-space-3) var(--bc-mobile-gutter)
			calc(var(--bc-mobile-nav-height) + var(--bc-space-6));
	}

	.daynight-contact-mobile__hero {
		position: relative;
		display: grid;
		min-height: 164px;
		align-content: center;
		text-align: center;
		overflow: hidden;
		border-radius: var(--bc-radius-card);
		background:
			linear-gradient(90deg, rgb(9 10 11 / 0.9), rgb(9 10 11 / 0.7)),
			url('/assets/daynight/proof-studio-import-handoff.webp') 58% center / cover;
		color: var(--bc-white);
		padding: var(--bc-space-4);
	}

	.daynight-contact-mobile__hero div {
		display: grid;
		gap: 5px;
		max-width: 310px;
		margin-inline: auto;
	}

	.daynight-contact-mobile__hero h1,
	.daynight-contact-mobile__hero span {
		margin: 0;
		letter-spacing: 0;
	}

	.daynight-contact-mobile__hero h1 {
		color: var(--bc-white);
		font-size: var(--bc-mobile-page-title);
		font-weight: var(--bc-weight-heading);
		line-height: var(--bc-mobile-page-title-leading);
	}

	.daynight-contact-mobile__hero span {
		color: rgba(255, 255, 255, 0.82);
		font-size: var(--bc-mobile-body);
		font-weight: var(--bc-weight-body);
		line-height: var(--bc-mobile-body-leading);
	}

	.daynight-contact-mobile__actions {
		display: grid;
		grid-template-columns: repeat(3, minmax(0, 1fr));
		gap: var(--bc-space-2);
	}

	.daynight-contact-mobile__actions a,
	.daynight-contact-mobile__actions button {
		display: flex;
		min-height: var(--bc-control-height-primary);
		min-width: 0;
		align-items: center;
		justify-content: center;
		gap: var(--bc-space-2);
		overflow: hidden;
		border: 1px solid var(--bc-border);
		border-radius: var(--bc-radius-card);
		background: var(--bc-surface-raised);
		color: var(--bc-ink);
		cursor: pointer;
		font-size: var(--bc-text-control);
		font-weight: var(--bc-weight-action);
		line-height: var(--bc-leading-control);
		padding: 0 var(--bc-space-2);
		text-decoration: none !important;
		white-space: nowrap;
	}

	.daynight-contact-mobile__actions a:first-child {
		background: var(--bc-accent-bright-soft);
		color: var(--bc-ink);
	}

	.daynight-contact-mobile__actions button:focus-visible,
	.daynight-contact-mobile__actions a:focus-visible {
		background: var(--bc-surface-hover);
		color: var(--bc-ink);
		outline: 0;
	}

	@media (hover: hover) and (pointer: fine) {
		.daynight-contact-mobile__actions button:hover,
		.daynight-contact-mobile__actions a:hover {
			background: var(--bc-surface-hover);
			color: var(--bc-ink);
			outline: 0;
		}
	}

	.daynight-contact-mobile__info {
		display: grid;
		gap: var(--bc-space-2);
	}

	.daynight-contact-mobile__info article {
		display: flex;
		min-width: 0;
		align-items: flex-start;
		gap: var(--bc-space-3);
		border: 1px solid var(--bc-border);
		border-radius: var(--bc-radius-card);
		background: var(--bc-surface-raised);
		padding: var(--bc-space-3);
	}

	.daynight-contact-mobile__info article > span {
		display: flex;
		width: var(--bc-control-height-compact);
		height: var(--bc-control-height-compact);
		align-items: center;
		justify-content: center;
		flex: 0 0 var(--bc-control-height-compact);
		border-radius: var(--bc-radius-card);
		background: var(--bc-surface);
		color: var(--bc-ink);
	}

	.daynight-contact-mobile__info div {
		display: grid;
		gap: 2px;
		min-width: 0;
	}

	.daynight-contact-mobile__info p,
	.daynight-contact-mobile__info strong,
	.daynight-contact-mobile__info small,
	.daynight-contact-mobile__info a {
		margin: 0;
		letter-spacing: 0;
	}

	.daynight-contact-mobile__info p {
		color: var(--bc-muted);
		font-size: var(--bc-mobile-label);
		font-weight: var(--bc-weight-heading);
		line-height: var(--bc-mobile-label-leading);
		text-transform: uppercase;
	}

	.daynight-contact-mobile__info strong,
	.daynight-contact-mobile__info a {
		color: var(--bc-ink);
		font-size: var(--bc-mobile-card-title);
		font-weight: var(--bc-weight-heading);
		line-height: var(--bc-mobile-card-title-leading);
		overflow-wrap: anywhere;
		text-decoration: none !important;
	}

	.daynight-contact-mobile__info a {
		display: inline-flex;
		min-height: var(--bc-control-height-standard);
		align-items: center;
		margin-block: -11px;
		padding-block: 11px;
	}

	.daynight-contact-mobile__info small {
		color: var(--bc-copy);
		font-size: var(--bc-mobile-body);
		font-weight: var(--bc-weight-body);
		line-height: var(--bc-mobile-body-leading);
	}

	.daynight-contact-mobile__map-card {
		display: grid;
		grid-template-columns: 118px minmax(0, 1fr);
		gap: var(--bc-space-3);
		align-items: stretch;
		border: 1px solid var(--bc-border);
		border-radius: var(--bc-radius-card);
		background: var(--bc-surface-raised);
		padding: var(--bc-space-2);
	}

	.daynight-contact-mobile__map-card > div:last-child {
		display: grid;
		align-content: center;
		gap: 4px;
		min-width: 0;
	}

	.daynight-contact-mobile__map-card p,
	.daynight-contact-mobile__map-card strong {
		margin: 0;
		letter-spacing: 0;
	}

	.daynight-contact-mobile__map-card p {
		color: var(--bc-accent);
		font-size: var(--bc-mobile-label);
		font-weight: var(--bc-weight-heading);
		line-height: var(--bc-mobile-label-leading);
		text-transform: uppercase;
	}

	.daynight-contact-mobile__map-card strong {
		color: var(--bc-ink);
		font-size: var(--bc-mobile-card-title);
		font-weight: var(--bc-weight-heading);
		line-height: var(--bc-mobile-card-title-leading);
	}

	.daynight-contact-mobile__map-card a {
		display: inline-flex;
		width: fit-content;
		min-height: var(--bc-control-height-standard);
		align-items: center;
		gap: var(--bc-space-2);
		margin-top: var(--bc-space-1);
		border-radius: var(--bc-radius-pill);
		background: var(--bc-ink);
		color: var(--bc-white);
		font-size: var(--bc-text-control);
		font-weight: var(--bc-weight-heading);
		line-height: var(--bc-leading-control);
		padding: 0 var(--bc-space-3);
		text-decoration: none !important;
	}

	.daynight-contact-mobile__map-preview {
		position: relative;
		min-height: 118px;
		overflow: hidden;
		border-radius: var(--bc-radius-card);
		background:
			linear-gradient(135deg, rgba(254, 226, 226, 0.28), rgba(255, 255, 255, 0.82)),
			var(--bc-surface);
	}

	.daynight-contact-mobile__map-preview::before,
	.daynight-contact-mobile__map-preview::after {
		position: absolute;
		inset: 16px;
		border: 1px solid rgba(28, 28, 28, 0.08);
		border-radius: 18px;
		content: '';
	}

	.daynight-contact-mobile__map-preview::after {
		inset: 42px -22px auto 26px;
		height: 42px;
		border-right: 0;
		border-left: 0;
		transform: rotate(-8deg);
	}

	.daynight-contact-mobile__map-preview .road {
		position: absolute;
		border-radius: var(--bc-radius-pill);
		background: rgba(28, 28, 28, 0.12);
	}

	.daynight-contact-mobile__map-preview .road-a {
		top: 25px;
		left: -20px;
		width: 76%;
		height: 8px;
		transform: rotate(13deg);
	}

	.daynight-contact-mobile__map-preview .road-b {
		right: -10px;
		bottom: 28px;
		width: 74%;
		height: 8px;
		transform: rotate(-20deg);
	}

	.daynight-contact-mobile__map-preview .road-c {
		top: 7px;
		left: 48%;
		width: 8px;
		height: 118px;
		transform: rotate(20deg);
	}

	.daynight-contact-mobile__map-preview .pin {
		position: absolute;
		top: 39px;
		left: 50%;
		display: flex;
		width: 46px;
		height: 46px;
		align-items: center;
		justify-content: center;
		border: 4px solid var(--bc-white);
		border-radius: var(--bc-radius-pill);
		background: var(--bc-accent-bright-soft);
		color: var(--bc-ink);
		transform: translateX(-50%);
	}

	@media (hover: hover) and (pointer: fine) {
	}

	@media (max-width: 359px) {
		.daynight-contact-mobile__hero h1 {
			font-size: var(--bc-mobile-page-title);
			line-height: var(--bc-mobile-page-title-leading);
			font-weight: var(--bc-weight-heading);
		}
		.daynight-contact-mobile__map-card {
			grid-template-columns: 1fr;
		}
	}
</style>
