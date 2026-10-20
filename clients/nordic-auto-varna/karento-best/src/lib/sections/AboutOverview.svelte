<svelte:options runes={true} />

<script lang="ts">
  import { useLocale } from "#lib/i18n/context.svelte.ts";
  import { dealer } from "#lib/content.ts";
  import {
    referenceAbout,
    aboutBenefitIcons,
    type AboutContent,
  } from "#lib/data/about.ts";
  const locale = useLocale();
  const content: AboutContent = $derived(dealer.about ?? referenceAbout);
</script>

<section
  class="about-overview background-body"
  aria-labelledby="about-introduction"
>
  <div class="container">
    <div class="about-introduction">
      <h2 id="about-introduction" class="desktop-section-title"
        >{locale.text(content.title)}</h2
      >
      <p class="desktop-type-lead">{locale.text(content.description)}</p>
    </div>
    <div class="about-gallery">
      {#each content.portraits as image (image.id)}
        <img
          class="about-portrait"
          src={image.src}
          alt={locale.text(image.alt)}
          loading="lazy"
          decoding="async"
        />
      {/each}
      <div class="about-next-step">
        <div class="about-contact desktop-panel">
          <h3 class="desktop-type-panel"
            >{locale.text(content.contact.title)}</h3
          >
          <p class="desktop-type-body">{locale.text(content.contact.body)}</p>
          <a
            class="about-contact-action desktop-type-control"
            href={locale.href(content.contact.href)}
            >{locale.text(content.contact.label)}
            <span aria-hidden="true">↗</span></a
          >
        </div>
        {#if content.vehicleImage}
          <img
            class="about-vehicle"
            src={content.vehicleImage.src}
            alt={locale.text(content.vehicleImage.alt)}
            loading="lazy"
            decoding="async"
          />
        {/if}
      </div>
    </div>
    <ul class="about-benefits">
      {#each content.benefits as benefit (benefit.id)}
        <li>
          {#if benefit.icon}
            <svg
              class="about-benefit-icon"
              xmlns="http://www.w3.org/2000/svg"
              width="62"
              height="62"
              viewBox="0 0 62 62"
              fill="none"
              aria-hidden="true"
              focusable="false"
            >
              {#each aboutBenefitIcons[benefit.icon] as path (path)}
                <path d={path} fill="currentColor" />
              {/each}
            </svg>
          {/if}
          <h3 class="desktop-type-card">{locale.text(benefit.title)}</h3>
          <p class="desktop-type-body">{locale.text(benefit.body)}</p>
        </li>
      {/each}
    </ul>
    {#if content.proof?.length}
      <section class="about-supplied" aria-labelledby="about-business-facts">
        <h2 id="about-business-facts" class="desktop-section-title"
          >{locale.t("about.polish.proof.title")}</h2
        >
        <dl class="about-proof">
          {#each content.proof as fact (fact.id)}
            <div
              ><dt class="desktop-type-label">{locale.text(fact.label)}</dt><dd
                class="desktop-type-panel">{locale.text(fact.value)}</dd
              ></div
            >
          {/each}
        </dl>
      </section>
    {/if}
    {#if content.team?.length}
      <section class="about-supplied" aria-labelledby="about-team">
        <h2 id="about-team" class="desktop-section-title"
          >{locale.t("about.polish.team.title")}</h2
        >
        <ul class="about-team">
          {#each content.team as member (member.id)}
            <li>
              <img
                src={member.image}
                alt={member.name}
                loading="lazy"
                decoding="async"
              />
              <h3 class="desktop-type-card">{member.name}</h3>
              <p class="desktop-type-body">{locale.text(member.role)}</p>
              {#if member.contactHref}<a
                  class="desktop-type-control"
                  href={locale.href(member.contactHref)}
                  >{locale.t("navigation.contact")}</a
                >{/if}
            </li>
          {/each}
        </ul>
      </section>
    {/if}
  </div>
</section>

<style>
  @media (min-width: 992px) {
    .about-overview {
      padding-top: calc(
        var(--karento-desktop-pill-height) / 2 +
          var(--karento-desktop-hero-content-gap)
      );
      padding-bottom: var(--karento-desktop-section-padding);
    }
    .about-introduction {
      display: grid;
      grid-template-columns: minmax(0, 1fr) minmax(0, 1.8fr);
      gap: var(--karento-desktop-grid-gap);
      align-items: start;
      margin-bottom: var(--karento-desktop-heading-gap);
    }
    h2,
    h3,
    p {
      margin: 0;
    }
    .about-introduction p,
    .about-benefits p {
      color: var(--bs-neutral-500);
    }
    .about-gallery {
      display: grid;
      grid-template-columns: repeat(3, minmax(0, 1fr));
      gap: var(--karento-desktop-grid-gap);
    }
    .about-portrait {
      width: 100%;
      height: 100%;
      object-fit: cover;
      border-radius: var(--karento-desktop-card-radius);
    }
    .about-next-step {
      display: flex;
      flex-direction: column;
      gap: var(--karento-desktop-grid-gap);
    }
    .about-contact {
      display: flex;
      flex-direction: column;
      align-items: start;
      gap: var(--karento-desktop-card-gap);
      color: var(--bs-neutral-0);
      background: var(--bs-neutral-1000);
    }
    .about-contact h3,
    .about-contact p {
      color: inherit;
    }
    .about-contact-action {
      display: inline-flex;
      align-items: center;
      gap: var(--karento-desktop-space-2);
      min-height: var(--karento-desktop-control-height);
      padding-inline: var(--karento-desktop-space-5);
      border-radius: var(--karento-desktop-pill-radius);
      background: var(--bs-neutral-0);
      color: var(--bs-neutral-1000);
      text-decoration: none;
    }
    .about-contact-action:focus-visible {
      outline: 2px solid var(--bs-neutral-0);
      outline-offset: var(--karento-desktop-space-1);
    }
    .about-team a:focus-visible {
      outline: 2px solid currentColor;
      outline-offset: var(--karento-desktop-space-1);
    }
    .about-vehicle {
      width: 100%;
      height: auto;
      border-radius: var(--karento-desktop-card-radius);
    }
    .about-benefits,
    .about-team {
      display: grid;
      grid-template-columns: repeat(4, minmax(0, 1fr));
      gap: var(--karento-desktop-grid-gap);
      padding: 0;
      margin: var(--karento-desktop-section-padding) 0 0;
      list-style: none;
    }
    .about-benefits li {
      display: flex;
      flex-direction: column;
      gap: var(--karento-desktop-card-gap);
      border-top: 1px solid var(--bs-neutral-200);
      padding-top: var(--karento-desktop-space-6);
    }
    .about-benefit-icon {
      flex: none;
      width: var(--karento-desktop-space-12);
      height: var(--karento-desktop-space-12);
      color: var(--bs-neutral-1000);
    }
    .about-supplied {
      margin-top: var(--karento-desktop-section-padding);
    }
    .about-team {
      margin-top: var(--karento-desktop-heading-gap);
    }
    .about-team img {
      width: 100%;
      border-radius: var(--karento-desktop-card-radius);
      margin-bottom: var(--karento-desktop-card-gap);
    }
    .about-proof {
      display: flex;
      flex-wrap: wrap;
      gap: var(--karento-desktop-grid-gap);
      margin-top: var(--karento-desktop-heading-gap);
    }
    .about-proof dd {
      margin: var(--karento-desktop-space-2) 0 0;
    }
  }
</style>
