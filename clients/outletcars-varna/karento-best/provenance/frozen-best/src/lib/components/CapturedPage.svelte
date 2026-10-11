<script lang="ts">
  import { onMount } from 'svelte';
  import type { CapturedPageData } from '../page-types';
  let { page }: { page: CapturedPageData } = $props();

  onMount(() => {
    for (const [name, value] of Object.entries(page.bodyAttributes)) {
      document.body.setAttribute(name, value);
    }
    // Use document navigations so the reference plugins start fresh on every page.
    void (async () => {
      for (const source of page.scripts) {
        const script = document.createElement('script');
        if (source.type) script.type = source.type;
        if (source.src) {
          script.src = source.src;
          await new Promise<void>((resolve, reject) => {
            script.onload = () => resolve();
            script.onerror = () => reject(new Error(`Unable to load ${source.src}`));
            document.body.appendChild(script);
          });
        } else {
          script.textContent = source.code || '';
          document.body.appendChild(script);
        }
      }
      document.body.dataset.karentoReady = 'true';
      window.dispatchEvent(new Event('load'));
    })().catch((error) => console.error('Carento initialization failed', error));
  });
</script>

<svelte:head>
  <title>{page.title}</title>
  {@html page.head}
</svelte:head>

{@html page.body}
