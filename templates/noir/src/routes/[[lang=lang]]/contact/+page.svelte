<script lang="ts">
  import { site } from "#lib/config/site.ts";
  import { currentLocale, t } from "#lib/i18n/index.ts";
  import EnquiryForm from "#lib/components/EnquiryForm.svelte";

  const locale = $derived(currentLocale());
  const m = $derived(t());
</script>

<svelte:head>
  <title>{m.contact.title} · {site.name}</title>
  <meta name="description" content={m.contact.lead} />
</svelte:head>

<section class="container page">
  <header class="intro">
    <p class="label">{site.name}</p>
    <h1 class="display">{m.contact.title}</h1>
    <p class="muted">{m.contact.lead}</p>
  </header>

  <div class="layout">
    <dl class="details">
      <div>
        <dt class="label">{m.contact.phone}</dt>
        <dd>
          <a class="display big" href={`tel:${site.phone}`}
            >{site.phoneDisplay}</a
          >
        </dd>
      </div>
      <div>
        <dt class="label">{m.contact.address}</dt>
        <dd>
          <a href={site.mapsUrl} target="_blank" rel="noopener"
            >{site.address[locale]}</a
          >
          <a
            class="text-link directions"
            href={site.mapsUrl}
            target="_blank"
            rel="noopener"
          >
            {m.home.directions}<span class="arrow" aria-hidden="true"></span>
          </a>
        </dd>
      </div>
      {#if site.email}
        <div>
          <dt class="label">{m.form.email}</dt>
          <dd><a href={`mailto:${site.email}`}>{site.email}</a></dd>
        </div>
      {/if}
      <div>
        <dt class="label">{m.contact.listings}</dt>
        <dd>
          <a href={site.listingsUrl} target="_blank" rel="noopener"
            >{new URL(site.listingsUrl).host}</a
          >
        </dd>
      </div>
    </dl>

    <div class="form-panel">
      <EnquiryForm />
    </div>
  </div>
</section>

<style>
  .page {
    padding-top: calc(var(--header) + clamp(3rem, 8vw, 6rem));
    padding-bottom: var(--section);
  }

  .intro h1 {
    margin-block: 1rem;
    font-size: var(--step-4);
  }

  .layout {
    display: grid;
    grid-template-columns: 1fr 1.3fr;
    gap: clamp(2.5rem, 6vw, 6rem);
    margin-top: clamp(3rem, 7vw, 5rem);
    padding-top: clamp(2rem, 4vw, 3rem);
    border-top: 1px solid var(--line);
  }

  .details {
    display: grid;
    align-content: start;
    gap: 2.5rem;
  }

  dd {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 0.75rem;
    margin-top: 0.75rem;
    font-size: var(--step-1);
  }

  .big {
    font-size: var(--step-3);
  }

  .directions {
    color: var(--muted);
  }

  .directions:hover {
    color: var(--text);
  }

  .form-panel {
    padding: clamp(1.5rem, 4vw, 3.5rem);
    background: var(--surface);
    border-radius: var(--radius);
  }

  @media (max-width: 64rem) {
    .layout {
      grid-template-columns: 1fr;
    }
  }
</style>
