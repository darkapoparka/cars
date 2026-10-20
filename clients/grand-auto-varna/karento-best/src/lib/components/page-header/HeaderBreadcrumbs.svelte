<svelte:options preserveWhitespace={true} runes={true} />

<script lang="ts">
  import type { BreadcrumbContent } from "#lib/data/page-headers.ts";
  import { useLocale } from "#lib/i18n/context.svelte.ts";
  const locale = useLocale();
  let { breadcrumbs }: { breadcrumbs: BreadcrumbContent } = $props();
  import { MediaQuery } from "svelte/reactivity";
  const desktop = new MediaQuery("(min-width: 992px)");
</script>

<div class={[breadcrumbs.className, "header-breadcrumbs"]}
  >{#each breadcrumbs.items as item, position (item.id)}{#if position > 0}<span
        class={item.separatorClass}
        ><img
          src="/assets/imgs/template/icons/arrow-right.svg"
          alt=""
          aria-hidden="true"
        /></span
      >{" "}{/if}{#if desktop.current && position === breadcrumbs.items.length - 1}<span
        class={[item.className, "desktop-type-body-small"]}
        aria-current="page">{locale.text(item.label)}</span
      >{:else}<a
        href={locale.href(item.href)}
        class={[item.className, "desktop-type-body-small"]}
        aria-label={locale.text(item.accessibleLabel ?? item.label)}
        >{locale.text(item.label)}</a
      >{/if}{" "}{/each}</div
>

<style>
  @media (min-width: 992px) {
    .header-breadcrumbs.rounded-12 {
      border-radius: var(--karento-desktop-pill-radius) !important;
    }
  }

  @media (max-width: 767.98px) {
    .header-breadcrumbs {
      width: max-content;
      max-width: calc(100% - var(--karento-space-8));
      overflow-x: auto;
      overscroll-behavior-x: contain;
      scrollbar-width: none;
    }
    .header-breadcrumbs::-webkit-scrollbar {
      display: none;
    }
    .header-breadcrumbs > :is(a, span) {
      flex: 0 0 auto;
      white-space: nowrap;
    }
  }
</style>
