<script lang="ts">
  import { resolve } from '$app/paths';
  import { getI18n } from '$lib/locale/context';
  import FeatureArtwork from '$components/ui/FeatureArtwork.svelte';
  import MobileActionIcon from '$components/layout/MobileActionIcon.svelte';
  import { homeServicesArtwork } from '$data/feature-artwork';

  const i18n = getI18n();
</script>

<section class="dn-mobile-services" aria-labelledby="home-services-title">
  <a class="dn-mobile-services__card" href={`${i18n.href(resolve('/about-us'))}#process`}>
    <span class="dn-mobile-services__copy">
      <strong id="home-services-title">{i18n.t('home.services.title')}</strong>
      <small>{i18n.t('home.services.detail')}</small>
      <span class="dn-mobile-services__cta dn-compact-control dn-quick-pill">
        <span class="dn-mobile-services__cta-full">{i18n.t('home.services.action')}</span>
        <span class="dn-mobile-services__cta-short">{i18n.t('home.services.actionShort')}</span>
        <MobileActionIcon name="arrow" size={15} />
      </span>
    </span>
    <span class="dn-mobile-services__art" aria-hidden="true">
      <FeatureArtwork artwork={homeServicesArtwork} />
    </span>
  </a>
</section>

<style>
  .dn-mobile-services { display: none; }

  @media (max-width: 767px) {
    .dn-mobile-services {
      display: block;
      container: services-overview / inline-size;
      padding: var(--dn-space-2) var(--dn-space-3);
      background: var(--dn-mobile-canvas);
    }

    .dn-mobile-services__card {
      display: grid;
      grid-template-columns: minmax(0, 1fr) auto;
      align-items: center;
      min-height: var(--dn-discovery-tile-height);
      border: 1px solid var(--dn-line);
      border-radius: var(--dn-radius);
      background: var(--dn-mobile-surface);
      box-shadow: var(--dn-card-shadow-subtle);
      color: var(--dn-ink);
      text-decoration: none;
    }

    .dn-mobile-services__copy {
      display: flex;
      min-width: 0;
      flex-direction: column;
      align-items: flex-start;
      gap: var(--dn-space-1);
      padding: var(--dn-space-4) 0 var(--dn-space-4) var(--dn-space-3);
      overflow-wrap: anywhere;
    }

    .dn-mobile-services__copy strong {
      font-size: var(--dn-text-lead);
      font-weight: var(--dn-weight-semibold);
      line-height: var(--dn-leading-heading);
      letter-spacing: var(--dn-tracking-heading);
    }

    .dn-mobile-services__copy small {
      color: var(--dn-muted);
      font-size: var(--dn-text-meta);
      line-height: var(--dn-leading-meta);
      text-wrap: balance;
    }

    .dn-mobile-services__card .dn-mobile-services__cta {
      --dn-compact-control-surface: var(--dn-ink);
      --dn-compact-control-ink: var(--dn-white);
      --dn-compact-control-padding-inline: calc(var(--dn-space-1) + var(--dn-space-half));
      --dn-compact-control-inset: calc(var(--dn-space-1) + var(--dn-space-half));
      --dn-entry-action-height: var(--dn-control-height-compact);
      --dn-entry-action-gap: var(--dn-space-1);
      --dn-compact-control-font: var(--dn-weight-medium) var(--dn-text-meta) / var(--dn-leading-control) var(--dn-font);
      max-width: 100%;
      margin-top: var(--dn-space-1);
      white-space: normal;
      text-align: left;
    }

    .dn-mobile-services__cta > span {
      min-width: 0;
    }

    .dn-mobile-services__cta-short {
      display: none;
    }

    .dn-mobile-services__card:is(:hover, :focus-visible) .dn-mobile-services__cta {
      --dn-compact-control-surface: var(--dn-line-on-ink);
    }

    .dn-mobile-services__art {
      box-sizing: content-box;
      width: 8rem;
      padding: var(--dn-space-4) var(--dn-space-2) var(--dn-space-4) 0;
      pointer-events: none;
    }

    .dn-mobile-services__card:focus-visible {
      outline: 3px solid var(--dn-focus);
      outline-offset: 3px;
    }

    @container services-overview (max-width: 20rem) {
      .dn-mobile-services__copy strong {
        font-size: var(--dn-text-body);
      }

      .dn-mobile-services__copy small {
        font-size: var(--dn-text-caption);
      }

      .dn-mobile-services__cta-full {
        display: none;
      }

      .dn-mobile-services__cta-short {
        display: inline;
      }

      .dn-mobile-services__art {
        padding-right: var(--dn-space-1);
      }
    }

    /* Reflow enlarged text without stacking at ordinary narrow phone widths. */
    @container services-overview (max-width: 14rem) {
      .dn-mobile-services__card {
        grid-template-columns: minmax(0, 1fr);
      }

      .dn-mobile-services__copy {
        padding-right: var(--dn-space-3);
      }

      .dn-mobile-services__art {
        justify-self: center;
        max-width: calc(100% - 2 * var(--dn-space-3));
        padding: 0 0 var(--dn-space-4);
      }
    }
  }
</style>
