<script>
  import { onMount, tick } from 'svelte';
  import manifest from './manifest.json';
  import { initializeTemplate } from './template.js';

  const pages = import.meta.glob('./pages/*.svelte');
  const requested = window.location.pathname.split('/').filter(Boolean).pop() || 'index.html';
  const route = manifest[requested] ? requested : '404.html';
  let Page = $state(null);
  let error = $state('');

  onMount(() => {
    let disposed = false;
    const loadPage = async () => {
      const module = await pages[`./pages/${route.replace('.html', '.svelte')}`]();
      if (disposed) return;
      document.body.className = manifest[route].bodyClass || '';
      Page = module.default;
      document.title = manifest[route].title;
      await tick();
      await initializeTemplate(manifest[route].scripts);
    };
    loadPage().catch((cause) => { error = 'Unable to load this page. Please refresh.'; console.error(cause); });
    return () => { disposed = true; };
  });
</script>

{#if Page}<Page />{/if}
{#if error}<p role="alert">{error}</p>{/if}
