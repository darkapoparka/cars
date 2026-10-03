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
      <span class="dn-mobile-services__cta">
        {i18n.t('home.services.action')} <MobileActionIcon name="arrow" size={18} />
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
      padding: var(--dn-space-2) var(--dn-space-3);
      background: var(--dn-mobile-canvas);
    }

    .dn-mobile-services__card {
      display: grid;
      grid-template-columns: repeat(2, minmax(0, 1fr));
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
      gap: var(--dn-space-2);
      padding: var(--dn-space-5) 0 var(--dn-space-5) var(--dn-space-3);
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
      font-size: var(--dn-text-caption);
      line-height: var(--dn-leading-meta);
    }

    .dn-mobile-services__cta {
      display: inline-flex;
      align-items: center;
      gap: var(--dn-space-1);
      padding-top: var(--dn-space-1);
      font-size: var(--dn-text-caption);
      font-weight: var(--dn-weight-semibold);
      line-height: var(--dn-leading-meta);
    }

    .dn-mobile-services__art {
      min-width: 0;
      padding: var(--dn-space-6) var(--dn-space-2);
      pointer-events: none;
    }

    .dn-mobile-services__card:focus-visible {
      outline: 3px solid var(--dn-focus);
      outline-offset: 3px;
    }
  }
</style>
