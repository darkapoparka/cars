<script lang="ts">
	import { linkHref } from '$lib/utils/links';
	import { nativeMessage } from '$lib/i18n/native';
	import { page } from '$app/state';
	const nt = (key: import('$lib/i18n/native').NativeKey) =>
		nativeMessage(page.data.locale === 'en' ? 'en' : 'bg', key);
	import type { PageProps } from './$types';
	import PageIntro from '$lib/components/common/PageIntro.svelte';
	import LeadForm from '$lib/components/common/LeadForm.svelte';
	import SocialLinks from '$lib/components/common/SocialLinks.svelte';
	import ContactMobilePage from '$lib/components/contact/ContactMobilePage.svelte';
	import Phone from '@lucide/svelte/icons/phone';
	import MapPin from '@lucide/svelte/icons/map-pin';
	import MessageCircle from '@lucide/svelte/icons/message-circle';
	import { receiptMessage } from '$lib/domain/inquiry';
	let { data, form }: PageProps = $props();
	const english = $derived(data.locale === 'en');
	const channels = $derived([
		{
			href: data.site.contact.phoneHref,
			title: english ? 'Call us' : 'Обади се',
			text: data.site.contact.phone,
			icon: Phone
		},
		{
			href: data.site.contact.mapHref,
			title: english ? 'Visit the showroom' : 'Посети ни',
			text: data.site.contact.address,
			icon: MapPin
		},
		{
			href: data.site.contact.messageHref,
			title: english ? 'Message us' : 'Пиши ни',
			text: 'Viber',
			icon: MessageCircle
		}
	]);
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
			align="center"
		/>
		<section
			class="site-section site-container contact-overview"
			aria-label={english ? 'Contact details' : 'Връзка с нас'}
		>
			<div class="contact-channels">
				{#each channels as channel (channel.href)}
					<a class="contact-channel" href={linkHref(channel.href)}>
						<span class="contact-channel__icon"
							><channel.icon size={26} strokeWidth={1.6} aria-hidden="true" /></span
						>
						<h2>{channel.title}</h2>
						<p>{channel.text}</p>
					</a>
				{/each}
			</div>
			<SocialLinks />
		</section>
		<section class="site-section contact-intake">
			<div class="site-container contact-form-panel">
				<header>
					<h2 class="site-heading">{english ? 'Send an enquiry' : 'Изпрати запитване'}</h2>
				</header>
				<LeadForm
					{english}
					source={page.url.searchParams.get('topic') === 'trade-in' ? 'trade-in' : 'contact'}
					result={form}
				/>
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
	}
	.contact-channels {
		display: grid;
		grid-template-columns: repeat(3, minmax(0, 1fr));
		gap: var(--bc-space-5);
	}
	.contact-channel {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: var(--bc-space-3);
		padding: var(--bc-space-6);
		border-radius: var(--bc-radius-panel);
		background: var(--bc-surface);
		color: var(--bc-ink);
		text-decoration: none;
		text-align: center;
	}
	.contact-channel:hover {
		background: var(--bc-surface-hover);
	}
	.contact-channel__icon {
		display: grid;
		place-items: center;
		width: var(--bc-control-height-hero);
		height: var(--bc-control-height-hero);
		border-radius: var(--bc-radius-pill);
		background: var(--bc-white);
		color: var(--bc-ink);
	}
	.contact-channel h2 {
		margin: 0;
		font: var(--bc-weight-heading) var(--bc-text-h4)/1.3 var(--bc-font-heading);
	}
	.contact-channel p {
		margin: 0;
		max-width: 32ch;
		font-size: var(--bc-text-body-lg);
		font-weight: var(--bc-weight-body);
		line-height: var(--bc-leading-body-lg);
		color: var(--bc-copy);
	}
	.contact-intake {
		background: var(--bc-bg-strong);
	}
	.contact-form-panel {
		max-width: var(--bc-container-narrow);
		border-radius: var(--bc-radius-panel);
		padding: var(--bc-space-8);
		background: var(--bc-surface-raised);
	}
	.contact-form-panel header {
		margin-bottom: var(--bc-space-6);
		text-align: center;
	}
</style>
