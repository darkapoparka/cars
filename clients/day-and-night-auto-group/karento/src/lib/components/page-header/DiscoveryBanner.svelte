<svelte:options preserveWhitespace={true} runes={true} />

<script lang="ts">
  import HeroBackdrop from "./HeroBackdrop.svelte";
  import HeaderBreadcrumbs from "./HeaderBreadcrumbs.svelte";
  import type { DiscoveryBannerContent } from "#lib/data/page-headers.ts";
  import { MediaQuery } from "svelte/reactivity";
  import type { Snippet } from "svelte";
  import { useLocale } from "#lib/i18n/context.svelte.ts";
  const locale = useLocale();
  const phone = new MediaQuery("(max-width: 767.98px)");
  const desktop = new MediaQuery("(min-width: 992px)");
  let {
    header,
    mobileControls,
    desktopPrimary = false,
  }: {
    header: DiscoveryBannerContent;
    mobileControls?: Snippet;
    desktopPrimary?: boolean;
  } = $props();
</script>

{#snippet titleContent()}
  {#if phone.current && header.mobileTitle}{locale.text(
      header.mobileTitle,
    )}{:else}{locale.text(
      header.titleLines[0],
    )}{#if header.titleLines.length === 2}<br />&#32;{locale.text(
        header.titleLines[1],
      )}{/if}{/if}
{/snippet}

<div class="page-header-2 pt-30 background-body"
  ><div class="custom-container position-relative mx-auto"
    ><HeroBackdrop image={header.image} /><div
      class="container position-absolute z-1 top-50 start-50 pb-70 translate-middle text-center"
      ><span class="text-sm-bold bg-2 px-4 py-3 rounded-12 desktop-type-eyebrow"
        >{locale.text(header.label)}</span
      >&#32;{#if desktop.current && desktopPrimary}<h1
          class="text-white mt-4 desktop-type-hero">{@render titleContent()}</h1
        >{:else}<h2 class="text-white mt-4 desktop-type-hero"
          >{@render titleContent()}</h2
        >{/if}<span class="text-white text-lg-medium desktop-type-lead"
        >{locale.text(
          phone.current
            ? (header.mobileDescription ?? header.description)
            : header.description,
        )}</span
      ></div
    >{#if phone.current && mobileControls}<div
        class="karento-mobile-hero-controls"
      >
        {@render mobileControls()}
      </div>{:else}<HeaderBreadcrumbs
        breadcrumbs={header.breadcrumbs}
      />{/if}</div
  ></div
>

<style>
  @media (min-width: 992px) {
    .page-header-2 {
      width: 100%;
      max-width: 960px;
      margin-inline: auto;
      padding-inline: var(--karento-desktop-space-3);
    }
    .page-header-2 .custom-container {
      max-width: none;
      padding-inline: 0;
      height: var(--karento-desktop-hero-height);
      min-height: var(--karento-desktop-hero-height);
    }
  }
  @media (min-width: 1200px) {
    .page-header-2 {
      max-width: 1140px;
    }
  }
  @media (min-width: 1400px) {
    .page-header-2 {
      max-width: 1248px;
    }
  }
</style>
