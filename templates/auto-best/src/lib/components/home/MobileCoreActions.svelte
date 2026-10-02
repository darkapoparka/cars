<script lang="ts">
  import { getI18n } from '$lib/locale/context';
  const i18n = getI18n();

  import { resolve } from '$app/paths';
  import FeatureArtwork from '$components/ui/FeatureArtwork.svelte';
  import { homeActionArtwork } from '$data/feature-artwork';
  import { listingVehicles } from '$data/listing';
  import { template } from '$config/template';

  const actions = [
    {
      title: 'home.action.cars.title',
      detail: 'home.action.cars.detail',
      href: '/listing-grid',
      tone: 'blue',
      artwork: homeActionArtwork.collection
    },
    {
      title: 'home.action.sell.title',
      detail: 'home.action.sell.detail',
      href: '/contact?topic=trade-in',
      tone: 'red',
      artwork: homeActionArtwork.sell
    },
    {
      title: 'home.action.import.title',
      detail: 'home.action.import.detail',
      href: '/contact?topic=import',
      tone: 'ice',
      artwork: homeActionArtwork.import
    },
    {
      title: 'home.action.finance.title',
      detail: 'home.action.finance.detail',
      href: '/contact?topic=leasing',
      tone: 'dark',
      artwork: homeActionArtwork.finance
    }
  ] as const;
</script>

<section class="dn-mobile-core-actions" aria-label={i18n.t("m_23b41588e19b")}>
  <div class="dn-mobile-core-actions__grid">
    {#each actions as action (action.href)}
      <a class={`dn-mobile-core-card dn-mobile-core-card--${action.tone}`} href={i18n.href(resolve(action.href))}>
        <span class="dn-mobile-core-card__art" aria-hidden="true"><FeatureArtwork artwork={action.artwork} eager /></span>
        <span class="dn-mobile-core-card__copy">
          <strong>{i18n.t(action.title)}</strong>
          <small>{action.tone === 'blue' ? i18n.t(template.verifiedInventory ? 'home.action.cars.availableCount' : 'home.action.cars.previewCount', { count: listingVehicles.length }) : i18n.t(action.detail)}</small>
        </span>
      </a>
    {/each}
  </div>
</section>

<style>
  .dn-mobile-core-actions { display: none; }

  @media (max-width: 767px) {
    .dn-mobile-core-actions {
      display: block;
      padding: var(--dn-space-3) var(--dn-space-3) var(--dn-space-1);
      background: var(--dn-mobile-canvas);
    }
    .dn-mobile-core-actions__grid {
      display: grid;
      /* Enlarged text can reflow to one column without shrinking the type. */
      grid-template-columns: repeat(auto-fit, minmax(min(100%, max(8rem, 45%)), 1fr));
      gap: var(--dn-space-4);
    }

    .dn-mobile-core-card {
      position: relative;
      display: flex;
      flex-direction: column;
      gap: var(--dn-space-1);
      padding: var(--dn-space-2);
      min-width: 0;
      width: 100%;
      min-height: 148px;
      overflow: hidden;
      border: 1px solid var(--dn-line);
      border-radius: var(--dn-radius);
      background: var(--dn-mobile-surface);
      color: var(--dn-ink);
      box-shadow: var(--dn-card-shadow-subtle);
      isolation: isolate;
    }

    .dn-mobile-core-card--blue .dn-mobile-core-card__art { background: color-mix(in srgb, var(--dn-theme-action-blue-start) 6%, var(--dn-surface-subtle)); }
    .dn-mobile-core-card--red .dn-mobile-core-card__art { background: var(--dn-surface-subtle); }
    .dn-mobile-core-card--ice .dn-mobile-core-card__art { background: color-mix(in srgb, var(--dn-theme-action-ice-start) 50%, var(--dn-surface-subtle)); }

    .dn-mobile-core-card__copy {
      position: relative;
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      gap: var(--dn-space-half);
      padding: var(--dn-space-1);
    }

    .dn-mobile-core-card strong {
      max-width: 100%;
      font-size: var(--dn-text-lead);
      font-weight: var(--dn-weight-medium);
      line-height: var(--dn-leading-heading);
      letter-spacing: var(--dn-tracking-heading);
      overflow-wrap: anywhere;
    }
    .dn-mobile-core-card small {
      max-width: 100%;
      color: var(--dn-muted);
      font-size: var(--dn-text-meta);
      font-weight: var(--dn-weight-regular);
      line-height: var(--dn-leading-meta);
      overflow-wrap: anywhere;
    }

    .dn-mobile-core-card__art {
      position: relative;
      height: 88px;
      flex: 0 0 88px;
      display: flex;
      align-items: center;
      padding: 0;
      border-radius: var(--dn-space-2);
      background: var(--dn-surface-subtle);
      pointer-events: none;
    }

    .dn-mobile-core-card__art :global(.feature-artwork) {
      max-width: min(100%, calc(80px * var(--artwork-ratio)));
      margin-inline: auto;
    }
    .dn-mobile-core-card:focus-visible { outline: 3px solid var(--dn-focus); outline-offset: 3px; }
  }

</style>
