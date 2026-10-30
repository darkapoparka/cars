<script lang="ts">
  import { site } from "#lib/config/site.ts";
  import { currentLocale, paths, t } from "#lib/i18n/index.ts";
  import Wordmark from "./Wordmark.svelte";

  const locale = $derived(currentLocale());
  const m = $derived(t());
  const year = new Date().getFullYear();
</script>

<footer class="footer">
  <div class="container">
    <div class="top">
      <a class="mark" href={paths.home(locale)} aria-label={site.name}>
        <Wordmark size="clamp(1.25rem, 4.2vw, 3.75rem)" />
      </a>
    </div>
    <div class="grid">
      <div>
        <p class="label">{m.contact.address}</p>
        <a href={site.mapsUrl} target="_blank" rel="noopener"
          >{site.address[locale]}</a
        >
      </div>
      <div>
        <p class="label">{m.contact.phone}</p>
        <a href={`tel:${site.phone}`}>{site.phoneDisplay}</a>
        {#if site.email}<a href={`mailto:${site.email}`}>{site.email}</a>{/if}
      </div>
      <nav aria-label="Footer">
        <p class="label">{site.name}</p>
        <a href={paths.collection(locale)}>{m.nav.collection}</a>
        <a href={`${paths.home(locale)}#services`}>{m.nav.services}</a>
        <a href={paths.contact(locale)}>{m.nav.contact}</a>
      </nav>
    </div>
    <div class="legal">
      <p>© {year} {site.name}. {m.footer.rights}</p>
      {#if site.demo}<p>{m.footer.demo}</p>{/if}
    </div>
  </div>
</footer>

<style>
  .footer {
    padding-block: clamp(3.5rem, 8vw, 6rem) 2rem;
    border-top: 1px solid var(--line);
  }

  .top {
    padding-bottom: clamp(2.5rem, 6vw, 4.5rem);
  }

  .mark {
    display: inline-block;
  }

  .grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 2.5rem;
    padding-block: 2.5rem;
    border-block: 1px solid var(--line);
  }

  .grid > * {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 0.5rem;
  }

  .grid .label {
    margin-bottom: 0.5rem;
  }

  .grid a {
    color: var(--text);
    opacity: 0.85;
    transition: opacity var(--fast) ease;
  }

  .grid a:hover {
    opacity: 1;
  }

  .legal {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    gap: 0.5rem 2rem;
    padding-top: 1.5rem;
    color: var(--faint);
    font-size: 0.8125rem;
  }

  @media (max-width: 48rem) {
    .grid {
      grid-template-columns: 1fr;
      gap: 2rem;
    }
  }
</style>
