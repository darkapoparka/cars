<script lang="ts">
  import { resolve } from '$app/paths';
  import { page } from '$app/state';
  import { brand } from '$config/brand';

  const isNotFound = $derived(page.status === 404);
</script>

<svelte:head>
  <title>{isNotFound ? 'Страницата не е намерена' : 'Възникна грешка'} — {brand.name}</title>
  <meta name="robots" content="noindex" />
</svelte:head>

<section class="dn-error" aria-labelledby="error-title">
  <div class="container">
    <p class="dn-kicker">{page.status}</p>
    <h1 id="error-title">{isNotFound ? 'Страницата не е намерена' : 'Възникна неочаквана грешка'}</h1>
    <p>
      {isNotFound
        ? 'Адресът може да е променен или страницата вече да не е част от сайта.'
        : 'Опитайте отново или се свържете с екипа за съдействие.'}
    </p>
    <div class="dn-error__actions">
      <a class="dn-error__primary" href={resolve('/listing-grid')}>Разгледайте автомобилите</a>
      <a class="dn-error__secondary" href={resolve('/contact')}>Свържете се с нас</a>
    </div>
  </div>
</section>

<style>
  .dn-error {
    display: grid;
    min-height: 520px;
    place-items: center;
    padding: 96px 0;
    background: #eef0f2;
    color: var(--dn-ink);
    text-align: center;
  }

  .dn-error > .container {
    width: min(720px, calc(100% - 48px));
  }

  .dn-error h1 {
    margin: 0;
    font-size: var(--dn-text-fluid-hero);
    font-weight: var(--dn-weight-semibold);
    line-height: var(--dn-leading-section);
    letter-spacing: var(--dn-tracking-heading);
  }

  .dn-error p:not(.dn-kicker) {
    max-width: 56ch;
    margin: 18px auto 0;
    color: var(--dn-muted);
    font-size: var(--dn-text-lead);
    line-height: var(--dn-leading-lead);
  }

  .dn-error__actions {
    display: flex;
    justify-content: center;
    gap: 12px;
    margin-top: 30px;
  }

  .dn-error__actions a {
    min-height: 50px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    padding: 0 22px;
    border: 1px solid var(--dn-ink);
    border-radius: var(--dn-radius-button);
    font-size: var(--dn-control-size);
    font-weight: var(--dn-control-weight);
  }

  .dn-error__actions .dn-error__primary {
    background: var(--dn-red);
    border-color: var(--dn-red);
    color: #fff;
  }

  .dn-error__actions .dn-error__primary:hover,
  .dn-error__actions .dn-error__primary:focus-visible {
    background: var(--dn-red-hover);
    border-color: var(--dn-red-hover);
  }

  .dn-error__secondary {
    background: #fff;
    color: var(--dn-ink);
  }

  .dn-error__secondary:hover,
  .dn-error__secondary:focus-visible {
    background: var(--dn-ink);
    color: #fff;
  }

  @media (max-width: 560px) {
    .dn-error {
      min-height: 440px;
      padding: 72px 0;
    }

    .dn-error__actions {
      flex-direction: column;
    }
  }
</style>
