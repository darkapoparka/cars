<script lang="ts">
	import type { Snippet } from 'svelte';
	import PublicHeader from './PublicHeader.svelte';
	import PublicFooter from './PublicFooter.svelte';
	import SiteHeader from './SiteHeader.svelte';
	import SiteFooter from './SiteFooter.svelte';
	import SiteSkipLink from './SiteSkipLink.svelte';
	let { children, pathname }: { children: Snippet; pathname: string } = $props();
</script>

<div class="site-shell">
	<div class="site-desktop-only"><SiteSkipLink /></div>
	<PublicHeader mobile={false} />
	<div class="site-mobile-only"><SiteHeader variant="light" {pathname} /></div>
	{@render children()}
	<div class="site-desktop-only"><PublicFooter /></div>
	<div class="site-mobile-only"><SiteFooter /></div>
</div>
