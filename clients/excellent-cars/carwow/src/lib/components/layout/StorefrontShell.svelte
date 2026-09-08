<script lang="ts">
	import type { Snippet } from 'svelte';

	interface Props {
		children: Snippet;
		mobileReplaced?: boolean;
	}

	let { children, mobileReplaced = false }: Props = $props();

	const shellClasses = $derived([
		'max-[991px]:pt-[calc(62px+env(safe-area-inset-top))] max-[991px]:pb-[calc(96px+env(safe-area-inset-bottom))]',
		'max-[991px]:[&_[data-daynight-site-chrome]]:hidden max-[991px]:[&_.header]:hidden max-[991px]:[&_.progress-wrap]:hidden',
		'max-[991px]:[&_.daynight-contact-primary]:!pt-4 max-[991px]:[&_.tf-spacing-style2]:!h-6 max-[991px]:[&_.tf-spacing-style3]:!h-6 max-[991px]:[&_.tf-spacing]:!h-6',
		'max-[991px]:[&_.breadcrumb_a]:inline-flex max-[991px]:[&_.breadcrumb_a]:min-h-11 max-[991px]:[&_.breadcrumb_a]:min-w-11 max-[991px]:[&_.breadcrumb_a]:items-center',
		'max-[991px]:[&_.pagination_a]:inline-flex max-[991px]:[&_.pagination_a]:min-h-11 max-[991px]:[&_.pagination_a]:min-w-11 max-[991px]:[&_.pagination_a]:items-center',
		'max-[991px]:[&_.pagination_button]:inline-flex max-[991px]:[&_.pagination_button]:min-h-11 max-[991px]:[&_.pagination_button]:min-w-11 max-[991px]:[&_.pagination_button]:items-center',
		'max-[991px]:[&_.widget-menu-tab_a]:inline-flex max-[991px]:[&_.widget-menu-tab_a]:min-h-11 max-[991px]:[&_.widget-menu-tab_a]:min-w-11 max-[991px]:[&_.widget-menu-tab_a]:items-center',
		'max-[991px]:[&_.terms-condition_a]:inline-flex max-[991px]:[&_.terms-condition_a]:min-h-11 max-[991px]:[&_.terms-condition_a]:min-w-11 max-[991px]:[&_.terms-condition_a]:items-center',
		'max-[991px]:[&_a.h7]:inline-flex max-[991px]:[&_a.h7]:min-h-11 max-[991px]:[&_a.h7]:min-w-11 max-[991px]:[&_a.h7]:items-center',
		mobileReplaced && 'max-[991px]:!hidden'
	]);
</script>

<div id="wrapper" class={shellClasses}>
	{@render children()}
</div>
