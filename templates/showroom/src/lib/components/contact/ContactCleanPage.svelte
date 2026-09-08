<script lang="ts">
	import { resolve } from '$app/paths';
	import { ArrowUpRight, Mail, MapPin, PhoneCall } from '@lucide/svelte';
	import InquiryForm from '$lib/components/forms/InquiryForm.svelte';
	import type { InquiryFormField } from '$lib/components/forms/types';
	import type { AuxeroContactFormData, AuxeroContactPageInfo } from '$lib/auxero/contact';
	import { eliqautoAssets, eliqautoContact } from '$lib/data/eliqauto';

	let {
		form,
		info
	}: {
		form: AuxeroContactFormData;
		info: AuxeroContactPageInfo;
	} = $props();

	const linkAttrs = (href: string) => ({
		href: href.startsWith('/') ? resolve(href as '/') : href
	});
	const cutoutLeft = '/assets/eliqauto/megamenu/inventory-bmw-x5-cutout.webp';
	const cutoutRight = '/assets/eliqauto/megamenu/inventory-audi-sq5-cutout.webp';

	const hasSecondaryPhone = $derived(
		info.secondaryPhoneHref !== info.phoneHref || info.secondaryPhoneLabel !== info.phoneLabel
	);
	const titleLead = $derived(info.title.replace(/\s*Eliqauto\s*$/i, '').trim());

	const fields: InquiryFormField[] = $derived([
		...form.fields.map((field) => ({
			...field,
			active: false,
			kind: 'input' as const,
			required: field.name === 'Firstname' || field.name === 'SendInquiryphone',
			wrapperClass: 'bc-contact-field'
		})),
		{
			className: 'bc-contact-message',
			id: 'message',
			kind: 'textarea' as const,
			label: form.messageLabel,
			name: 'message',
			placeholder: form.messagePlaceholder,
			required: false,
			rows: 5,
			wrapperClass: 'bc-contact-field bc-contact-field--full'
		}
	]);
</script>

