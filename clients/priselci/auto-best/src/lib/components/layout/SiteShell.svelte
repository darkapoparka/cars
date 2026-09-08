<script lang="ts">
  import type { Snippet } from 'svelte';
  import Header from './Header.svelte';
  import Footer from './Footer.svelte';

  let { children, showFooterActions = true, showMobileFooter = false }: { children: Snippet; showFooterActions?: boolean; showMobileFooter?: boolean } = $props();
</script>

<div class="dn-app-shell">
  <Header />
  <main>{@render children()}</main>
  <Footer showActions={showFooterActions} {showMobileFooter} />
</div>
