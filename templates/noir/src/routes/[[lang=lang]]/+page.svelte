<script lang="ts">
  import { asset } from "$app/paths";
  import { site } from "#lib/config/site.ts";
  import { latest, makes, vehicles } from "#lib/data/vehicles.ts";
  import { currentLocale, paths, t } from "#lib/i18n/index.ts";
  import { reveal } from "#lib/reveal.ts";
  import VehicleCard from "#lib/components/VehicleCard.svelte";

  const locale = $derived(currentLocale());
  const m = $derived(t());
  const incoming = vehicles.filter((v) => v.incoming).length;
  const arrivals = latest(6);
</script>

<svelte:head>
  <title>{site.name} · {m.home.title.join(" ")}</title>
  <meta name="description" content={m.home.lead} />
</svelte:head>

<section class="hero">
  <img
    class="hero-image"
    src={asset("media/hero-coupe.webp")}
    alt=""
    width="2095"
    height="751"
    fetchpriority="high"
  />
  <div class="hero-scrim" aria-hidden="true"></div>
  <div class="container hero-inner">
    <p class="label hero-eyebrow">{m.home.eyebrow}</p>
    <h1 class="display hero-title">
      {#each m.home.title as line, i (line)}
        <span class="line" style:--i={i}>{line}</span>
      {/each}
    </h1>
    <p class="hero-lead">{m.home.lead}</p>
    <div class="hero-actions">
      <a class="button button--solid" href={paths.collection(locale)}>
        {m.home.explore}<span class="arrow" aria-hidden="true"></span>
      </a>
      <a class="button button--light" href={paths.contact(locale)}
        >{m.nav.book}</a
      >
    </div>
  </div>
  <div class="container">
    <dl class="hero-stats">
      <div>
        <dt class="label">{m.home.stats.stock}</dt>
        <dd class="display">{vehicles.length}</dd>
      </div>
      <div>
        <dt class="label">{m.home.stats.makes}</dt>
        <dd class="display">{makes.length}</dd>
      </div>
      <div>
        <dt class="label">{m.home.stats.incoming}</dt>
        <dd class="display">{incoming}</dd>
      </div>
    </dl>
  </div>
</section>

<section class="marques" aria-label={m.home.marques}>
  <div class="track">
    {#each [0, 1] as copy (copy)}
      <ul aria-hidden={copy === 1 ? "true" : undefined}>
        {#each makes as make (make)}
          <li class="display">{make}</li>
        {/each}
      </ul>
    {/each}
  </div>
</section>

<section class="section container" id="collection" {@attach reveal}>
  <header class="section-head">
    <span class="index">{m.home.latestIndex}</span>
    <div>
      <h2 class="display">{m.home.latestTitle}</h2>
      <p>{m.home.latestLead}</p>
    </div>
    <a class="text-link" href={paths.collection(locale)}>
      {m.home.viewAll} ({vehicles.length})<span class="arrow" aria-hidden="true"
      ></span>
    </a>
  </header>
  <ul class="grid">
    {#each arrivals as vehicle (vehicle.id)}
      <li><VehicleCard {vehicle} /></li>
    {/each}
  </ul>
</section>

<section class="statement" {@attach reveal}>
  <div class="container">
    <p class="display">{m.home.statement}</p>
  </div>
  <img
    src={asset("media/collection-lineup.webp")}
    alt=""
    width="1200"
    height="500"
    loading="lazy"
  />
</section>

<section class="section container" id="services" {@attach reveal}>
  <header class="section-head">
    <span class="index">{m.home.servicesIndex}</span>
    <h2 class="display">{m.home.servicesTitle}</h2>
  </header>
  <div class="services">
    <ol class="service-list">
      {#each m.home.services as service, i (service.title)}
        <li>
          <span class="num">0{i + 1}</span>
          <h3 class="display">{service.title}</h3>
          <p class="muted">{service.text}</p>
        </li>
      {/each}
    </ol>
    <figure class="services-media">
      <img
        src={asset("media/studio-suv.webp")}
        alt=""
        width="1672"
        height="941"
        loading="lazy"
      />
    </figure>
  </div>
</section>

<section class="sell" id="sell" {@attach reveal}>
  <div class="container">
    <header class="section-head">
      <span class="index">{m.home.sellIndex}</span>
      <div>
        <h2 class="display">{m.home.sellTitle}</h2>
        <p>{m.home.sellLead}</p>
      </div>
      <a class="text-link" href={paths.contact(locale)}>
        {m.nav.contact}<span class="arrow" aria-hidden="true"></span>
      </a>
    </header>
    <ol class="steps">
      {#each m.home.sellSteps as step, i (step.title)}
        <li>
          <span class="step-num display">{i + 1}</span>
          <h3>{step.title}</h3>
          <p class="muted">{step.text}</p>
        </li>
      {/each}
    </ol>
  </div>
</section>

<section class="section container faq" {@attach reveal}>
  <header class="section-head">
    <span class="index">{m.home.faqIndex}</span>
    <h2 class="display">{m.home.faqTitle}</h2>
  </header>
  <div class="faq-list">
    {#each m.home.faq as item (item.q)}
      <details>
        <summary>
          <span>{item.q}</span>
          <span class="plus" aria-hidden="true"></span>
        </summary>
        <p class="muted">{item.a}</p>
      </details>
    {/each}
  </div>
</section>

<section class="visit" {@attach reveal}>
  <div class="container visit-inner">
    <div>
      <p class="label">{m.contact.address}</p>
      <h2 class="display">{m.home.visitTitle}</h2>
      <p class="muted">{m.home.visitLead}</p>
    </div>
    <div class="visit-details">
      <a href={site.mapsUrl} target="_blank" rel="noopener"
        >{site.address[locale]}</a
      >
      <a class="phone display" href={`tel:${site.phone}`}>{site.phoneDisplay}</a
      >
      <div class="visit-actions">
        <a class="button button--solid" href={paths.contact(locale)}>
          {m.nav.book}<span class="arrow" aria-hidden="true"></span>
        </a>
        <a class="button" href={site.mapsUrl} target="_blank" rel="noopener"
          >{m.home.directions}</a
        >
      </div>
    </div>
  </div>
</section>

<style>
  /* ---- Hero ---- */

  .hero {
    position: relative;
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
    min-height: max(40rem, 100svh);
    padding-top: var(--header);
    background: #0b0b0b;
    color: #f4f3ef;
    overflow: hidden;
    isolation: isolate;
  }

  .hero-image {
    position: absolute;
    inset: 0;
    z-index: -2;
    width: 100%;
    height: 100%;
    object-fit: cover;
    object-position: 85% 40%;
    animation: settle 2.4s var(--ease) both;
  }

  .hero-scrim {
    position: absolute;
    inset: 0;
    z-index: -1;
    background:
      var(--scrim),
      linear-gradient(0deg, rgb(11 11 11 / 0.9) 0%, rgb(11 11 11 / 0) 40%);
  }

  .hero-inner {
    padding-bottom: clamp(2.5rem, 6vh, 4.5rem);
  }

  .hero-eyebrow {
    color: rgb(244 243 239 / 0.7);
  }

  .hero-title {
    margin-top: 1.5rem;
    font-size: var(--step-4);
    max-width: 14ch;
  }

  .line {
    display: block;
    animation: rise 1.4s var(--ease) both;
    animation-delay: calc(200ms + var(--i) * 140ms);
  }

  .line:last-child {
    color: rgb(244 243 239 / 0.55);
  }

  .hero-lead {
    margin-top: 1.75rem;
    max-width: 32rem;
    font-size: var(--step-1);
    font-weight: 300;
    color: rgb(244 243 239 / 0.78);
  }

  .hero-actions {
    display: flex;
    flex-wrap: wrap;
    gap: 0.75rem;
    margin-top: 2.5rem;
  }

  .hero .button--solid {
    --invert-bg: #f4f3ef;
    --invert-text: #0b0b0b;
  }

  .hero-stats {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    border-top: 1px solid rgb(255 255 255 / 0.16);
  }

  .hero-stats > div {
    padding: 1.5rem 1.5rem 2rem 0;
  }

  .hero-stats > div + div {
    padding-left: 1.5rem;
    border-left: 1px solid rgb(255 255 255 / 0.16);
  }

  .hero-stats dt {
    color: rgb(244 243 239 / 0.6);
  }

  .hero-stats dd {
    margin-top: 0.5rem;
    font-size: var(--step-3);
  }

  @keyframes settle {
    from {
      transform: scale(1.08);
      opacity: 0;
    }
  }

  @keyframes rise {
    from {
      transform: translateY(0.6em);
      opacity: 0;
    }
  }

  /* ---- Marques ---- */

  .marques {
    overflow: hidden;
    padding-block: 2rem;
    border-bottom: 1px solid var(--line);
    mask-image: linear-gradient(
      90deg,
      transparent,
      #000 10%,
      #000 90%,
      transparent
    );
  }

  .track {
    display: flex;
    width: max-content;
    animation: marquee 40s linear infinite;
  }

  .marques:hover .track {
    animation-play-state: paused;
  }

  .track ul {
    display: flex;
    gap: 4rem;
    padding-right: 4rem;
  }

  .track li {
    font-size: var(--step-2);
    color: var(--faint);
    letter-spacing: 0.04em;
    text-transform: uppercase;
    white-space: nowrap;
  }

  @keyframes marquee {
    to {
      transform: translateX(-50%);
    }
  }

  /* ---- Sections ---- */

  .section {
    padding-block: var(--section);
  }

  .grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: clamp(2.5rem, 4vw, 3.5rem) clamp(1.25rem, 2.5vw, 2.5rem);
  }

  .statement {
    padding-top: var(--section);
    background: #0b0b0b;
    color: #f4f3ef;
    text-align: center;
  }

  .statement p {
    max-width: 24ch;
    margin-inline: auto;
    font-size: var(--step-3);
  }

  .statement img {
    width: min(100%, 75rem);
    margin: clamp(1rem, 3vw, 2.5rem) auto 0;
    mask-image: radial-gradient(70% 80% at 50% 45%, #000 55%, transparent 100%);
  }

  .services {
    display: grid;
    grid-template-columns: 1.1fr 1fr;
    gap: clamp(2rem, 5vw, 5rem);
    align-items: start;
  }

  .service-list li {
    display: grid;
    grid-template-columns: 3rem 1fr;
    gap: 0.5rem 1rem;
    padding-block: 1.75rem;
    border-bottom: 1px solid var(--line);
  }

  .service-list li:first-child {
    padding-top: 0;
  }

  .num {
    grid-row: span 2;
    font-family: var(--font-display);
    font-size: var(--step--1);
    color: var(--accent);
    padding-top: 0.375rem;
  }

  .service-list h3 {
    font-size: var(--step-2);
  }

  .services-media {
    position: sticky;
    top: calc(var(--header) + 2rem);
    aspect-ratio: 5 / 4;
    overflow: hidden;
    border-radius: var(--radius);
    background: #0b0b0b;
  }

  .services-media img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    object-position: 78% center;
  }

  .sell {
    padding-block: var(--section);
    background: var(--surface);
  }

  .steps {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 2rem;
  }

  .steps li {
    padding-top: 1.5rem;
    border-top: 1px solid var(--line-strong);
  }

  .step-num {
    display: block;
    font-size: var(--step-4);
    color: var(--faint);
    line-height: 1;
  }

  .steps h3 {
    margin-top: 1.5rem;
    font-size: var(--step-1);
    font-weight: 500;
  }

  .steps p {
    margin-top: 0.5rem;
  }

  .faq-list {
    max-width: 56rem;
    margin-left: auto;
  }

  details {
    border-bottom: 1px solid var(--line);
  }

  summary {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 1.5rem;
    padding-block: 1.5rem;
    font-size: var(--step-1);
    cursor: pointer;
    list-style: none;
  }

  summary::-webkit-details-marker {
    display: none;
  }

  .plus {
    position: relative;
    flex: none;
    width: 0.875rem;
    height: 0.875rem;
  }

  .plus::before,
  .plus::after {
    content: "";
    position: absolute;
    top: 50%;
    left: 0;
    width: 100%;
    height: 1px;
    background: currentColor;
    transition: transform var(--fast) var(--ease);
  }

  .plus::after {
    transform: rotate(90deg);
  }

  details[open] .plus::after {
    transform: rotate(0deg);
  }

  details p {
    max-width: 40rem;
    padding-bottom: 1.5rem;
  }

  .visit {
    padding-block: var(--section);
    background: var(--invert-bg);
    color: var(--invert-text);
    --muted: color-mix(in srgb, var(--invert-text) 60%, transparent);
    --line-strong: color-mix(in srgb, var(--invert-text) 30%, transparent);
  }

  .visit-inner {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 3rem;
    align-items: end;
  }

  .visit h2 {
    margin-block: 1rem;
    font-size: var(--step-4);
  }

  .visit .label {
    color: var(--muted);
  }

  .visit-details {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }

  .phone {
    font-size: var(--step-3);
  }

  .visit-actions {
    display: flex;
    flex-wrap: wrap;
    gap: 0.75rem;
    margin-top: 1rem;
  }

  .visit .button--solid {
    --invert-bg: var(--bg);
    --invert-text: var(--text);
  }

  .visit .button:not(.button--solid):hover {
    border-color: var(--invert-text);
  }

  @media (max-width: 64rem) {
    .grid {
      grid-template-columns: repeat(2, 1fr);
    }

    .services {
      grid-template-columns: 1fr;
    }

    .services-media {
      position: static;
      aspect-ratio: 16 / 10;
      order: -1;
    }
  }

  @media (max-width: 40rem) {
    .hero-image {
      height: 58%;
      object-position: 86% center;
    }

    .hero-scrim {
      background: linear-gradient(
        0deg,
        #0b0b0b 42%,
        rgb(11 11 11 / 0.2) 75%,
        rgb(11 11 11 / 0.5) 100%
      );
    }

    .hero-title {
      font-size: clamp(2rem, 9.5vw, 2.75rem);
    }

    .hero-stats > div {
      padding-right: 0.75rem;
    }

    .hero-stats > div + div {
      padding-left: 0.75rem;
    }

    .grid,
    .steps,
    .visit-inner {
      grid-template-columns: 1fr;
    }

    .hero-actions .button {
      flex: 1 1 100%;
    }
  }
</style>
