<script lang="ts">
  import { getI18n } from '$lib/locale/context';

  const i18n = getI18n();

  import Icon from '$components/ui/Icon.svelte';
  import AboutServiceIcon from './AboutServiceIcon.svelte';
  import { brand } from '$config/brand';
  import { leadSite } from '$config/lead-site';
  import { companyServices } from '$data/company';
</script>

<section class="dn-about-process dn-section" id="process" aria-labelledby="about-process-title">
  <div class="container dn-about-process__panel">
    <div class="dn-about-section-heading">
      <h2 id="about-process-title">
        <span class="dn-about-process__name">{brand.name}</span>
        <picture class="dn-about-process__logo">
          <source media="(min-width: 992px)" srcset={brand.logo} />
          <img src="data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs=" alt={brand.name} width="220" height="58" loading="lazy" decoding="async" />
        </picture>
      </h2>
      <p>{i18n.t("m_335a481bffd9", { p0: i18n.dealer('city') })}</p>
    </div>

    <div class="dn-about-services">
      {#each companyServices as service (service.index)}
        <article class="dn-about-service-card dn-about-service-card--illustrated">
          <picture class="dn-about-service-card__art" class:dn-about-service-card__art--showroom={service.icon === 'inspection'} aria-hidden="true">
            <source media="(min-width: 992px)" srcset={leadSite.artwork.desktopServiceCards[service.icon]} />
            <img src="data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs=" alt="" width="800" height="533" loading="lazy" decoding="async" />
          </picture>
          <div class="dn-about-service-card__icon" aria-hidden="true">
            <AboutServiceIcon name={service.icon} />
          </div>
          <div class="dn-about-service-card__copy">
            <h3>{i18n.text(service.title)}</h3>
            <p>{i18n.text(service.description)}</p>
          </div>
          <a href={i18n.href(service.href)}>
            <span>{i18n.text(service.cta)}</span>
            <Icon name="arrow-right" size={17} strokeWidth={1.8} />
          </a>
        </article>
      {/each}
    </div>

  </div>
</section>

<style>
  .dn-about-process__logo { display: none; }
  .dn-about-service-card__art { display: none; }

  @media (min-width: 992px) {
    .dn-about-process__name { display: none; }
    .dn-about-process__logo { display: flex; justify-content: center; }
    .dn-about-process__logo img { display: block; width: min(220px, 100%); height: 58px; object-fit: contain; }
    .dn-about-process .dn-about-services { grid-template-columns: repeat(auto-fit, minmax(min(100%, 14rem), 1fr)); }

    .dn-about-process .dn-about-service-card--illustrated {
      min-height: 0;
      padding: 0;
      border: 1px solid var(--dn-line);
      background: var(--dn-surface-raised);
      box-shadow: var(--dn-card-shadow);
    }

    .dn-about-process .dn-about-service-card__icon { display: none; }

    .dn-about-service-card__art {
      display: block;
      height: 176px;
      margin: var(--dn-space-2) var(--dn-space-2) 0;
    }

    .dn-about-service-card__art img {
      display: block;
      width: 100%;
      height: 100%;
      object-fit: contain;
    }

    .dn-about-service-card__art--showroom img { transform: scale(.92); }

    .dn-about-service-card--illustrated .dn-about-service-card__copy {
      padding: var(--dn-space-4) var(--dn-space-5) 0;
    }

    .dn-about-process .dn-about-service-card--illustrated p {
      margin: var(--dn-space-2) 0 var(--dn-space-5);
    }

    .dn-about-process .dn-about-service-card--illustrated > a {
      max-width: calc(100% - 2 * var(--dn-space-5));
      margin: auto var(--dn-space-5) var(--dn-space-5);
      padding: var(--dn-space-2) var(--dn-space-4);
    }
  }

  @media (min-width: 992px) and (max-width: 1199px) {
    .dn-about-process .dn-about-services { grid-template-columns: repeat(2, minmax(0, 1fr)); }
  }
</style>
