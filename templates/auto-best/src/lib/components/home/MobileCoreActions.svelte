<script lang="ts">
  import { getI18n } from '$lib/locale/context';
  const i18n = getI18n();

  import { resolve } from '$app/paths';
  import FeatureArtwork from '$components/ui/FeatureArtwork.svelte';
  import { homeActionArtwork } from '$data/feature-artwork';

  const actions = [
    {
      title: 'home.action.cars.title',
      href: '/listing-grid',
      tone: 'blue',
      artwork: homeActionArtwork.collection
    },
    {
      title: 'home.action.sell.title',
      href: '/contact?topic=trade-in',
      tone: 'red',
      artwork: homeActionArtwork.sell
    },
    {
      title: 'home.action.import.title',
      href: '/contact?topic=import',
      tone: 'ice',
      artwork: homeActionArtwork.import
    },
    {
      title: 'home.action.finance.title',
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
        <span class="dn-mobile-core-card__copy">
          <strong>{i18n.t(action.title)}</strong>
        </span>
        <span class="dn-mobile-core-card__art" aria-hidden="true"><FeatureArtwork artwork={action.artwork} eager /></span>
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
      gap: var(--dn-space-2);
      padding-bottom: var(--dn-space-2);
      min-width: 0;
      width: 100%;
      min-height: 112px;
      aspect-ratio: 3 / 2;
      overflow: hidden;
      border-radius: var(--dn-radius);
      color: #fff;
      isolation: isolate;
    }

    .dn-mobile-core-card--blue { background: var(--dn-theme-action-blue-start); }
    .dn-mobile-core-card--red { background: var(--dn-theme-action-red-start); }
    .dn-mobile-core-card--ice { background: var(--dn-theme-action-ice-start); color: var(--dn-theme-action-ice-ink); }
    .dn-mobile-core-card--dark { background: var(--dn-theme-hero-surface); }

    .dn-mobile-core-card__copy {
      position: relative;
      z-index: 3;
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      padding: var(--dn-space-3) var(--dn-space-3) 0;
    }

    .dn-mobile-core-card strong {
      max-width: 100%;
      font-size: var(--dn-text-card);
      font-weight: var(--dn-weight-semibold);
      line-height: var(--dn-leading-heading);
      letter-spacing: var(--dn-tracking-heading);
      overflow-wrap: anywhere;
    }


    .dn-mobile-core-card__art {
      position: relative;
      z-index: 1;
      margin: auto var(--dn-space-2) 0;
      height: 58px;
      flex: 0 0 58px;
      display: flex;
      align-items: flex-end;
      pointer-events: none;
    }

    .dn-mobile-core-card__art :global(.feature-artwork) {
      max-width: calc(58px * var(--artwork-ratio));
      margin-inline: auto;
    }
    .dn-mobile-core-card:focus-visible { outline: 3px solid var(--dn-focus); outline-offset: 3px; }
  }

</style>
