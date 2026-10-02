<script lang="ts">
  import { getI18n } from '$lib/locale/context';

  const i18n = getI18n();

  import { resolve } from '$app/paths';
  import Icon from '$components/ui/Icon.svelte';
  import AboutServiceIcon from './AboutServiceIcon.svelte';
  import { brand } from '$config/brand';
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
        <article class="dn-about-service-card">
          <div class="dn-about-service-card__icon" aria-hidden="true">
            <AboutServiceIcon name={service.icon} />
          </div>
          <div class="dn-about-service-card__copy">
            <h3>{i18n.text(service.title)}</h3>
            <p>{i18n.text(service.description)}</p>
          </div>
          <a href={i18n.href(resolve(service.href as '/contact'))}>
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

  @media (min-width: 992px) {
    .dn-about-process__name { display: none; }
    .dn-about-process__logo { display: flex; justify-content: center; }
    .dn-about-process__logo img { display: block; width: min(220px, 100%); height: 58px; object-fit: contain; }
  }
</style>
