<script lang="ts">
	import { MediaQuery } from 'svelte/reactivity';
	import ArrowUpRight from '@lucide/svelte/icons/arrow-up-right';
	import { site } from '$lib/config/site';
	import { daynightContact } from '$lib/config/dealer';
	import { dealerCopy } from '$lib/config/dealer-copy';
	import Action from '$lib/components/common/Action.svelte';
	import { contactDesktopCopy } from '$lib/content/contact-desktop';
	let {
		english = false,
		layout = 'split',
		desktopFramed = false
	}: { english?: boolean; layout?: 'split' | 'stacked'; desktopFramed?: boolean } = $props();
	const desktop = new MediaQuery('(min-width: 768px)', false);
	const copy = $derived(dealerCopy[english ? 'en' : 'bg']);
	const labels = $derived(contactDesktopCopy[english ? 'en' : 'bg']);
</script>

<section
	class="contact-location"
	class:contact-location--stacked={layout === 'stacked'}
	class:contact-location--desktop-framed={desktopFramed}
	aria-label={labels.location}
>
	<div class="contact-location__info">
		<h2>{labels.visit}</h2>
		<p class="contact-location__address">{copy.address}</p>
		<p class="contact-location__appointment">{copy.appointment}</p>
		<div class="contact-location__actions">
			<Action
				href={site.contact.mapHref}
				variant={desktopFramed ? 'secondary' : 'primary'}
				size={desktopFramed ? 'compact' : 'standard'}
				target="_blank"
				rel="noreferrer"
			>
				{labels.directions}<ArrowUpRight size={18} aria-hidden="true" />
			</Action>
			<Action
				href={site.contact.phoneHref}
				variant="secondary"
				size={desktopFramed ? 'compact' : 'standard'}>{site.contact.phone}</Action
			>
		</div>
	</div>
	{#if desktop.current}
		<iframe
			src={daynightContact.mapEmbedUrl}
			title={labels.mapTitle}
			loading="lazy"
			referrerpolicy="no-referrer-when-downgrade"
			allowfullscreen
		></iframe>
	{/if}
</section>

<style>
	.contact-location {
		display: grid;
		grid-template-columns: minmax(0, 1fr) minmax(0, 1.6fr);
		min-width: 0;
		min-height: 340px;
		overflow: hidden;
		border: 1px solid var(--bc-border);
		border-radius: var(--bc-radius-panel);
		background: var(--bc-card-bg);
	}
	.contact-location__info {
		display: grid;
		align-content: center;
		justify-items: start;
		gap: var(--bc-space-3);
		min-width: 0;
		padding: var(--bc-space-8);
	}
	p,
	h2 {
		margin: 0;
	}
	h2 {
		font: var(--bc-weight-heading) var(--bc-desktop-section-title)/1.2 var(--bc-font-heading);
	}
	.contact-location__address {
		font-size: var(--bc-text-body-lg);
		line-height: var(--bc-leading-body-lg);
		color: var(--bc-ink);
	}
	.contact-location__appointment {
		font-size: var(--bc-text-body);
		line-height: var(--bc-leading-body);
		color: var(--bc-copy);
	}
	.contact-location__actions {
		display: flex;
		flex-wrap: wrap;
		gap: var(--bc-space-2);
		margin-top: var(--bc-space-2);
	}
	iframe {
		display: block;
		width: 100%;
		height: 100%;
		min-height: 320px;
		border: 0;
		background: var(--bc-surface);
	}
	.contact-location--stacked {
		grid-template-columns: minmax(0, 1fr);
		grid-template-rows: auto minmax(320px, 1fr);
	}
	.contact-location--stacked .contact-location__info {
		padding: var(--bc-space-6);
	}
	@media (max-width: 1023px) {
		.contact-location__info {
			padding: var(--bc-space-6);
		}
	}
	@media (min-width: 768px) {
		.contact-location--desktop-framed {
			gap: var(--bc-space-2);
			padding: var(--bc-space-2);
			border-color: var(--bc-desktop-editorial-border);
			border-radius: var(--bc-desktop-editorial-radius);
			box-shadow: var(--bc-desktop-editorial-shadow);
		}
		.contact-location--desktop-framed:not(.contact-location--stacked) {
			grid-template-columns: minmax(0, 1fr) minmax(0, 1.2fr);
		}
		.contact-location--desktop-framed .contact-location__info {
			padding: var(--bc-space-6);
		}
		.contact-location--desktop-framed h2 {
			font-family: var(--bc-font-body);
			font-size: var(--bc-desktop-editorial-title);
			font-weight: var(--bc-desktop-title-weight);
			line-height: var(--bc-desktop-section-leading);
		}
		.contact-location--desktop-framed iframe {
			border-radius: var(--bc-desktop-editorial-photo-radius);
		}
		.contact-location--desktop-framed .contact-location__appointment {
			color: var(--bc-desktop-editorial-muted);
		}
	}
	@media (min-width: 768px) and (max-width: 1023px) {
		.contact-location--desktop-framed {
			grid-template-columns: minmax(0, 1fr);
		}
	}
</style>
