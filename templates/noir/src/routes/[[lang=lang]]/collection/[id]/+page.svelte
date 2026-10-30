<script lang="ts">
  import { asset } from "$app/paths";
  import { site } from "#lib/config/site.ts";
  import {
    attr,
    formatHp,
    formatKm,
    formatPrice,
    vehicles,
  } from "#lib/data/vehicles.ts";
  import { currentLocale, paths, t } from "#lib/i18n/index.ts";
  import { reveal } from "#lib/reveal.ts";
  import EnquiryForm from "#lib/components/EnquiryForm.svelte";
  import VehicleCard from "#lib/components/VehicleCard.svelte";

  let { data } = $props();

  const locale = $derived(currentLocale());
  const m = $derived(t());
  const v = $derived(data.vehicle);
  const name = $derived(`${v.make} ${v.model}`);

  const specs = $derived([
    [m.vehicle.year, v.year ? String(v.year) : "—"],
    [m.vehicle.mileage, formatKm(v.mileageKm, locale)],
    [m.vehicle.power, formatHp(v.powerHp, locale)],
    [m.vehicle.fuel, attr(v.fuel, locale)],
    [m.vehicle.transmission, attr(v.transmission, locale)],
    [m.vehicle.body, attr(v.body, locale)],
    [m.vehicle.color, attr(v.color, locale)],
  ]);

  const similar = $derived(
    vehicles
      .filter((o) => o.id !== v.id && (o.make === v.make || o.body === v.body))
      .slice(0, 3),
  );
</script>

<svelte:head>
  <title>{name} · {site.name}</title>
  <meta
    name="description"
    content="{name}, {v.year}, {formatKm(v.mileageKm, locale)}"
  />
</svelte:head>

