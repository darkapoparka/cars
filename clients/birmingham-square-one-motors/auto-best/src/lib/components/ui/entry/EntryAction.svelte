<script lang="ts">
  import type { Snippet } from 'svelte';
  import Icon from '../Icon.svelte';
  let { children, href, dialog = false, class: className = '' }: { children: Snippet; href?: string; dialog?: boolean; class?: string } = $props();
</script>
{#if href}
  <a class={['dn-compact-control dn-entry-action dn-compact-primary', className]} {href}>{@render children()}<Icon name="arrow-right" size={15} strokeWidth={1.7} /></a>
{:else}
  <button class={['dn-compact-control dn-entry-action dn-compact-primary', className]} type="submit" aria-haspopup={dialog ? 'dialog' : undefined}>{@render children()}<Icon name="arrow-right" size={15} strokeWidth={1.7} /></button>
{/if}
<style>
  .dn-entry-action { justify-self: center; max-width: 100%; margin: 0 auto; cursor: pointer; }
  .dn-entry-action:focus-visible { outline: 3px solid var(--dn-focus); outline-offset: 2px; }
</style>
