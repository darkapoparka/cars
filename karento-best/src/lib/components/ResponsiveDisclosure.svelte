<script lang="ts">
  import type { Snippet } from "svelte";
  import { MediaQuery } from "svelte/reactivity";
  import MobileIcon from "./mobile/MobileIcon.svelte";

  let {
    title,
    heading,
    children,
    class: className = "",
  }: {
    title: string;
    heading?: Snippet;
    children: Snippet;
    class?: string;
  } = $props();
  // This query changes disclosure behavior, rather than choosing layout markup.
  const wide = new MediaQuery("(min-width: 768px)", true);
</script>

<details class={[className, "responsive-disclosure"]} open={wide.current}>
  <summary tabindex={wide.current ? -1 : undefined}>
    {#if heading}{@render heading()}{:else}<span class="disclosure-title"
        >{wide.current ? "" : title}</span
      >{/if}
    <span class="disclosure-icon"><MobileIcon name="chevron-down" /></span>
  </summary>
  {@render children()}
</details>

<style>
  summary {
    list-style: none;
  }
  summary::-webkit-details-marker {
    display: none;
  }
  .disclosure-icon {
    display: none;
  }

  @media (min-width: 768px) {
    details,
    summary {
      display: contents;
    }
    summary {
      pointer-events: none;
    }
    .disclosure-title {
      display: none;
    }
  }

  @media (max-width: 767.98px) {
    .responsive-disclosure {
      border-bottom: 1px solid
        var(--karento-disclosure-border, var(--bs-border-color));
    }
    summary {
      display: flex;
      align-items: center;
      justify-content: space-between;
      min-height: var(--karento-touch-target);
      gap: var(--karento-space-3);
      padding-block: var(--karento-space-3);
      cursor: pointer;
    }
    .disclosure-icon {
      display: flex;
      color: inherit;
    }
    details[open] .disclosure-icon {
      transform: rotate(180deg);
    }
    summary:focus-visible {
      outline: 2px solid var(--karento-accent);
      outline-offset: 2px;
    }
  }
</style>
