<svelte:options runes={true} />

<script lang="ts">
  import { useLocale } from "#lib/i18n/context.svelte.ts";
  const locale = useLocale();
  import ResponsiveCollection from "#lib/components/ResponsiveCollection.svelte";
  import {
    referenceTestimonials,
    type Testimonial,
  } from "#lib/data/home-stories.ts";

  let { items = referenceTestimonials }: { items?: readonly Testimonial[] } =
    $props();
</script>

<section
  class="mobile-testimonials"
  aria-label={locale.t("referenceHome.testimonials.label")}
>
  <div class="container">
    <header>
      <div class="box-author-testimonials background-100">
        <img src="/assets/imgs/page/homepage1/testimonial.png" alt="" />
        <img src="/assets/imgs/page/homepage1/testimonial2.png" alt="" />
        <img src="/assets/imgs/page/homepage1/testimonial3.png" alt="" />
        {locale.t("referenceHome.testimonials.label")}
      </div>
      <h3>{locale.t("ui.mobile-testimonial-rail.what-they-say-about-us")}</h3>
    </header>
    <ResponsiveCollection
      class="testimonial-rail"
      mobileLayout="rail"
      label={locale.t("ui.mobile-testimonial-rail.customer-testimonials")}
    >
      {#each items as item (item.id)}
        <article class="mobile-testimonial-card">
          <h4>{locale.text(item.title)}</h4>
          <p class="testimonial-quote">{locale.text(item.quote)}</p>
          <footer>
            <img
              src={item.avatar}
              alt=""
              width="40"
              height="40"
              loading="lazy"
              decoding="async"
            />
            <div class="testimonial-author">
              <strong>{item.author}</strong>
              <small>{item.location}</small>
            </div>
            <span
              class="testimonial-rating"
              role="img"
              aria-label={locale.t("referenceHome.testimonials.stars", {
                rating: locale.number(item.rating),
              })}>{"★".repeat(item.rating)}</span
            >
          </footer>
        </article>
      {/each}
    </ResponsiveCollection>
  </div>
</section>

<style>
  .mobile-testimonials {
    padding-block: var(--karento-space-6);
  }
  header {
    display: grid;
    justify-items: center;
    gap: var(--karento-space-2);
    margin-bottom: var(--karento-space-2);
  }
  header h3 {
    margin: 0;
    text-align: center;
  }
  .mobile-testimonial-card {
    display: flex;
    flex-direction: column;
    gap: var(--karento-space-3);
    padding: var(--karento-space-4);
    border: 1px solid var(--bs-neutral-200);
    border-radius: var(--karento-radius-card);
    background: var(--bs-background-card);
  }
  h4 {
    margin: 0;
  }
  .testimonial-quote {
    margin: 0;
    color: var(--bs-neutral-600);
  }
  footer {
    display: grid;
    grid-template-columns: auto minmax(0, 1fr);
    align-items: center;
    gap: var(--karento-space-2);
    margin-top: auto;
  }
  footer img {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    object-fit: cover;
  }
  .testimonial-author {
    display: grid;
    min-width: 0;
    gap: var(--karento-space-1);
  }
  .testimonial-author small {
    color: var(--bs-neutral-600);
  }
  .testimonial-rating {
    grid-column: 1 / -1;
    letter-spacing: 0.15em;
    line-height: 1;
  }

  @media (min-width: 768px) {
    header h3 {
      font-size: var(--karento-text-section);
      line-height: 1.3;
    }
    h4 {
      font-size: var(--karento-text-card-title);
      line-height: 1.35;
    }
    .testimonial-quote {
      font-size: var(--karento-text-body);
      line-height: 1.5;
    }
    .testimonial-author strong {
      font-size: var(--karento-text-body);
      line-height: 1.3;
    }
    .testimonial-author small {
      font-size: 0.75rem;
      line-height: 1.3;
    }
    .testimonial-rating {
      font-size: 0.875rem;
    }
  }

  @media (max-width: 767.98px) {
    .box-author-testimonials {
      font-size: var(--karento-type-eyebrow-size);
      font-weight: var(--karento-type-eyebrow-weight);
      line-height: var(--karento-type-eyebrow-leading);
    }
    header h3 {
      font-size: var(--karento-type-section-size);
      font-weight: var(--karento-type-section-weight);
      line-height: var(--karento-type-section-leading);
    }
    h4 {
      font-size: var(--karento-type-card-size);
      font-weight: var(--karento-type-card-weight);
      line-height: var(--karento-type-card-leading);
    }
    .testimonial-quote {
      font-size: var(--karento-type-body-size);
      font-weight: var(--karento-type-body-weight);
      line-height: var(--karento-type-body-leading);
    }
    .testimonial-author strong {
      font-size: var(--karento-type-body-size);
      font-weight: var(--karento-type-label-weight);
      line-height: var(--karento-type-body-leading);
    }
    .testimonial-author small {
      font-size: var(--karento-type-meta-size);
      font-weight: var(--karento-type-meta-weight);
      line-height: var(--karento-type-meta-leading);
    }
    .testimonial-rating {
      font-size: var(--karento-type-body-size);
    }
  }
</style>
