<script lang="ts">
  import { page } from '$app/state';
  const identity = {"name":"Trade Car Sales","publicOrigin":"https://cars-uk-birmingham-trade-car-sales-grasmere.darkapoparka1.workers.dev","description":"Independent design preview for discussion, not an official dealership website. Forms do not send messages or create reservations."};
  const directory = "https://cars-uk-birmingham-trade-car-sales-grasmere.darkapoparka1.workers.dev/dealer-share/39618e6d8195943daa8e";
  const canonical = $derived(identity.publicOrigin + page.url.pathname);
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
  <meta property="og:image:alt" content={identity.name + ' dealer website preview'} />
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content={identity.name} />
  <meta name="twitter:description" content={identity.description} />
  <meta name="twitter:image" content={directory + '/social.png'} />
  <meta name="twitter:image:alt" content={identity.name + ' dealer website preview'} />
</svelte:head>
