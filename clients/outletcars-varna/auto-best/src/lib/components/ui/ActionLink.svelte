<script lang="ts">
  import { resolve } from '$app/paths';
  import type { Snippet } from 'svelte';
  import type { InternalNavigationHref } from '$data/navigation';
  let { href, class: className = '', children }: {
    href: InternalNavigationHref;
    class?: string;
    children: Snippet;
  } = $props();
</script>

<a class={`dn-action-link ${className}`} href={resolve(href)}>{@render children()}</a>

<style>
  .dn-action-link { font: var(--dn-cta-font); letter-spacing: var(--dn-cta-tracking); }
</style>
