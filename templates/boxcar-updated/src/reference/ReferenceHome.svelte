<script lang="ts">
  import type { Component } from "svelte";
  let { home }: { home: number } = $props();
  const pages = import.meta.glob<{ default: Component }>("./Home*.svelte");
  let Page = $state<Component>();
  let stylesLoaded = $state(0);
  const styleLoaded = () => {
    stylesLoaded += 1;
  };
  $effect(() => {
    let active = true;
    Page = undefined;
    void pages[`./Home${home}.svelte`]().then((module) => {
      if (active) Page = module.default;
    });
    return () => {
      active = false;
    };
  });
</script>

<svelte:head>
  <link
    rel="stylesheet"
    href="/reference/css/bootstrap.min.css"
    onload={styleLoaded}
  />
  <link
    rel="stylesheet"
    href="/reference/css/slick-theme.css"
    onload={styleLoaded}
  />
  <link rel="stylesheet" href="/reference/css/slick.css" onload={styleLoaded} />
  <link rel="stylesheet" href="/reference/css/mmenu.css" onload={styleLoaded} />
  <link rel="stylesheet" href="/reference/css/style.css" onload={styleLoaded} />
  <link rel="stylesheet" href="/reference/native.css" onload={styleLoaded} />
</svelte:head>
{#if Page && stylesLoaded >= 6}<Page />{/if}