<section class="bc-contact-banner" aria-labelledby="contact-title">
	<div class="bc-contact-banner-frame container">
		<img
			class="bc-contact-cutout bc-contact-cutout--left"
			src={cutoutLeft}
			alt=""
			width="820"
			height="420"
			loading="eager"
			decoding="async"
			aria-hidden="true"
		/>
		<img
			class="bc-contact-cutout bc-contact-cutout--right"
			src={cutoutRight}
			alt=""
			width="820"
			height="420"
			loading="eager"
			decoding="async"
			aria-hidden="true"
		/>

		<div class="bc-container bc-contact-banner-inner">
			<h1 id="contact-title" class="bc-contact-title">
				<span class="bc-contact-title-desktop">Контакти</span>
				<span class="bc-contact-title-copy">{titleLead}</span>
				<span class="bc-contact-title-brand">
					<img
						class="bc-contact-title-logo"
						src={eliqautoAssets.logoLight}
						alt="ELIQ AUTO"
						width="240"
						height="44"
					/>
				</span>
			</h1>
			<p class="bc-contact-lead">{info.description}</p>

			<div class="bc-contact-actions">
				<a {...linkAttrs(info.phoneHref)} class="bc-contact-action bc-contact-action--primary">
					<PhoneCall size={18} strokeWidth={2.25} aria-hidden="true" />
					<span>
						<span class="bc-contact-action-label">Обади се</span>
						<span class="bc-contact-action-value">{info.phoneLabel}</span>
					</span>
				</a>
				{#if hasSecondaryPhone}
					<a {...linkAttrs(info.secondaryPhoneHref)} class="bc-contact-action">
						<PhoneCall size={18} strokeWidth={2.25} aria-hidden="true" />
						<span>
							<span class="bc-contact-action-label">Обади се</span>
							<span class="bc-contact-action-value">{info.secondaryPhoneLabel}</span>
						</span>
					</a>
				{/if}
				<a {...linkAttrs(info.emailHref)} class="bc-contact-action">
					<Mail size={18} strokeWidth={2.25} aria-hidden="true" />
					<span>
						<span class="bc-contact-action-label">Пиши ни</span>
						<span class="bc-contact-action-value">{info.emailLabel}</span>
					</span>
				</a>
				<a {...linkAttrs(info.mapHref)} target="_blank" rel="noreferrer" class="bc-contact-action">
					<MapPin size={18} strokeWidth={2.25} aria-hidden="true" />
					<span>
						<span class="bc-contact-action-label">Локация</span>
						<span class="bc-contact-action-value">{info.addressLabel}</span>
					</span>
				</a>
			</div>
		</div>
	</div>
</section>

<section class="bc-contact-form-band" aria-labelledby="inquiry-title">
	<div class="bc-container">
		<div id="inquiry" class="bc-contact-card">
			<p id="inquiry-title" class="bc-contact-card-title">{form.title}</p>
			<p class="bc-contact-card-copy">{form.subtitle}</p>
			<div class="bc-contact-card-body">
				<InquiryForm
					{fields}
					buttonClass="bc-contact-submit"
					formClass="bc-contact-form"
					gridClass="bc-contact-grid"
					showEmptyStatus={false}
					statusClass="bc-contact-status"
					statusMessage="Съобщението е изпратено. Eliqauto ще се свърже с вас скоро."
					submitLabel={form.submitLabel}
				/>
			</div>
		</div>
	</div>
</section>

<section class="bc-contact-map" aria-labelledby="map-title">
	<div class="bc-container">
		<div class="bc-contact-location-panel">
			<div class="bc-contact-map-caption">
				<div>
					<h2 id="map-title" class="bc-contact-map-address">Посетете нашия шоурум</h2>
					<p class="bc-contact-map-note">ELIQ AUTO · Пазарджик</p>
					<a
						class="bc-contact-directions"
						{...linkAttrs(info.mapHref)}
						target="_blank"
						rel="noreferrer"
					>
						Упътване до шоурума <ArrowUpRight size={16} aria-hidden="true" />
					</a>
				</div>
				<div>
					<h3 class="bc-contact-map-heading">Работно време</h3>
					{#each eliqautoContact.hours as hours (hours)}<p class="bc-contact-map-note">
							{hours}
						</p>{/each}
					<p class="bc-contact-map-note">{info.workNote}</p>
				</div>
				<div>
					<h3 class="bc-contact-map-heading">Телефони</h3>
					<a class="bc-contact-phone" {...linkAttrs(info.phoneHref)}>{info.phoneLabel}</a>
					<a class="bc-contact-phone" {...linkAttrs(info.secondaryPhoneHref)}
						>{info.secondaryPhoneLabel}</a
					>
					<a class="bc-contact-phone" {...linkAttrs(eliqautoContact.thirdPhoneHref)}
						>{eliqautoContact.thirdPhoneLabel}</a
					>
				</div>
			</div>
			<iframe
				title="Eliqauto, {info.addressLabel}"
				src={info.mapSrc}
				height="420"
				class="bc-contact-map-frame"
				allowfullscreen
				loading="lazy"
				referrerpolicy="no-referrer-when-downgrade"
			></iframe>
		</div>
	</div>
</section>

<style>
	.bc-contact-title-desktop {
		display: none;
	}
	.bc-contact-banner-frame {
		display: contents;
	}
	.bc-contact-banner {
		position: relative;
		isolation: isolate;
		overflow: hidden;
		background-color: #b5121b;
		background-image:
			radial-gradient(70% 90% at 0% 80%, rgb(201 165 106 / 0.35) 0%, transparent 58%),
			radial-gradient(70% 90% at 100% 80%, rgb(201 165 106 / 0.28) 0%, transparent 58%),
			linear-gradient(165deg, #c41620 0%, #b5121b 42%, #7a1018 100%);
		color: #ffffff;
		padding: 48px 0 56px;
	}

	.bc-contact-cutout {
		display: none;
		position: absolute;
		bottom: 0;
		width: clamp(220px, 24vw, 400px);
		object-fit: contain;
		pointer-events: none;
		user-select: none;
		filter: sepia(0.55) saturate(1.45) hue-rotate(-18deg) brightness(1.08)
			drop-shadow(0 18px 24px rgb(80 20 8 / 0.45));
	}

	.bc-contact-cutout--left {
		left: 0;
	}

	.bc-contact-cutout--right {
		right: 0;
		transform: scaleX(-1);
	}

	.bc-contact-banner-inner {
		position: relative;
		z-index: 1;
		text-align: center;
	}

	.bc-contact-title {
		display: flex;
		flex-wrap: nowrap;
		align-items: center;
		justify-content: center;
		gap: 0.3em;
		margin: 0 auto;
		color: #ffffff;
		font-size: clamp(1.5rem, 3.2vw + 0.7rem, 3.25rem);
		font-weight: 600;
		letter-spacing: -0.03em;
		line-height: 1;
		text-shadow: 0 1px 0 rgb(0 0 0 / 0.12);
	}

	.bc-contact-title-copy,
	.bc-contact-title-brand {
		font-size: 1em;
		font-weight: inherit;
		letter-spacing: inherit;
		line-height: inherit;
	}

	.bc-contact-title-brand {
		display: inline-flex;
		flex: 0 0 auto;
		align-items: center;
		border-radius: 0.16em;
		background: #ffffff;
		padding: 0.14em 0.26em 0.1em;
	}

	.bc-contact-title-logo {
		display: block;
		height: 0.78em;
		width: auto;
		max-width: none;
	}

	.bc-contact-lead {
		margin: 16px auto 0;
		max-width: 40rem;
		color: #ffffff;
		font-size: 17px;
		line-height: 1.55;
	}

	.bc-contact-actions {
		display: flex;
		flex-wrap: wrap;
		justify-content: center;
		gap: 12px;
		margin: 32px auto 0;
		max-width: 960px;
	}

	.bc-contact-action {
		display: flex;
		min-height: 60px;
		min-width: min(100%, 220px);
		align-items: center;
		gap: 12px;
		border: 1px solid rgb(24 24 27 / 0.08);
		border-radius: 10px;
		background: #ffffff;
		padding: 10px 16px;
		color: #18181b;
		text-decoration: none;
	}

	.bc-contact-action:hover,
	.bc-contact-action:focus-visible {
		background: #fff8ee;
		outline: 0;
	}

	.bc-contact-action--primary {
		background: #f0d7a8;
		border-color: transparent;
		color: #5c140f;
	}

	.bc-contact-action--primary:hover,
	.bc-contact-action--primary:focus-visible {
		background: #ffe8c2;
		color: #5c140f;
	}

	.bc-contact-action > span:last-child {
		min-width: 0;
		text-align: left;
	}

	.bc-contact-action-label,
	.bc-contact-action-value {
		display: block;
	}

	.bc-contact-action-label {
		font-size: 13px;
		font-weight: 600;
		line-height: 16px;
	}

	.bc-contact-action-value {
		margin-top: 2px;
		overflow-wrap: anywhere;
		font-size: 15px;
		font-weight: 700;
		line-height: 20px;
	}

	.bc-contact-form-band,
	.bc-contact-map {
		background: #f4f4f5;
		color: #18181b;
	}

	.bc-contact-form-band {
		padding: 40px 0 56px;
	}

	.bc-contact-card {
		width: min(100%, 720px);
		margin: 0 auto;
		border: 1px solid #e4e4e7;
		border-radius: 12px;
		background: #ffffff;
		color: #18181b;
		padding: 32px;
	}

	.bc-contact-card-title {
		margin: 0;
		font-size: 26px;
		font-weight: 600;
		letter-spacing: -0.02em;
		line-height: 1.2;
	}

	.bc-contact-card-copy {
		margin: 8px 0 0;
		color: #3f3f46;
		font-size: 15px;
		line-height: 1.5;
	}

	.bc-contact-card-body {
		margin-top: 24px;
	}

	.bc-contact-card :global(.bc-contact-form) {
		display: grid;
		gap: 16px;
	}

	.bc-contact-card :global(.bc-contact-grid) {
		display: grid;
		grid-template-columns: repeat(2, minmax(0, 1fr));
		gap: 14px 16px;
	}

	.bc-contact-card :global(.bc-contact-field) {
		min-width: 0;
	}

	.bc-contact-card :global(.bc-contact-field--full) {
		grid-column: 1 / -1;
	}

	.bc-contact-card :global(.bc-contact-form label) {
		display: block;
		margin: 0 0 6px;
		color: #18181b;
		font-size: 14px;
		font-weight: 600;
		line-height: 18px;
	}

	.bc-contact-card :global(.bc-contact-form input),
	.bc-contact-card :global(.bc-contact-form textarea) {
		display: block;
		width: 100%;
		border: 1px solid #d4d4d8;
		border-radius: 8px;
		background: #ffffff;
		color: #18181b;
		font-family: inherit;
		font-size: 16px;
		line-height: 22px;
		outline: 0;
		padding: 0 14px;
	}

	.bc-contact-card :global(.bc-contact-form input) {
		height: 48px;
	}

	.bc-contact-card :global(.bc-contact-form input:focus),
	.bc-contact-card :global(.bc-contact-form input:focus-visible),
	.bc-contact-card :global(.bc-contact-form input:active),
	.bc-contact-card :global(.bc-contact-form input.active),
	.bc-contact-card :global(.bc-contact-form textarea:focus),
	.bc-contact-card :global(.bc-contact-form textarea:focus-visible),
	.bc-contact-card :global(.bc-contact-form textarea:active),
	.bc-contact-card :global(.bc-contact-form textarea.active) {
		border-color: #b5121b !important;
		box-shadow: 0 0 0 2px rgb(181 18 27 / 0.28) !important;
	}

	.bc-contact-card :global(.bc-contact-form textarea) {
		min-height: 120px;
		padding-top: 12px;
		resize: vertical;
	}

	.bc-contact-card :global(.bc-contact-submit) {
		display: flex;
		width: 100%;
		min-height: 50px;
		align-items: center;
		justify-content: center;
		border: 0;
		border-radius: 8px;
		background: #b5121b;
		color: #ffffff;
		cursor: pointer;
		font-family: inherit;
		font-size: 16px;
		font-weight: 700;
		line-height: 20px;
	}

	.bc-contact-card :global(.bc-contact-submit:hover),
	.bc-contact-card :global(.bc-contact-submit:focus-visible) {
		background: #941018;
		outline: 0;
	}

	.bc-contact-card :global(.bc-contact-submit:disabled) {
		cursor: wait;
		opacity: 0.7;
	}

	.bc-contact-card :global(.bc-contact-status) {
		margin: 0;
		font-size: 14px;
		font-weight: 600;
		line-height: 18px;
	}

	.bc-contact-card :global(.bc-contact-status[data-status='success']) {
		color: #0f9f7a;
	}

	.bc-contact-card :global(.bc-contact-status[data-status='error']) {
		color: #b5121b;
	}

	.bc-contact-map {
		padding: 0 0 56px;
	}
	.bc-contact-location-panel {
		display: grid;
		grid-template-columns: minmax(0, 0.85fr) minmax(0, 1.15fr);
		border: 1px solid #e4e4e7;
		border-radius: 12px;
		background: #fff;
		overflow: hidden;
	}
	.bc-contact-map-caption {
		display: grid;
		grid-template-columns: 1fr 1fr;
		align-content: center;
		gap: 28px 24px;
		padding: 32px;
	}
	.bc-contact-map-caption > div:first-child {
		grid-column: 1 / -1;
	}
	.bc-contact-map-address {
		margin: 0 0 8px;
		font-size: 28px;
		line-height: 1.2;
		font-weight: 600;
		letter-spacing: -0.02em;
	}
	.bc-contact-map-note {
		margin: 2px 0 0;
		color: #62626b;
		font-size: 14px;
		line-height: 1.7;
	}
	.bc-contact-map-heading {
		margin: 0 0 8px;
		font-size: 15px;
		font-weight: 600;
	}
	.bc-contact-directions {
		display: inline-flex;
		align-items: center;
		gap: 8px;
		min-height: 44px;
		margin-top: 20px;
		padding: 10px 16px;
		border-radius: 8px;
		font-size: 14px;
		font-weight: 600;
		background: var(--bc-accent);
		color: #fff;
	}
	.bc-contact-directions:hover {
		background: var(--bc-accent-hover);
		color: #fff;
	}
	.bc-contact-phone {
		display: block;
		width: fit-content;
		min-height: 44px;
		font-size: 14px;
		line-height: 44px;
		color: var(--bc-ink);
		white-space: nowrap;
	}
	.bc-contact-map-caption a:focus-visible {
		outline: 2px solid var(--bc-accent);
		outline-offset: 3px;
	}
	.bc-contact-map-frame {
		display: block;
		width: 100%;
		height: 100%;
		min-height: 400px;
		border: 0;
	}
	@media (max-width: 1199px) and (min-width: 768px) {
		.bc-contact-map-caption {
			grid-template-columns: 1fr;
			padding: 24px;
			gap: 20px;
		}
	}
	@media (max-width: 767px) {
		.bc-contact-map {
			padding-bottom: 32px;
		}
		.bc-contact-location-panel {
			grid-template-columns: 1fr;
		}
		.bc-contact-map-caption {
			padding: 24px;
			gap: 24px 16px;
		}
		.bc-contact-map-address {
			font-size: 24px;
		}
		.bc-contact-map-frame {
			height: 280px;
			min-height: 280px;
		}
	}
	@media (max-width: 374px) {
		.bc-contact-map-caption {
			grid-template-columns: 1fr;
		}
	}

	@media (min-width: 1024px) {
		.bc-contact-banner-frame {
			display: block;
			position: relative;
			min-height: 300px;
			padding-top: 80px;
			padding-bottom: 24px;
		}
		.bc-contact-banner-inner {
			width: 100%;
			max-width: none;
			padding: 0;
		}
		.bc-contact-cutout {
			display: block;
			bottom: 64px;
			width: 22%;
			height: 190px;
			filter: none;
		}
		.bc-contact-cutout--left {
			left: clamp(0px, 1vw, 16px);
			object-position: left bottom;
		}
		.bc-contact-cutout--right {
			right: clamp(0px, 1vw, 16px);
			object-position: right bottom;
		}

		.bc-contact-banner {
			min-height: 300px;
			box-sizing: border-box;
			padding: 0;
			background: #b5121b;
		}
		.bc-contact-title {
			font-size: 46px;
			line-height: 1.05;
			letter-spacing: -0.03em;
			text-shadow: none;
		}
		.bc-contact-title-desktop {
			display: inline;
			font: inherit;
			letter-spacing: inherit;
			color: #fff;
		}
		.bc-contact-title-copy,
		.bc-contact-title-brand,
		.bc-contact-lead,
		.bc-contact-action-label {
			display: none;
		}
		.bc-contact-actions {
			display: grid;
			grid-template-columns: repeat(2, minmax(0, 1fr));
			width: min(720px, 56%);
			gap: 8px;
			margin-top: 24px;
		}
		.bc-contact-action {
			min-width: 0;
			min-height: 48px;
			padding: 8px 12px;
			border-radius: 8px;
			background: #fff;
			color: #18181b;
		}
		.bc-contact-action:hover,
		.bc-contact-action:focus-visible {
			background: #f4f4f5;
			color: #18181b;
		}
		.bc-contact-action:focus-visible {
			outline: 2px solid #fff;
			outline-offset: 3px;
		}
		.bc-contact-action-value {
			font-size: 14px;
		}
	}

	@media (max-width: 640px) {
		.bc-contact-card {
			padding: 24px;
		}

		.bc-contact-card :global(.bc-contact-grid) {
			grid-template-columns: minmax(0, 1fr);
		}

		.bc-contact-action {
			min-width: 100%;
		}
	}
</style>
