<script lang="ts">
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
      <p>We select vehicles based on your criteria, arrange a vehicle viewing in {brand.city} and discuss imports, trade-ins or buying options directly with the team.</p>
      <a class="dn-about-intro__action" href={resolve('/listing-grid')}>
        View vehicles <Icon name="arrow-right" size={18} />
      </a>
    </div>

    <div class="dn-about-services">
      {#each companyServices as service (service.index)}
        <article class="dn-about-service-card">
          <div class="dn-about-service-card__icon" aria-hidden="true">
            <AboutServiceIcon name={service.icon} />
          </div>
          <div>
            <h3>{service.title}</h3>
            <p>{service.description}</p>
          </div>
          <a href={resolve(service.href as '/contact')}>
            <span>{service.cta}</span>
            <Icon name="arrow-right" size={17} strokeWidth={1.8} />
          </a>
        </article>
      {/each}
    </div>

  </div>
</section>
