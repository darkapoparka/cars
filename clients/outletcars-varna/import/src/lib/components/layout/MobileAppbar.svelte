<script lang="ts">
	import { assetHref } from '$lib/utils/assets';
	import { nativeMessage } from '$lib/i18n/native';

	const nt = (key: import('$lib/i18n/native').NativeKey) =>
		nativeMessage(page.data.locale === 'en' ? 'en' : 'bg', key);
	import { linkHref as resolve } from '$lib/utils/links';
	import MapPin from '@lucide/svelte/icons/map-pin';
	import PhoneCall from '@lucide/svelte/icons/phone-call';
	import MessageCircle from '@lucide/svelte/icons/message-circle';
	import { site } from '$lib/config/site';
	import { page } from '$app/state';
	import type { Snippet } from 'svelte';
	import MobileIconAction from '$lib/components/common/MobileIconAction.svelte';

	let {
		actionsLabel = nt('ui137'),
		children,
		logoAlt = site.identity.name,
		surface = 'transparent',
		onMap
	}: {
		actionsLabel?: string;
		children?: Snippet;
		logoAlt?: string;
		surface?: 'dark' | 'transparent';
		onMap?: () => void;
	} = $props();
	const english = $derived(page.data.locale === 'en');
</script>

<!-- Keep contact actions in a fixed order across routes. The map callback
     preserves existing location drawers without changing the button geometry. -->
<header class:bc-mobile-appbar--dark={surface === 'dark'} class="bc-mobile-appbar">
	<a
		class="bc-mobile-appbar__brand"
		href={resolve(english ? '/?lang=en' : '/')}
		aria-label={site.identity.name + (english ? ' home' : ' начало')}
	>
		<img
			src={assetHref(surface === 'dark' ? site.identity.logoOnDark : site.identity.logo)}
			alt={logoAlt}
			width="1744"
			height="512"
		/>
	</a>
	<div class="bc-mobile-appbar__actions" role="group" aria-label={actionsLabel}>
		{#if children}{@render children()}{:else}
			{#if onMap}
				<MobileIconAction
					label={english ? 'Map' : 'Карта'}
					tone={surface === 'dark' ? 'dark' : 'light'}
					haspopup="dialog"
					onclick={onMap}
				>
					<MapPin size={18} strokeWidth={2.35} aria-hidden="true" />
				</MobileIconAction>
			{:else}
				<MobileIconAction
					label={english ? 'Map' : 'Карта'}
					tone={surface === 'dark' ? 'dark' : 'light'}
					href={site.contact.mapHref}
					target="_blank"
					rel="noreferrer"
				>
					<MapPin size={18} strokeWidth={2.35} aria-hidden="true" />
				</MobileIconAction>
			{/if}
			<MobileIconAction
				label={english ? 'Call' : 'Обади се'}
				tone={surface === 'dark' ? 'dark' : 'light'}
				href={site.contact.phoneHref}
			>
				<PhoneCall size={18} strokeWidth={2.35} aria-hidden="true" />
			</MobileIconAction>
			<MobileIconAction
				label={english ? 'Message' : 'Пиши ни'}
				tone={surface === 'dark' ? 'dark' : 'light'}
				href={site.contact.messageHref}
			>
				<MessageCircle size={18} strokeWidth={2.35} aria-hidden="true" />
			</MobileIconAction>
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
		height: calc(var(--bc-mobile-appbar-height) + env(safe-area-inset-top));
		align-items: center;
		justify-content: space-between;
		gap: var(--bc-space-2);
		background: transparent;
		padding: env(safe-area-inset-top) var(--bc-space-3) 0 var(--bc-space-4);
	}

	.bc-mobile-appbar--dark {
		position: relative;
		background: var(--bc-mobile-dark);
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
		gap: var(--bc-space-2);
	}

	@media (max-width: 374px) {
		.bc-mobile-appbar__actions {
			gap: var(--bc-space-1);
		}
	}

	@media (max-width: 359px) {
		.bc-mobile-appbar__brand img {
			width: 128px;
		}
	}
</style>
