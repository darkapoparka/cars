<script lang="ts">
  import type { Snippet } from 'svelte';
  import Icon from '../Icon.svelte';
  import MobileActionIcon from '$components/layout/MobileActionIcon.svelte';
  let { children, href, dialog = false, type = 'submit', onclick, 'aria-label': ariaLabel, class: className = '' }: {
    children: Snippet;
    href?: string;
    dialog?: boolean;
    type?: 'button' | 'submit' | 'reset';
    onclick?: (event: MouseEvent) => void;
    'aria-label'?: string;
    class?: string;
  } = $props();
</script>
{#snippet content()}
  <span class="dn-entry-action__label">{@render children()}</span>
  <span class="dn-entry-action__icon dn-entry-action__icon--desktop"><Icon name="arrow-right" size={15} strokeWidth={1.7} /></span>
  <span class="dn-entry-action__icon dn-entry-action__icon--mobile"><MobileActionIcon name="arrow" size={15} /></span>
{/snippet}
{#if href}
  <a class={['dn-compact-control dn-entry-action dn-compact-primary', className]} {href} {onclick} aria-label={ariaLabel}>{@render content()}</a>
{:else}
  <button class={['dn-compact-control dn-entry-action dn-compact-primary', className]} {type} {onclick} aria-label={ariaLabel} aria-haspopup={dialog ? 'dialog' : undefined}>{@render content()}</button>
{/if}
<style>
  .dn-entry-action { justify-self: center; max-width: 100%; margin: 0 auto; cursor: pointer; }
  .dn-entry-action:focus-visible { outline: 3px solid var(--dn-focus); outline-offset: 2px; }
  .dn-entry-action__icon { display: inline-flex; flex: 0 0 auto; }
  .dn-entry-action__icon--mobile { display: none; }
  @media (max-width: 767px) {
    .dn-entry-action__label { min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
    .dn-entry-action__icon--desktop { display: none; }
    .dn-entry-action__icon--mobile { display: inline-flex; }
  }
</style>
