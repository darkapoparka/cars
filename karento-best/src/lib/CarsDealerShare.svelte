<script lang="ts">
  import { page } from '$app/state';
  import { useLocale } from './i18n/context.svelte.ts';
  const locale = useLocale();
  const identity = {"name":"Square One Motors","publicOrigin":"https://cars-uk-birmingham-square-one-motors.darkapoparka1.workers.dev","description":"Independent design preview for discussion, not an official dealership website. Forms do not send messages or create reservations."};
  const directory = "https://cars-uk-birmingham-square-one-motors.darkapoparka1.workers.dev/dealer-share/1e4faf0520e5b61ffd9f";
  const canonical = $derived.by(() => {
    const url = new URL(identity.publicOrigin + page.url.pathname);
    url.searchParams.set('lang', locale.locale);
    const id = page.url.searchParams.get('id');
    if (/\/vehicle\/?$/.test(page.url.pathname) && id) url.searchParams.set('id', id);
    return url.href;
  });
</script>

<svelte:head>
  <link rel="canonical" href={canonical} />
  <link rel="icon" type="image/png" sizes="32x32" href={directory + '/icon-32.png'} />
  <link rel="shortcut icon" href={directory + '/favicon.ico'} />
  <link rel="apple-touch-icon" sizes="180x180" href={directory + '/icon-180.png'} />
  <meta property="og:type" content="website" />
  <meta property="og:site_name" content={identity.name} />
  <meta property="og:title" content={identity.name} />
  <meta property="og:description" content={identity.description} />
  <meta property="og:url" content={canonical} />
  <meta property="og:image" content={directory + '/social.png'} />
  <meta property="og:image:secure_url" content={directory + '/social.png'} />
  <meta property="og:image:type" content="image/png" />
  <meta property="og:image:width" content="1200" />
  <meta property="og:image:height" content="630" />
  <meta property="og:image:alt" content={locale.t('metadata.websitePreview', { dealer: identity.name })} />
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content={identity.name} />
  <meta name="twitter:description" content={identity.description} />
  <meta name="twitter:image" content={directory + '/social.png'} />
  <meta name="twitter:image:alt" content={locale.t('metadata.websitePreview', { dealer: identity.name })} />
</svelte:head>
