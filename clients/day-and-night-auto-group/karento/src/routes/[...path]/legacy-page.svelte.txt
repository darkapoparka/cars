<script lang="ts">
  import { onMount } from 'svelte';
  let { data } = $props();
  const page = $derived(data.page as {
    title: string;
    head: string;
    body: string;
    bodyAttributes: Record<string, string>;
    scripts: { src?: string; code?: string; type?: string }[];
  });

  onMount(() => {
    for (const [name, value] of Object.entries(page.bodyAttributes)) {
      document.body.setAttribute(name, value);
    }
    // Preserve the vendor's classic-script order and use document navigations
    // so jQuery/Swiper plugins always start with a fresh document.
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