<article class="container page">
  <a class="text-link back" href={paths.collection(locale)}>
    <span class="arrow back-arrow" aria-hidden="true"></span>{m.vehicle.back}
  </a>

  <div class="top">
    <div class="stage">
      <img
        src={asset(v.image)}
        alt={name}
        width="280"
        height="210"
        fetchpriority="high"
      />
      <span class="status label"
        >{v.incoming ? m.vehicle.incoming : m.vehicle.available}</span
      >
    </div>

    <aside class="summary">
      <p class="label">{v.make}</p>
      <h1 class="display">{v.model}</h1>
      <ul class="quick">
        <li>{v.year ?? "—"}</li>
        <li>{formatKm(v.mileageKm, locale)}</li>
        <li>{formatHp(v.powerHp, locale)}</li>
      </ul>
      <p class="price display">{formatPrice(v.priceEur, locale)}</p>
      <div class="actions">
        <a class="button button--solid" href="#enquire">
          {m.vehicle.enquire}<span class="arrow" aria-hidden="true"></span>
        </a>
        <a class="button" href={`tel:${site.phone}`}
          >{m.vehicle.call} {site.phoneDisplay}</a
        >
      </div>
    </aside>
  </div>

  <section class="details">
    <div>
      <h2 class="label">{m.vehicle.specification}</h2>
      <dl class="spec">
        {#each specs as [label, value] (label)}
          <div>
            <dt>{label}</dt>
            <dd>{value}</dd>
          </div>
        {/each}
      </dl>
    </div>
    {#if v.features.length}
      <div>
        <h2 class="label">{m.vehicle.features}</h2>
        <ul class="features">
          {#each v.features as feature (feature)}<li>{feature}</li>{/each}
        </ul>
      </div>
    {/if}
  </section>

  <section class="enquire" id="enquire" {@attach reveal}>
    <div>
      <p class="label">{name}</p>
      <h2 class="display">{m.vehicle.enquire}</h2>
    </div>
    <EnquiryForm car={name} />
  </section>

  {#if similar.length}
    <section class="similar" {@attach reveal}>
      <header class="section-head">
        <span class="index">—</span>
        <h2 class="display">{m.vehicle.similar}</h2>
        <a class="text-link" href={paths.collection(locale)}>
          {m.home.viewAll}<span class="arrow" aria-hidden="true"></span>
        </a>
      </header>
      <ul class="grid">
        {#each similar as vehicle (vehicle.id)}
          <li><VehicleCard {vehicle} /></li>
        {/each}
      </ul>
    </section>
  {/if}
</article>

<style>
  .page {
    padding-top: calc(var(--header) + 2rem);
    padding-bottom: var(--section);
  }

  .back {
    color: var(--muted);
    transition: color var(--fast) ease;
  }

  .back:hover {
    color: var(--text);
  }

  .back-arrow {
    transform: scaleX(-1);
  }

  .top {
    display: grid;
    grid-template-columns: 1.6fr 1fr;
    gap: clamp(2rem, 5vw, 5rem);
    margin-top: 2rem;
    align-items: stretch;
  }

  .stage {
    position: relative;
    display: grid;
    place-items: center;
    aspect-ratio: 16 / 11;
    padding: clamp(1.5rem, 5vw, 4rem);
    background: var(--stage);
    border-radius: var(--radius);
    overflow: hidden;
  }

  /* Export photos are small, so they are shown framed on the stage rather than stretched. */
  .stage img {
    width: min(88%, 44rem);
    height: auto;
    aspect-ratio: 4 / 3;
    object-fit: cover;
    border-radius: var(--radius);
    box-shadow: 0 2.5rem 4rem -2rem rgb(0 0 0 / 0.6);
  }

  .status {
    position: absolute;
    top: 1.25rem;
    left: 1.25rem;
  }

  .summary {
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
    padding-bottom: 0.5rem;
  }

  .summary h1 {
    margin-top: 0.75rem;
    font-size: var(--step-4);
  }

  .quick {
    display: flex;
    flex-wrap: wrap;
    margin-top: 1.5rem;
    color: var(--muted);
  }

  .quick li + li::before {
    content: "";
    display: inline-block;
    width: 1px;
    height: 0.75em;
    margin-inline: 0.875rem;
    background: var(--line-strong);
  }

  .price {
    margin-top: 2rem;
    padding-top: 1.5rem;
    border-top: 1px solid var(--line);
    font-size: var(--step-3);
  }

  .actions {
    display: grid;
    gap: 0.75rem;
    margin-top: 2rem;
  }

  .details {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: clamp(2rem, 5vw, 5rem);
    padding-block: var(--section);
  }

  .spec,
  .features {
    margin-top: 1.5rem;
    border-top: 1px solid var(--line);
  }

  .spec div {
    display: flex;
    justify-content: space-between;
    gap: 1rem;
    padding-block: 1rem;
    border-bottom: 1px solid var(--line);
  }

  .spec dt {
    color: var(--muted);
  }

  .spec dd {
    text-align: right;
  }

  .features {
    columns: 2;
    column-gap: 2rem;
    padding-top: 1rem;
  }

  .features li {
    break-inside: avoid;
    padding-block: 0.5rem;
    font-size: 0.9375rem;
  }

  .enquire {
    display: grid;
    grid-template-columns: 1fr 1.3fr;
    gap: clamp(2rem, 5vw, 5rem);
    padding: clamp(2rem, 5vw, 4.5rem);
    background: var(--surface);
    border-radius: var(--radius);
  }

  .enquire h2 {
    margin-top: 1rem;
    font-size: var(--step-3);
  }

  .similar {
    padding-top: var(--section);
  }

  .grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: clamp(1.25rem, 2.5vw, 2.5rem);
  }

  @media (max-width: 64rem) {
    .top,
    .details,
    .enquire {
      grid-template-columns: 1fr;
    }

    .grid {
      grid-template-columns: repeat(2, 1fr);
    }
  }

  @media (max-width: 40rem) {
    .stage {
      aspect-ratio: 4 / 3;
      padding: 1rem;
    }

    .features {
      columns: 1;
    }

    .grid {
      grid-template-columns: 1fr;
    }
  }
</style>
