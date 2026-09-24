<script lang="ts">
  import { page } from '$app/state';
  import { getI18n } from './context';
  const i18n = getI18n();
  let { compact = true, fullLabel = false, footer = false, beforeOpen }: { compact?: boolean; fullLabel?: boolean; footer?: boolean; beforeOpen?: () => void | HTMLElement | Promise<void | HTMLElement> } = $props();
  const fallback = $derived(`/${i18n.locale}/locale-settings?returnTo=${encodeURIComponent(page.url.pathname + page.url.search)}`);
  async function open(event: MouseEvent) {
    if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    event.preventDefault(); const originalOpener = event.currentTarget;
    const opener = (await beforeOpen?.()) ?? originalOpener;
    window.dispatchEvent(new CustomEvent('cars:locale-open', { detail: { opener } }));
  }
</script>
<a {@attach i18n.registerFocusTarget} class="cars-locale-trigger" class:cars-locale-trigger--full={fullLabel} class:cars-locale-trigger--footer={footer} href={fallback} data-locale-selector aria-haspopup="dialog" aria-label={i18n.t('locale.trigger')} title={i18n.t('locale.title')} onclick={open}>
  {#if fullLabel}{i18n.t('locale.title')}{:else}{i18n.locale.toUpperCase()}{#if !compact}<span aria-hidden="true"> · {i18n.state.country}</span>{/if}{/if}
</a>
<style>
  .cars-locale-trigger{display:inline-flex;align-items:center;justify-content:center;gap:.25rem;min-width:44px;min-height:44px;padding:.35rem .5rem;border:1px solid currentColor;border-radius:.65rem;background:transparent;color:inherit;font:inherit;font-size:var(--dn-text-caption);line-height:var(--dn-leading-badge);font-weight:var(--dn-weight-semibold);text-decoration:none;cursor:pointer;flex-shrink:0;box-sizing:border-box}
  .cars-locale-trigger:hover{opacity:.82}.cars-locale-trigger:focus-visible{outline:2px solid currentColor;outline-offset:3px}.cars-locale-trigger--full{justify-content:flex-start;font-size:var(--dn-text-meta);width:100%;padding:.75rem;border-color:transparent;white-space:normal}
  @media(max-width:991px){.cars-locale-trigger--footer{margin-bottom:calc(160px + env(safe-area-inset-bottom,0px))}}
</style>
