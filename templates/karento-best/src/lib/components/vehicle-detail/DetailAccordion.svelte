<svelte:options preserveWhitespace={true} runes={true} />

<script lang="ts">
  import type { Snippet } from "svelte";
  import { usePreview } from "#lib/preview.svelte.ts";
  import { MediaQuery } from "svelte/reactivity";
  let {
    id,
    title,
    stateKey,
    stateValue,
    children,
    mobileOpen = true,
  }: {
    id: string;
    title: string;
    stateKey?: string;
    stateValue?: string;
    children: Snippet;
    mobileOpen?: boolean;
  } = $props();
  const preview = usePreview();
  const phone = new MediaQuery("(max-width: 767.98px)", false);
  let panelKey = $derived(stateKey ?? "#" + id);
  let panelValue = $derived(stateValue ?? "#" + id);
  let open = $derived(
    preview.panels[panelKey] === undefined
      ? !phone.current || mobileOpen
      : preview.panels[panelKey] === panelValue,
  );
</script>

<div class="group-collapse-expand karento-detail-accordion">
  <button
    type="button"
    data-bs-toggle="collapse"
    data-bs-target={"#" + id}
    aria-controls={id}
    aria-label={title}
    class={["btn btn-collapse", { collapsed: !open }]}
    aria-expanded={open}
    onclick={() => (preview.panels[panelKey] = open ? null : panelValue)}
  >
    <h6 class="desktop-type-panel">{title}</h6>
    <svg
      width="12"
      height="7"
      viewBox="0 0 12 7"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      focusable="false"
      ><path
        d="M1 1L6 6L11 1"
        stroke=""
        stroke-width="1.5"
        stroke-linecap="round"
        stroke-linejoin="round"
      ></path></svg
    >
  </button>
  <div {id} class={["collapse", { show: open }]}>{@render children()}</div>
</div>

<style>
  @media (max-width: 767.98px) {
    .group-collapse-expand {
      padding: var(--karento-space-2) var(--karento-space-4);
      margin-bottom: var(--karento-space-3);
      border-radius: var(--karento-radius-card);
    }

    .group-collapse-expand .btn-collapse {
      justify-content: space-between;
      gap: var(--karento-space-3);
      min-height: var(--karento-touch-target);
      padding: var(--karento-space-2) 0;
      white-space: normal;
      text-align: left;
    }

    .group-collapse-expand .btn-collapse[aria-expanded="false"] svg {
      transform: rotate(0deg);
    }

    .group-collapse-expand .btn-collapse[aria-expanded="true"] svg {
      transform: rotate(180deg);
    }

    .group-collapse-expand .collapse.show {
      padding-block: var(--karento-space-2);
    }

    .group-collapse-expand :global(.card.card-body) {
      margin: 0;
    }

    .group-collapse-expand :global(.card.card-body > p) {
      font-size: var(--karento-type-body-size);
      font-weight: var(--karento-type-body-weight);
      line-height: var(--karento-type-body-leading);
    }

    .group-collapse-expand :global(.card.card-body > p:last-child) {
      margin-bottom: 0;
    }

    h6 {
      min-width: 0;
      margin: 0;
      font-size: var(--karento-type-panel-size);
      font-weight: var(--karento-type-panel-weight);
      line-height: var(--karento-type-panel-leading);
    }
    svg {
      flex: 0 0 auto;
    }
  }

  @media (min-width: 992px) {
    .karento-detail-accordion {
      padding: 0;
      margin-bottom: var(--karento-desktop-panel-gap);
      border-radius: var(--karento-desktop-card-radius);
    }
    .karento-detail-accordion > .btn-collapse {
      align-items: center;
      gap: var(--karento-desktop-card-gap);
      min-height: var(--karento-desktop-control-height);
      padding: var(--karento-desktop-space-4) var(--karento-desktop-space-5);
      white-space: normal;
      text-align: left;
    }
    .karento-detail-accordion > .btn-collapse h6 {
      margin: 0;
    }
    .karento-detail-accordion > .btn-collapse svg {
      flex-shrink: 0;
    }
    .karento-detail-accordion > .collapse {
      padding: 0 var(--karento-desktop-panel-padding)
        var(--karento-desktop-panel-padding);
    }
  }
</style>
