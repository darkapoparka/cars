<script lang="ts">
  import { page } from '$app/state';
  import { resolve } from '$app/paths';
  import { onDestroy } from 'svelte';
  import type { Attachment } from 'svelte/attachments';
  import { getI18n } from '$lib/locale/context';
  import { lockPageScroll, trapDialogTab } from '$lib/ui/overlay';
  import { homeBannerVariants, selectedHomeBanner } from '$lib/ui/home-banner';
  import { leadSite } from '$config/lead-site';
  import MobileActionIcon from './MobileActionIcon.svelte';

  const i18n = getI18n();
  let { closeMobile }: { closeMobile: (restoreFocus?: boolean) => Promise<void | HTMLElement> } = $props();
  let dialog = $state<HTMLDialogElement>();
  let trigger = $state<HTMLButtonElement>();
  let closeButton = $state<HTMLButtonElement>();
  let releaseScroll: (() => void) | undefined;
  const bannerVariant = $derived(selectedHomeBanner(page.url.searchParams));
  const attachDialog: Attachment<HTMLDialogElement> = node => { dialog = node; return () => { dialog = undefined; }; };
  const attachTrigger: Attachment<HTMLButtonElement> = node => { trigger = node; return () => { trigger = undefined; }; };
  const attachClose: Attachment<HTMLButtonElement> = node => { closeButton = node; return () => { closeButton = undefined; }; };

  function openPicker() {
    if (!dialog || dialog.open) return;
    releaseScroll = lockPageScroll();
    dialog.showModal();
    closeButton?.focus();
  }

  function closePicker(restoreFocus = true) {
    dialog?.close();
    releaseScroll?.();
    releaseScroll = undefined;
    if (restoreFocus) trigger?.focus();
  }

  function selectBanner() {
    closePicker(false);
    void closeMobile();
  }

  function handleKeydown(event: KeyboardEvent) {
    event.stopPropagation();
    trapDialogTab(event);
    if (event.key === 'Escape') {
      event.preventDefault();
      closePicker();
    }
  }

  onDestroy(() => releaseScroll?.());
</script>

<button class="dn-banner-picker-trigger" type="button" aria-haspopup="dialog" aria-controls="dn-banner-picker" onclick={openPicker} {@attach attachTrigger}>{i18n.t('home.bannerPreview.title')}</button>

<dialog class="dn-banner-picker" id="dn-banner-picker" aria-labelledby="dn-banner-picker-title" tabindex="-1" {@attach attachDialog} onkeydown={handleKeydown} oncancel={(event) => { event.preventDefault(); event.stopPropagation(); closePicker(); }} onclick={(event) => { if (event.target === event.currentTarget) closePicker(); }}>
  <header class="dn-banner-picker__header">
    <h2 id="dn-banner-picker-title">{i18n.t('home.bannerPreview.title')}</h2>
    <button class="dn-banner-picker__close dn-icon-button" type="button" aria-label={i18n.t('m_434b5049f81b')} onclick={() => closePicker()} {@attach attachClose}><MobileActionIcon name="close" size={18} /></button>
  </header>
  <div class="dn-banner-picker__options" role="group" aria-labelledby="dn-banner-picker-title">
    {#each homeBannerVariants as variant (variant.id)}
      <a href={i18n.href(resolve(`/?banner=${variant.id}#featured-title`))} aria-current={bannerVariant === variant.id ? 'true' : undefined} onclick={selectBanner}>
        <span class="dn-banner-picker__image" data-banner-variant={variant.id} style:background-image={`url("${leadSite.artwork.homeSectionBannerMobileAssets[variant.id]}")`} aria-hidden="true"></span>
        <span class="dn-banner-picker__label">{i18n.t(variant.label)}</span>
        <span class="dn-banner-picker__mark" aria-hidden="true"></span>
      </a>
    {/each}
  </div>
</dialog>

<style>
  .dn-banner-picker-trigger { display: flex; align-items: center; justify-content: center; width: 100%; min-width: 0; min-height: var(--dn-control-hit-height); margin: 0; padding: var(--dn-space-2) var(--dn-space-3); border: 1px solid var(--dn-line); border-radius: var(--dn-pill); background: var(--dn-white); color: var(--dn-ink); font: var(--dn-overlay-action-font); white-space: nowrap; cursor: pointer; }
  .dn-banner-picker { position: fixed; inset: 0; width: min(440px, calc(100% - var(--dn-space-8))); max-height: calc(100dvh - var(--dn-space-8)); margin: auto; padding: var(--dn-space-4); overflow-y: auto; border: 0; border-radius: var(--dn-radius-sheet); background: var(--dn-surface-raised); color: var(--dn-ink); }
  .dn-banner-picker::backdrop { background: rgb(10 13 18 / .54); }
  .dn-banner-picker__header { display: flex; align-items: center; justify-content: space-between; gap: var(--dn-space-3); margin-bottom: var(--dn-space-3); }
  .dn-banner-picker__header h2 { margin: 0; font-size: var(--dn-text-card); font-weight: var(--dn-weight-semibold); line-height: var(--dn-leading-heading); }
  .dn-banner-picker__close { flex-shrink: 0; border: 0; border-radius: var(--dn-pill); background: var(--dn-home-panel); color: var(--dn-ink); }
  .dn-banner-picker__options { display: grid; gap: var(--dn-space-2); }
  .dn-banner-picker__options a { display: flex; align-items: center; gap: var(--dn-space-3); min-width: 0; min-height: 64px; padding: var(--dn-space-2); border: 1px solid var(--dn-line); border-radius: var(--dn-radius); color: var(--dn-ink); font: var(--dn-control-font); text-decoration: none; }
  .dn-banner-picker__options a[aria-current='true'] { border-color: var(--dn-ink); background: var(--dn-mobile-selection-surface); }
  .dn-banner-picker__image { position: relative; flex: 0 0 80px; height: 28px; overflow: hidden; border-radius: var(--dn-radius-sm); background-size: cover; background-position: center; }
  .dn-banner-picker__image[data-banner-variant='circuit']::after { content: ''; position: absolute; inset: 0; background: inherit; transform: scaleX(-1); mask-image: linear-gradient(to right, var(--dn-ink) 0 13%, transparent 23%); }
  .dn-banner-picker__image[data-banner-variant='motorsport']::before, .dn-banner-picker__image[data-banner-variant='motorsport']::after { content: ''; position: absolute; inset-block: 0; width: 8px; background: linear-gradient(to right, var(--dn-red) 0 4px, transparent 4px 5px, var(--dn-surface-canvas) 5px 8px); transform: skewX(-28deg); }
  .dn-banner-picker__image[data-banner-variant='motorsport']::before { left: 4px; }
  .dn-banner-picker__image[data-banner-variant='motorsport']::after { right: 4px; }
  .dn-banner-picker__label { flex: 1; min-width: 0; overflow-wrap: anywhere; }
  .dn-banner-picker__mark { flex: 0 0 16px; height: 16px; border: 1px solid var(--dn-line-strong); border-radius: var(--dn-pill); }
  .dn-banner-picker__options a[aria-current='true'] .dn-banner-picker__mark { border: 4px solid var(--dn-surface-raised); background: var(--dn-ink); outline: 1px solid var(--dn-ink); }
  :is(a, button):focus-visible { outline: 2px solid var(--dn-focus); outline-offset: 2px; }
  @media (max-width: 767px) { .dn-banner-picker__options a { border-radius: var(--dn-radius-card); } }
  @media (hover: hover) { .dn-banner-picker-trigger:hover, .dn-banner-picker__options a:hover { background: var(--dn-home-panel); } }
</style>
