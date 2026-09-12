<script lang="ts">
  import { resolve } from '$app/paths';
  import { page } from '$app/state';
  import { brand } from '$config/brand';

  const isNotFound = $derived(page.status === 404);
</script>

<svelte:head>
  <title>{isNotFound ? 'Page not found' : 'An error occurred'} — {brand.name}</title>
  <meta name="robots" content="noindex" />
</svelte:head>

<section class="dn-error" aria-labelledby="error-title">
  <div class="container">
    <p class="dn-kicker">{page.status}</p>
    <h1 id="error-title">{isNotFound ? 'Page not found' : 'An unexpected error occurred'}</h1>
    <p>
      {isNotFound
        ? 'The address may have changed or the page may no longer be part of the site.'
        : 'Try again or contact the team for assistance.'}
    </p>
    <div class="dn-error__actions">
      <a class="dn-error__primary" href={resolve('/listing-grid')}>Browse vehicles</a>
      <a class="dn-error__secondary" href={resolve('/contact')}>Contact us</a>
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
    font-size: clamp(32px, 5vw, 48px);
    font-weight: 650;
    line-height: 1.08;
    letter-spacing: -.035em;
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
    font-size: var(--dn-text-body);
    font-weight: 650;
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
