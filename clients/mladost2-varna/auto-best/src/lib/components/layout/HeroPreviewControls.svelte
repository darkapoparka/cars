<script lang="ts">
  import { page } from '$app/state';
  import { goto } from '$app/navigation';
  import { resolve } from '$app/paths';
  import { getI18n, applicationUrl } from '$lib/locale/context';
  import { heroPreviewVariants, type HeroPreviewVariant } from '$lib/ui/hero-preview';

  let { variant }: { variant: HeroPreviewVariant } = $props();
  const i18n = getI18n();
  let expanded = $state(false);
  const active = $derived(heroPreviewVariants.find(option => option.id === variant)!);
  const routes = [
    { path: '/', topic: '', label: 'heroPreview.home' },
    { path: '/contact', topic: 'trade-in', label: 'home.action.sell.title' },
    { path: '/contact', topic: 'import', label: 'home.action.import.title' }
  ] as const;

  async function choose(nextVariant: HeroPreviewVariant) {
    const next = new URL(page.url);
    next.searchParams.set('hero', nextVariant);
    const targetPath = applicationUrl(page.url).pathname === '/contact' ? '/contact' : '/';
    await goto(i18n.href(resolve(`${targetPath}?${next.searchParams.toString()}${next.hash}`)), { replaceState: true, noScroll: true, keepFocus: true });
  }
</script>

<aside class="dn-hero-review" aria-label={i18n.t('heroPreview.title')}>
  <button class="dn-hero-review__toggle" type="button" aria-expanded={expanded} aria-controls="dn-hero-review-panel" onclick={() => { expanded = !expanded; }}>
    {i18n.t('heroPreview.title')} · {i18n.t(active.label)}
    <span aria-hidden="true">{expanded ? '−' : '+'}</span>
  </button>
  {#if expanded}
    <div class="dn-hero-review__panel" id="dn-hero-review-panel">
      <div class="dn-hero-review__options" role="group" aria-label={i18n.t('heroPreview.title')}>
        {#each heroPreviewVariants as option (option.id)}
          <button type="button" aria-pressed={variant === option.id} onclick={() => choose(option.id)}>{i18n.t(option.label)}</button>
        {/each}
      </div>
      <p>{i18n.t('heroPreview.sizes', { mobile: active.mobile, desktop: active.desktop })}</p>
      {#if variant === 'photo'}<p>{i18n.t('heroPreview.samplePhoto')}</p>{/if}
      <nav aria-label={i18n.t('heroPreview.pages')}>
        {#each routes as route (`${route.path}:${route.topic}`)}
          <a href={i18n.href(resolve(`${route.path}?${route.topic ? `topic=${route.topic}&` : ''}hero=${variant}`))}>{i18n.t(route.label)}</a>
        {/each}
      </nav>
    </div>
  {/if}
</aside>

<style>
  .dn-hero-review { position: fixed; z-index: 90; right: var(--dn-space-4); bottom: var(--dn-space-4); width: min(360px, calc(100% - var(--dn-space-6))); color: var(--dn-ink); }
  .dn-hero-review__toggle { display: flex; align-items: center; justify-content: space-between; gap: var(--dn-space-4); min-height: var(--dn-control-hit-height); width: 100%; padding: var(--dn-space-2) var(--dn-space-4); border: 1px solid var(--dn-line); border-radius: var(--dn-pill); background: var(--dn-surface-raised); color: var(--dn-ink); box-shadow: var(--dn-shadow); font: var(--dn-control-font); cursor: pointer; }
  .dn-hero-review__panel { position: absolute; right: 0; bottom: calc(100% + var(--dn-space-2)); width: 100%; padding: var(--dn-space-3); border: 1px solid var(--dn-line); border-radius: var(--dn-radius-card); background: var(--dn-surface-raised); box-shadow: var(--dn-shadow); }
  .dn-hero-review__options { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: var(--dn-space-2); }
  .dn-hero-review__options button, .dn-hero-review nav a { display: flex; align-items: center; justify-content: center; min-height: var(--dn-control-hit-height); padding: var(--dn-space-2); border: 1px solid var(--dn-line); border-radius: var(--dn-pill); background: var(--dn-surface-raised); color: var(--dn-ink); font: var(--dn-control-font); text-decoration: none; cursor: pointer; }
  .dn-hero-review__options button[aria-pressed='true'] { border-color: var(--dn-ink); background: var(--dn-ink); color: var(--dn-white); }
  .dn-hero-review p { margin: var(--dn-space-3) 0; color: var(--dn-muted); font-size: var(--dn-text-meta); line-height: var(--dn-leading-body); }
  .dn-hero-review nav { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: var(--dn-space-2); }
  .dn-hero-review :is(a, button):focus-visible { outline: 2px solid var(--dn-focus); outline-offset: 2px; }
  @media (max-width: 767px) { .dn-hero-review { right: var(--dn-space-3); bottom: calc(88px + env(safe-area-inset-bottom)); width: min(280px, calc(100% - var(--dn-space-6))); } }
</style>
