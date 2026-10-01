<script lang="ts">
  import type { Snippet } from 'svelte';
  let { children, title, titleId, titleTag = 'h2', class: className = '' }: { children: Snippet; title?: string; titleId?: string; titleTag?: 'h1' | 'h2'; class?: string } = $props();
</script>
<div class={['dn-entry-card', className]}>
  {#if title}<svelte:element this={titleTag} class="dn-entry-card__title" id={titleId}>{title}</svelte:element>{/if}
  {@render children()}
</div>
<style>
  .dn-entry-card { --dn-entry-height: var(--dn-control-height-default); display: grid; gap: var(--dn-entry-stack-gap); min-width: 0; padding: var(--dn-entry-card-padding); border: 1px solid var(--dn-line); border-radius: var(--dn-radius-lg); background: var(--dn-white); color: var(--dn-ink); box-shadow: var(--dn-card-shadow); }
  .dn-entry-card__title { margin: 0; text-align: center; font-size: var(--dn-text-subheading); font-weight: var(--dn-weight-semibold); line-height: var(--dn-leading-heading); letter-spacing: var(--dn-tracking-heading); }
</style>
