<script lang="ts">
	import { Clock3, ExternalLink, MapPin, MessageSquare, PhoneCall } from '@lucide/svelte';
	import type {
		HomeFiveFooterData,
		HomeFiveHeaderData,
		HomeFiveModalsData
	} from '$lib/auxero/home-five';
	import type { AuxeroContactFormData, AuxeroContactPageInfo } from '$lib/auxero/contact';
	import type { AuxeroPageDocument } from '$lib/auxero/page-document';
	import { daynightContact } from '$lib/data/daynight';
	import type { HomePageCopy } from '$lib/i18n/messages';
	import CenteredRouteHero from '$lib/components/common/CenteredRouteHero.svelte';
	import AuxeroPublicShell from '$lib/components/layout/AuxeroPublicShell.svelte';
	import ContactFormCard from './ContactFormCard.svelte';
	import ContactMobilePage from './ContactMobilePage.svelte';

	let {
		form,
		info,
		pageDocument,
		shellCopy,
		shellFooter,
		shellHeader,
		shellModals,
		shellRuntimeHtml
	}: {
		form: AuxeroContactFormData;
		info: AuxeroContactPageInfo;
		pageDocument: AuxeroPageDocument;
		shellCopy: HomePageCopy;
		shellFooter: HomeFiveFooterData;
		shellHeader: HomeFiveHeaderData;
		shellModals?: HomeFiveModalsData;
		shellRuntimeHtml: string;
	} = $props();

	const contactHeroImage = '/assets/daynight/banners/route-contact-studio-v6.png';
	const mapHref = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
		daynightContact.addressLabel
	)}`;
	const hrefAttributes = (href: string) => ({
		href,
		rel: href.startsWith('http') ? 'noreferrer' : undefined,
		target: href.startsWith('http') ? '_blank' : undefined
	});
</script>

<div class="daynight-contact-desktop-route">
	<AuxeroPublicShell
		copy={shellCopy}
		footer={shellFooter}
		header={shellHeader}
		modals={shellModals}
		{pageDocument}
		runtimeHtml={shellRuntimeHtml}
		title="Контакти — Day Night Auto"
	>
		<div class="daynight-contact-page">
			<CenteredRouteHero
				supportText="Огледи и посещения с предварителна уговорка."
				image={contactHeroImage}
				leftImage="/assets/daynight/banners/contact-kristian-phone-v1.png"
				rightImage="/assets/daynight/banners/contact-email-v1.png"
				portraitSide="left"
				labelledby="contact-page-title"
				title="Свържете се с нас"
			>
				<a class="daynight-route-hero-cta" {...hrefAttributes(info.phoneHref)}
					><PhoneCall size={20} aria-hidden="true" />{info.phoneLabel}</a
				>
				<a class="daynight-route-hero-cta daynight-route-hero-cta--secondary" href="#contact-form"
					><MessageSquare size={20} aria-hidden="true" />Изпратете запитване</a
				>
			</CenteredRouteHero>

			<section id="contact-form" class="daynight-contact-form-section" aria-label={form.title}>
				<div class="container">
					<div class="daynight-contact-content">
						<ContactFormCard {form} />

						<aside class="daynight-contact-info-card" aria-labelledby="contact-info-title">
							<div class="daynight-contact-info-card__header">
								<h2 id="contact-info-title">Данни за контакт</h2>
								<p>Свържете се директно или уговорете посещение.</p>
							</div>

							<div class="daynight-contact-info-card__list">
								<a class="daynight-contact-info-card__item" {...hrefAttributes(mapHref)}>
									<span><MapPin size={20} strokeWidth={2} aria-hidden="true" /></span>
									<div>
										<small>Адрес</small>
										<strong>{daynightContact.addressLabel}</strong>
									</div>
									<ExternalLink size={15} strokeWidth={2} aria-hidden="true" />
								</a>

								<a class="daynight-contact-info-card__item" {...hrefAttributes(info.phoneHref)}>
									<span><PhoneCall size={20} strokeWidth={2} aria-hidden="true" /></span>
									<div>
										<small>Телефон</small>
										<strong>{info.phoneLabel}</strong>
									</div>
									<ExternalLink size={15} strokeWidth={2} aria-hidden="true" />
								</a>

								<div class="daynight-contact-info-card__item">
									<span><Clock3 size={20} strokeWidth={2} aria-hidden="true" /></span>
									<div>
										<small>Посещения и огледи</small>
										<strong>{info.workNote}</strong>
									</div>
								</div>
							</div>
							<div class="contact-socials" aria-label="Day Night Auto в социалните мрежи">
								{#each [{ label: 'Facebook', href: daynightContact.facebookHref, icon: 'facebook' }, { label: 'Instagram', href: daynightContact.instagramHref, icon: 'instagram' }, { label: 'TikTok', href: daynightContact.tiktokHref, icon: 'tiktok' }] as social (social.label)}
									<a {...hrefAttributes(social.href)}
										><img src={`/assets/icons/brands/${social.icon}.svg`} alt="" />{social.label}</a
									>
								{/each}
							</div>
						</aside>
					</div>
				</div>
			</section>
		</div>
	</AuxeroPublicShell>
</div>

<div class="daynight-contact-mobile-route">
	<ContactMobilePage {form} {info} />
</div>

<style>
	.contact-socials {
		display: flex;
		gap: 8px;
		flex-wrap: wrap;
		padding-top: 20px;
	}
	.contact-socials a {
		display: inline-flex;
		align-items: center;
		gap: 7px;
		min-height: 40px;
		padding: 0 10px;
		border: 1px solid var(--bc-border);
		border-radius: 8px;
		background: #fff;
		font-size: 14px;
		color: var(--bc-ink);
		text-decoration: none;
	}
	.contact-socials img {
		width: 16px;
		height: 16px;
		filter: grayscale(1);
	}
	.contact-socials a:hover {
		border-color: var(--bc-accent);
	}
	.daynight-contact-form-section :global(.contact-page-form) {
		padding: 28px;
		border-radius: 16px;
	}
	.daynight-contact-form-section :global(.contact-page-form__header h2) {
		font-size: 26px;
	}
	.daynight-contact-form-section :global(.contact-page-form__header) {
		margin-bottom: 24px;
	}

	.daynight-contact-mobile-route {
		display: none;
	}

	.daynight-contact-page {
		background: var(--bc-bg);
	}

	.daynight-contact-form-section {
		padding: 40px 0 56px;
		scroll-margin-top: 96px;
	}

	.daynight-contact-content {
		display: grid;
		max-width: 1200px;
		margin: 0 auto;
		align-items: start;
		grid-template-columns: minmax(0, 1.4fr) minmax(360px, 1fr);
		gap: 24px;
	}

	.daynight-contact-form-section :global(.contact-page-form) {
		width: 100%;
	}

	.daynight-contact-info-card {
		display: flex;
		min-width: 0;
		flex-direction: column;
		border: 1px solid var(--bc-border);
		border-radius: 18px;
		background: #f4f5f6;
		color: var(--bc-text);
		padding: 28px;
	}

	.daynight-contact-info-card__header {
		padding-bottom: 22px;
	}

	.daynight-contact-info-card h2,
	.daynight-contact-info-card p {
		margin: 0;
	}

	.daynight-contact-info-card h2 {
		color: var(--bc-text);
		font-size: 26px;
		font-weight: 650;
		letter-spacing: -0.02em;
		line-height: 1.2;
	}

	.daynight-contact-info-card__header p {
		margin-top: 8px;
		color: var(--bc-text-muted);
		font-size: 14px;
		line-height: 21px;
	}

	.daynight-contact-info-card__list {
		display: grid;
		gap: 12px;
	}

	.daynight-contact-info-card__item {
		display: grid;
		min-height: 76px;
		min-width: 0;
		align-items: center;
		grid-template-columns: 28px minmax(0, 1fr) 16px;
		gap: 14px;
		border: 1px solid #d7d9dd;
		border-radius: 12px;
		background: #ffffff;
		color: var(--bc-text);
		padding: 15px 16px;
		text-decoration: none;
		transition:
			border-color 160ms ease,
			background-color 160ms ease;
	}

	.daynight-contact-info-card__item > span {
		display: grid;
		width: 28px;
		height: 28px;
		place-items: center;
		color: #5f6368;
	}

	.daynight-contact-info-card__item > div {
		display: grid;
		min-width: 0;
		gap: 5px;
	}

	.daynight-contact-info-card__item small {
		color: #6b7078;
		font-size: 13px;
		font-weight: 600;
		line-height: 17px;
	}

	.daynight-contact-info-card__item strong {
		color: var(--bc-text);
		font-size: 15px;
		font-weight: 600;
		line-height: 22px;
		text-decoration: none;
	}

	.daynight-contact-info-card__item > :global(svg) {
		flex: 0 0 auto;
		color: #767b82;
	}

	@media (hover: hover) and (pointer: fine) {
		.daynight-contact-info-card__item:hover {
			border-color: #afb3b9;
			background: #fbfbfc;
		}
	}

	.daynight-contact-info-card a:focus-visible {
		border-radius: 4px;
		outline: 3px solid rgb(185 22 28 / 0.3);
		outline-offset: 3px;
	}

	@media (max-width: 959px) and (min-width: 768px) {
		.daynight-contact-content {
			grid-template-columns: minmax(0, 1fr);
		}

		.daynight-contact-info-card {
			min-height: 420px;
		}
	}

	@media (max-width: 767px) {
		.daynight-contact-desktop-route {
			display: none;
		}

		.daynight-contact-mobile-route {
			display: block;
		}

		:global(body.auxero-template-contact-us-html),
		:global(body.auxero-template-contact-us-html #wrapper) {
			background: var(--bc-bg) !important;
			background-color: var(--bc-bg) !important;
		}
	}
</style>
