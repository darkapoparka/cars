<script lang="ts">
	import { resolve } from '$app/paths';
	import { MapPin, PhoneCall, MessageCircle } from '@lucide/svelte';
	import { daynightAssets, daynightContact } from '$lib/data/daynight';
	import type { Snippet } from 'svelte';

	let {
		actionsLabel = 'Контакт',
		children,
		logoAlt = 'Day Night Auto',
		surface = 'transparent',
		onMap
	}: {
		actionsLabel?: string;
		children?: Snippet;
		logoAlt?: string;
		surface?: 'dark' | 'transparent';
		onMap?: () => void;
	} = $props();
</script>

<!-- Keep contact actions in a fixed order across routes. The map callback
     preserves existing location drawers without changing the button geometry. -->
<header class:bc-mobile-appbar--dark={surface === 'dark'} class="bc-mobile-appbar">
	<a class="bc-mobile-appbar__brand" href={resolve('/')} aria-label="Day Night Auto начало">
		<img src={daynightAssets.logoLight} alt={logoAlt} width="1744" height="512" />
	</a>
	<div class="bc-mobile-appbar__actions" aria-label={actionsLabel}>
		{#if children}{@render children()}{:else}
			{#if onMap}<button type="button" onclick={onMap} aria-label="Карта" aria-haspopup="dialog"
					><MapPin size={18} strokeWidth={2.35} aria-hidden="true" /></button
				>
			{:else}<a
					href={'https://www.google.com/maps/search/?api=1&query=' +
						encodeURIComponent(daynightContact.addressLabel)}
					target="_blank"
					rel="noreferrer"
					aria-label="Карта"><MapPin size={18} strokeWidth={2.35} aria-hidden="true" /></a
				>{/if}
			<a href={daynightContact.primaryPhoneHref} aria-label="Обади се"
				><PhoneCall size={18} strokeWidth={2.35} aria-hidden="true" /></a
			>
			<a href={daynightContact.viberHref} aria-label="Пиши ни"
				><MessageCircle size={18} strokeWidth={2.35} aria-hidden="true" /></a
			>
		{/if}
	</div>
</header>

<style>
	.bc-mobile-appbar {
		position: absolute;
		top: 0;
		right: 0;
		left: 0;
		z-index: 20;
		display: flex;
		height: calc(56px + env(safe-area-inset-top));
		align-items: center;
		justify-content: space-between;
		gap: 10px;
		background: transparent;
		padding: env(safe-area-inset-top) 12px 0 16px;
	}

	.bc-mobile-appbar--dark {
		position: relative;
		background: #090a0b;
	}

	.bc-mobile-appbar__brand {
		display: flex;
		flex: 1 1 auto;
		min-width: 0;
		align-items: center;
		text-decoration: none !important;
	}

	.bc-mobile-appbar__brand img {
		display: block;
		/* Matches the rendered homepage header logo width on mobile; shrinks
		   when a page mounts more contextual actions. */
		width: 176px;
		max-width: 100%;
		max-height: 42px;
		height: auto;
		object-fit: contain;
	}

	/* The homepage is the mobile identity reference: its logo sits in a
	   170x48 slot and renders at the asset's natural 168px width. */
	.bc-mobile-appbar--dark .bc-mobile-appbar__brand {
		width: 170px;
		height: 48px;
		flex: 0 1 170px;
	}

	.bc-mobile-appbar--dark .bc-mobile-appbar__brand img {
		width: 168px;
		max-height: none;
	}

	.bc-mobile-appbar__actions {
		display: flex;
		flex: 0 0 auto;
		align-items: center;
		gap: 8px;
	}

	.bc-mobile-appbar__actions :global(a),
	.bc-mobile-appbar__actions :global(label),
	.bc-mobile-appbar__actions :global(button) {
		position: relative;
		display: flex;
		width: 44px;
		height: 44px;
		align-items: center;
		justify-content: center;
		border: 0;
		border-radius: 999px;
		background: transparent;
		box-shadow: none;
		color: #1c1c1c;
		cursor: pointer;
		isolation: isolate;
		padding: 0;
		text-decoration: none !important;
		transition: color 0.18s ease;
	}

	.bc-mobile-appbar__actions :global(a::before),
	.bc-mobile-appbar__actions :global(label::before),
	.bc-mobile-appbar__actions :global(button::before) {
		position: absolute;
		z-index: -1;
		width: 40px;
		height: 40px;
		border-radius: 999px;
		background: #ffffff;
		box-shadow: inset 0 0 0 1px rgba(28, 28, 28, 0.12);
		content: '';
		transition: background-color 0.18s ease;
	}

	.bc-mobile-appbar__actions :global(.bc-mobile-appbar__action--primary::before) {
		background: var(--bc-accent-bright-soft);
		box-shadow: none;
	}

	.bc-mobile-appbar--dark .bc-mobile-appbar__actions :global(a),
	.bc-mobile-appbar--dark .bc-mobile-appbar__actions :global(label),
	.bc-mobile-appbar--dark .bc-mobile-appbar__actions :global(button) {
		color: #ffffff;
	}

	.bc-mobile-appbar--dark .bc-mobile-appbar__actions :global(a::before),
	.bc-mobile-appbar--dark .bc-mobile-appbar__actions :global(label::before),
	.bc-mobile-appbar--dark .bc-mobile-appbar__actions :global(button::before) {
		background: #17191b;
		box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.22);
	}

	.bc-mobile-appbar__actions :global(a:focus-visible),
	.bc-mobile-appbar__actions :global(label:focus-visible),
	.bc-mobile-appbar__actions :global(button:focus-visible) {
		outline: 2px solid rgba(28, 28, 28, 0.64);
		outline-offset: 2px;
	}

	.bc-mobile-appbar--dark .bc-mobile-appbar__actions :global(a:focus-visible),
	.bc-mobile-appbar--dark .bc-mobile-appbar__actions :global(label:focus-visible),
	.bc-mobile-appbar--dark .bc-mobile-appbar__actions :global(button:focus-visible) {
		outline-color: rgba(255, 255, 255, 0.86);
	}

	.bc-mobile-appbar__actions :global(svg),
	.bc-mobile-appbar__actions :global(svg *) {
		color: currentColor;
		stroke: currentColor;
	}

	@media (max-width: 374px) {
		.bc-mobile-appbar__actions {
			gap: 6px;
		}
	}

	@media (max-width: 359px) {
		.bc-mobile-appbar__brand img {
			width: 128px;
		}
	}
</style>
