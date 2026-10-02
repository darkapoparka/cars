<script lang="ts">
  import { onDestroy } from 'svelte';
  import { resolve } from '$app/paths';
  import { goto } from '$app/navigation';
  import { getI18n } from '$lib/locale/context';
  import { dialogViewport } from '$lib/ui/dialog-viewport';
  import { lockPageScroll, preserveScrollOffset, trapDialogTab } from '$lib/ui/overlay';
  import { blogCategories, blogFilterHref, blogPosts, filterBlogPosts, type BlogCategory, type BlogFilters } from '$data/editorial';
  import MobileActionIcon from '$components/layout/MobileActionIcon.svelte';
  import BlogCard from './BlogCard.svelte';

  let { filters }: { filters: BlogFilters } = $props();
  const i18n = getI18n();
  let dialog = $state<HTMLDialogElement>();
  let trigger = $state<HTMLButtonElement>();
  let input = $state<HTMLInputElement>();
  let query = $state('');
  let category = $state<BlogCategory | ''>('');
  let opened = $state(false);
  let navigating = false;
  let releaseScroll: (() => void) | undefined;
  let releaseOffset: ((restoreScroll?: boolean) => void) | undefined;
  const draft = $derived<BlogFilters>({ q: query.trim(), category });
  const matches = $derived(filterBlogPosts(blogPosts, draft, i18n.locale));
  const resultLabel = $derived(`${matches.length} ${i18n.t(matches.length === 1 ? 'm_8445b821d762' : 'm_c8449ee1e564')}`);
  const returnUrl = $derived(i18n.href(resolve(blogFilterHref(draft, category) as '/blog')));

  function openSearch() {
    if (!dialog || dialog.open) return;
    query = filters.q;
    category = filters.category;
    navigating = false;
    releaseOffset = preserveScrollOffset('--dn-blog-search-scroll');
    releaseScroll = lockPageScroll();
    opened = true;
    dialog.showModal();
    input?.focus({ preventScroll: true });
  }

  function restore() {
    opened = false;
    releaseScroll?.();
    releaseScroll = undefined;
    releaseOffset?.(!navigating);
    releaseOffset = undefined;
    if (!navigating && trigger?.isConnected) trigger.focus({ preventScroll: true });
  }

  function closeSearch() { dialog?.close(); }
  function handleDialogKeydown(event: KeyboardEvent) {
    if (event.key === 'Escape' && !event.isComposing) {
      event.preventDefault();
      event.stopPropagation();
      closeSearch();
      return;
    }
    trapDialogTab(event);
  }
  function navigate() { navigating = true; closeSearch(); }
  function clearSearch() { query = ''; category = ''; input?.focus({ preventScroll: true }); }
  function cleanFormData(event: FormDataEvent) {
    if (draft.q) event.formData.set('q', draft.q);
    else event.formData.delete('q');
  }
  async function openArticle(event: MouseEvent, id: number) {
    if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    event.preventDefault();
    if (navigating) return;
    const href = (event.currentTarget as HTMLAnchorElement).href;
    navigating = true;
    // Load the filtered list before replacing its history entry, so browser Back
    // restores real result data as well as the query/category URL.
    await goto(`${returnUrl}#article-${id}`, { replaceState: true, noScroll: true, keepFocus: true });
    await goto(href);
  }
  onDestroy(() => { navigating = true; closeSearch(); restore(); });
</script>

<button
  class="dn-blog-search-trigger"
  bind:this={trigger}
  type="button"
  aria-haspopup="dialog"
  aria-controls="dn-blog-search-dialog"
  aria-expanded={opened}
  aria-label={`${i18n.t('m_2de9b4285a63')}${filters.q ? `: ${filters.q}` : ''}`}
  onclick={openSearch}
>
  <MobileActionIcon name="search" size={18} />
  <span class="dn-blog-search-trigger__label" class:has-query={Boolean(filters.q)}>{filters.q || i18n.t('m_2de9b4285a63')}</span>
  <span class="dn-blog-search-trigger__arrow dn-icon-button" aria-hidden="true"><MobileActionIcon name="arrow" size={16} /></span>
</button>

<dialog
  class="dn-blog-search-dialog"
  id="dn-blog-search-dialog"
  bind:this={dialog}
  {@attach dialogViewport}
  aria-labelledby="dn-blog-search-title"
  onkeydown={handleDialogKeydown}
  onclose={restore}
