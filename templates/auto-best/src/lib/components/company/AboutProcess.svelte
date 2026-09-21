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
  <div class="container">
    <div class="dn-about-section-heading">
      <h2 id="about-process-title">{brand.name}</h2>
      <p>{i18n.t("m_335a481bffd9", { p0: i18n.dealer('city') })}</p>
      <a class="dn-about-intro__action" href={i18n.href(resolve('/listing-grid'))}>
        {i18n.t("m_9304497d3f4b")} <Icon name="arrow-right" size={18} />
      </a>
    </div>

    <div class="dn-about-services">
      {#each companyServices as service (service.index)}
        <article class="dn-about-service-card">
          <div class="dn-about-service-card__icon" aria-hidden="true">
            <AboutServiceIcon name={service.icon} />
          </div>
          <div>
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
