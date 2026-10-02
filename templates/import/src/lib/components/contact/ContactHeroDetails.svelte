<script lang="ts">
	import MapPin from '@lucide/svelte/icons/map-pin';
	import MessageCircle from '@lucide/svelte/icons/message-circle';
	import ArrowUpRight from '@lucide/svelte/icons/arrow-up-right';
	import type { SiteConfig } from '$lib/config/site';
	import type { Locale } from '$lib/locale/core';
	import { dealerCopy } from '$lib/config/dealer-copy';
	import { contactDesktopCopy, desktopContactChannels } from '$lib/content/contact-desktop';
	import Action from '$lib/components/common/Action.svelte';
	let { site, locale }: { site: SiteConfig; locale: Locale } = $props();
	const copy = $derived(contactDesktopCopy[locale]);
	const message = $derived(
		desktopContactChannels(site, locale).find((channel) => channel.kind === 'message')
	);
</script>

<div class="contact-hero-details">
	<p class="contact-hero-details__address">
		<MapPin size={18} aria-hidden="true" /><span>{dealerCopy[locale].address}</span>
	</p>
	<div class="contact-hero-details__actions">
		<Action
			href={site.contact.mapHref}
			variant="glass"
			size="compact"
			target="_blank"
			rel="noopener noreferrer"
		>
			{copy.directions}<ArrowUpRight size={18} aria-hidden="true" />
		</Action>
		{#if message}
			<Action href={message.href} variant="glass" size="compact">
				<MessageCircle size={18} aria-hidden="true" />{message.title} · {message.text}
			</Action>
		{/if}
	</div>
</div>

<style>
	.contact-hero-details {
		display: grid;
		justify-items: center;
		gap: var(--bc-space-3);
		width: min(100%, var(--bc-desktop-action-panel-width));
		color: var(--bc-white);
	}
	.contact-hero-details__address {
		display: flex;
		align-items: center;
		justify-content: center;
		gap: var(--bc-space-2);
		margin: 0;
		font: var(--bc-weight-body) var(--bc-text-body)/var(--bc-leading-body) var(--bc-font-body);
		text-wrap: balance;
	}
	.contact-hero-details__address :global(svg) {
		flex-shrink: 0;
	}
	.contact-hero-details__actions {
		display: flex;
		justify-content: center;
		flex-wrap: wrap;
		gap: var(--bc-space-3);
	}
	.contact-hero-details__actions :global(.site-action) {
		border-radius: var(--bc-radius-pill);
	}
</style>