>
  <header class="dn-mobile-overlay-header dn-blog-search-dialog__header">
    <h2 id="dn-blog-search-title">{i18n.t('m_2de9b4285a63')}</h2>
    <button class="dn-icon-button dn-overlay-close" type="button" aria-label={i18n.t('m_aea2bd97046c')} onclick={closeSearch}><MobileActionIcon name="close" size={22} /></button>
  </header>

  <form class="dn-blog-search-dialog__form" id="dn-blog-search-form" role="search" aria-label={i18n.t('m_2de9b4285a63')} method="GET" action={i18n.href(resolve('/blog'))} onsubmit={navigate} onformdata={cleanFormData}>
    <label class="dn-sr-only" for="dn-blog-search-query">{i18n.t('m_2de9b4285a63')}</label>
    <div class="dn-blog-search-dialog__field dn-mobile-overlay-search">
      <MobileActionIcon name="search" size={18} />
      <input {@attach i18n.validation} id="dn-blog-search-query" bind:this={input} bind:value={query} type="search" name="q" placeholder={i18n.t('m_2de9b4285a63')} autocomplete="off" aria-describedby="dn-blog-search-status" />
    </div>
    {#if category}<input type="hidden" name="category" value={category} />{/if}
    <div class="dn-blog-search-dialog__categories" role="group" aria-label={i18n.t('m_05f6c615a351')}>
      <button type="button" aria-pressed={!category} onclick={() => category = ''}>{i18n.t('m_a52ace420f21')}</button>
      {#each blogCategories as choice (choice)}
        <button type="button" aria-pressed={category === choice} onclick={() => category = choice}>{i18n.text(choice)}</button>
      {/each}
    </div>
  </form>

  <div class="dn-blog-search-dialog__results">
    <div class="dn-blog-search-dialog__status-row">
      <p class="dn-blog-search-dialog__status" id="dn-blog-search-status" role="status" aria-live="polite" aria-atomic="true">{resultLabel}</p>
      {#if query || category}<button class="dn-blog-search-dialog__clear" type="button" onclick={clearSearch}>{i18n.t('action.clearShort')}</button>{/if}
    </div>
    {#if matches.length}
      {#each matches as post (post.id)}
        <BlogCard {post} idPrefix="search-article" returnTo={`${returnUrl}#article-${post.id}`} onselect={event => openArticle(event, post.id)} />
      {/each}
    {:else}
      <div class="dn-blog-search-dialog__empty"><p>{i18n.t('m_2a8ea875a859')}</p></div>
    {/if}
  </div>

  <footer class="dn-mobile-overlay-footer dn-blog-search-dialog__footer">
    <button class="dn-blog-search-dialog__apply" type="submit" form="dn-blog-search-form" disabled={!matches.length}>
      {i18n.t('action.showCount', { count: resultLabel })}<MobileActionIcon name="arrow" size={18} />
    </button>
  </footer>
</dialog>

<style>
  .dn-blog-search-trigger { display: flex; width: 100%; min-width: 0; min-height: var(--dn-control-height-prominent); align-items: center; gap: var(--dn-space-3); padding: var(--dn-space-half) var(--dn-space-1) var(--dn-space-half) var(--dn-space-4); border: 0; border-radius: var(--dn-radius-control); background: var(--dn-entry-prominent-surface); color: var(--dn-entry-prominent-muted); font: var(--dn-entry-prominent-font); text-align: start; cursor: pointer; }
  .dn-blog-search-trigger__label { flex: 1; min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
  .dn-blog-search-trigger__label.has-query { color: var(--dn-ink); }
  .dn-blog-search-trigger__arrow { background-color: var(--dn-ink); color: var(--dn-white); }
  .dn-blog-search-trigger:focus-visible { outline: 2px solid var(--dn-focus); outline-offset: 2px; }
  :global(body:has(.dn-blog-search-dialog[open])) { position: fixed; top: var(--dn-blog-search-scroll, 0); width: 100%; }
  .dn-blog-search-dialog { position: fixed; inset: 0; top: var(--dn-dialog-viewport-top, 0); width: 100%; max-width: none; height: var(--dn-dialog-viewport-height, 100dvh); max-height: var(--dn-dialog-viewport-height, 100dvh); margin: 0; padding: 0; overflow: hidden; border: 0; border-radius: 0; background: var(--dn-white); color: var(--dn-ink); }
  .dn-blog-search-dialog[open] { display: flex; flex-direction: column; }
  .dn-blog-search-dialog::backdrop { background: rgb(0 0 0 / 55%); }
  .dn-blog-search-dialog__header { display: flex; flex: 0 0 auto; align-items: center; gap: var(--dn-space-3); padding: var(--dn-overlay-header-padding); }
  h2 { flex: 1; min-width: 0; margin: 0; font-size: var(--dn-text-card); font-weight: var(--dn-weight-semibold); line-height: var(--dn-leading-heading); overflow-wrap: anywhere; }
  .dn-overlay-close { margin-inline-start: auto; background-color: var(--dn-home-panel); color: var(--dn-ink); }
  .dn-blog-search-dialog__form { flex: 0 0 auto; min-width: 0; padding: 0 var(--dn-overlay-gutter) var(--dn-space-3); }
  .dn-blog-search-dialog__field { display: flex; min-height: var(--dn-overlay-control-height); align-items: center; gap: var(--dn-space-3); padding: 0 var(--dn-space-3); border: 0; border-radius: var(--dn-radius-control); background: var(--dn-entry-prominent-surface); color: var(--dn-muted); }
  .dn-blog-search-dialog .dn-blog-search-dialog__field input[type='search'] { flex: 1; width: 100%; min-width: 0; min-height: var(--dn-overlay-control-height); height: auto; padding: var(--dn-space-2) 0; border: 0; outline: none; background: transparent; color: var(--dn-ink); font: var(--dn-overlay-field-font); }
  .dn-blog-search-dialog__field:focus-within { outline: 2px solid var(--dn-focus); outline-offset: 2px; }
  .dn-blog-search-dialog__categories { display: flex; gap: var(--dn-entry-action-gap); margin-top: var(--dn-space-3); padding: var(--dn-space-half) 0; overflow-x: auto; scrollbar-width: none; }
  .dn-blog-search-dialog__categories::-webkit-scrollbar { display: none; }
  .dn-blog-search-dialog__categories button { flex: 0 0 auto; min-height: var(--dn-control-height-default); padding: var(--dn-space-2) var(--dn-space-4); border: 0; border-radius: var(--dn-pill); background: var(--dn-home-panel); color: var(--dn-ink); font: var(--dn-control-font); white-space: nowrap; cursor: pointer; }
  .dn-blog-search-dialog__categories button[aria-pressed='true'] { background: var(--dn-ink); color: var(--dn-white); }
  .dn-blog-search-dialog__results { display: grid; grid-auto-rows: max-content; flex: 1; min-height: 0; align-content: start; gap: var(--dn-space-3); padding: var(--dn-space-3); overflow-y: auto; overscroll-behavior: contain; background: var(--dn-mobile-canvas); }
  .dn-blog-search-dialog__status-row { display: flex; min-height: var(--dn-space-8); align-items: center; justify-content: space-between; gap: var(--dn-space-3); padding-inline-start: var(--dn-space-4); }
  .dn-blog-search-dialog__status { margin: 0; color: var(--dn-muted); font-size: var(--dn-text-meta); line-height: var(--dn-leading-meta); }
  .dn-blog-search-dialog__clear { flex: 0 0 auto; min-height: var(--dn-control-height-default); padding: var(--dn-space-2) var(--dn-space-3); border: 0; border-radius: var(--dn-pill); background: var(--dn-white); color: var(--dn-ink); font: var(--dn-overlay-option-font); cursor: pointer; }
  .dn-blog-search-dialog__empty { padding: var(--dn-space-8) var(--dn-space-4); color: var(--dn-muted); font: var(--dn-body-font); text-align: center; }
  .dn-blog-search-dialog__empty p { margin: 0; }
  .dn-blog-search-dialog__footer { display: flex; flex: 0 0 auto; align-items: center; gap: var(--dn-space-3); padding: var(--dn-space-3) var(--dn-overlay-gutter) max(var(--dn-space-3), env(safe-area-inset-bottom)); background: var(--dn-white); }
  .dn-blog-search-dialog__apply { display: flex; flex: 1; min-width: 0; min-height: var(--dn-overlay-control-height); align-items: center; justify-content: center; gap: var(--dn-space-2); padding: var(--dn-space-2) var(--dn-space-3); border: 0; border-radius: var(--dn-radius-button); background: var(--dn-ink); color: var(--dn-white); font: var(--dn-control-font); text-align: center; overflow-wrap: anywhere; cursor: pointer; }
  .dn-blog-search-dialog__apply:disabled { background: var(--dn-line); color: var(--dn-muted); cursor: default; }
  .dn-blog-search-dialog :is(button, input):focus-visible { outline: 2px solid var(--dn-focus); outline-offset: 2px; }
</style>
