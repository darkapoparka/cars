<script lang="ts">
  import type { Snippet } from 'svelte';
  import Header from './Header.svelte';
  import Footer from './Footer.svelte';

  let footerVisible = $state(false);

  let { children, showFooterActions = true, showMobileFooter = false }: { children: Snippet; showFooterActions?: boolean; showMobileFooter?: boolean } = $props();
</script>

<div class="dn-app-shell">
  <a class="dn-skip-link" href="#main-content">Към съдържанието</a>
  <Header mobileFooterVisible={footerVisible} />
  <main id="main-content" tabindex="-1">{@render children()}</main>
  <Footer showActions={showFooterActions} {showMobileFooter} onVisibilityChange={(visible) => footerVisible = visible} />
</div>
