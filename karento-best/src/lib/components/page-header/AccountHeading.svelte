<svelte:options preserveWhitespace={true} runes={true} />

<script lang="ts">
  import HeaderBreadcrumbs from "./HeaderBreadcrumbs.svelte";
  import {
    accountBreadcrumbs,
    type BreadcrumbContent,
  } from "#lib/data/page-headers.ts";
  import { useLocale } from "#lib/i18n/context.svelte.ts";
  import type { CatalogText } from "#lib/i18n/text.ts";
  import { MediaQuery } from "svelte/reactivity";
  const desktop = new MediaQuery("(min-width: 992px)");
  const locale = useLocale();
  let {
    title,
    breadcrumbs,
  }: { title: CatalogText; breadcrumbs?: BreadcrumbContent } = $props();
  let trail = $derived(breadcrumbs ?? accountBreadcrumbs(title));
</script>

<section
  class="box-section background-body pt-80 karento-desktop-account-heading"
  ><div class="container"
    ><div class="text-center"
      ><HeaderBreadcrumbs breadcrumbs={trail} />{#if desktop.current}<h1
          class="mt-3 neutral-1000 desktop-type-page">{locale.text(title)}</h1
        >{:else}<h3 class="mt-3 neutral-1000 desktop-type-page"
          >{locale.text(title)}</h3
        >{/if}</div
    ></div
  ></section
>
