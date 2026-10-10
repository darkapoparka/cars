<svelte:options preserveWhitespace={true} runes={true} />

<script lang="ts">
  import { useLocale } from "#lib/i18n/context.svelte.ts";
  const locale = useLocale();
  import type { FaqCardAppearance, FaqItemContent } from "#lib/data/faq.ts";
  let {
    item,
    id,
    parent,
    open,
    collapsed,
    appearance = "bordered",
    onclick,
  }: {
    item: FaqItemContent;
    id: string;
    parent: string;
    open: boolean;
    collapsed: boolean;
    appearance?: FaqCardAppearance;
    onclick: () => void;
  } = $props();
</script>

{#if item.kind === "numbered"}
  <div class="accordion-item border-bottom-0 karento-faq-numbered">
    <div class="accordion-header" id={item.heading}>
      <button
        type="button"
        data-bs-toggle="collapse"
        data-bs-target={"#" + id}
        aria-controls={id}
        class={[
          item.buttonClass ?? "accordion-button text-heading-5",
          { collapsed },
        ]}
        aria-expanded={open}
        {onclick}
      >
        <h3 class="desktop-type-stat-compact">{item.number}</h3>
        <p class="desktop-type-compact-card">{locale.text(item.question)}</p>
      </button>
    </div>
    <div
      {id}
      aria-labelledby={item.heading}
      data-bs-parent={parent}
      class={["accordion-collapse collapse", { show: open }]}
    >
      <div class="accordion-body desktop-type-body"
        >{locale.text(item.answer)}</div
      >
    </div>
  </div>
{:else}
  <div
    class={[
      "karento-faq-card",
      appearance === "rounded"
        ? "mb-2 card border rounded-3"
        : "mb-2 card border",
    ]}
  >
    <div
      class={appearance === "rounded"
        ? "px-0 card-header border-0 bacground-body"
        : "px-0 card-header border-0 bg-gradient-1 background-card"}
    >
      <a
        data-bs-toggle="collapse"
        href={locale.href("#" + id)}
        aria-controls={id}
        class={[
          " px-3 py-2 text-900 fw-bold d-flex align-items-center",
          { collapsed },
        ]}
        aria-expanded={open}
        {onclick}
      >
        <p class="text-lg-bold neutral-1000 pe-4 desktop-type-compact-card"
          >{locale.text(item.question)}{#if item.continuation}<br
            />{locale.text(item.continuation)}{/if}</p
        >
        <span class="ms-auto arrow me-2">
          <svg
            class="invert"
            xmlns="http://www.w3.org/2000/svg"
            width="13"
            height="8"
            viewBox="0 0 13 8"
            fill="none"
            aria-hidden="true"
            focusable="false"
          >
            <path
              class="stroke-dark"
              d="M11.5 1L6.25 6.5L1 1"
              stroke="#111827"
              stroke-width="1.5"
              stroke-linecap="round"
              stroke-linejoin="round"
            ></path>
          </svg>
        </span>
      </a>
    </div>
    <div {id} data-bs-parent={parent} class={["collapse", { show: open }]}>
      <p
        class={appearance === "rounded"
          ? "pt-0 pb-4 card-body desktop-type-body"
          : "pt-0 pb-4 card-body background-body desktop-type-body"}
        >{locale.text(item.answer)}</p
      >
    </div>
  </div>
{/if}

<style>
  @media (max-width: 767.98px) {
    .karento-faq-numbered .accordion-button {
      display: grid;
      grid-template-columns: auto minmax(0, 1fr) var(--karento-space-8);
      align-items: center;
      gap: var(--karento-space-3);
      min-height: var(--karento-touch-target);
      padding: var(--karento-space-3);
      text-align: left;
    }
    .karento-faq-numbered h3 {
      min-width: 0;
      margin: 0;
      padding: 0;
      font-size: var(--karento-type-panel-size);
      font-weight: var(--karento-type-panel-weight);
      line-height: var(--karento-type-panel-leading);
    }
    .karento-faq-numbered .accordion-button p {
      min-width: 0;
      margin: 0;
      font-size: var(--karento-type-body-size);
      font-weight: var(--karento-type-control-weight);
      line-height: var(--karento-type-body-leading);
    }
    .karento-faq-numbered .accordion-button::after {
      position: static;
      width: var(--karento-space-8);
      height: var(--karento-space-8);
      margin: 0;
      background-size: var(--karento-control-icon);
    }
    .karento-faq-numbered .accordion-body {
      margin: 0;
      padding: 0 var(--karento-space-3) var(--karento-space-3);
      font-size: var(--karento-type-body-size);
      font-weight: var(--karento-type-body-weight);
      line-height: var(--karento-type-body-leading);
    }
    .karento-faq-card {
      border-radius: var(--karento-radius-card) !important;
      overflow: hidden;
    }
    .karento-faq-card .card-header {
      padding: 0;
    }
    .karento-faq-card .card-header a {
      gap: var(--karento-space-3);
      min-height: var(--karento-touch-target);
      padding: var(--karento-space-3) !important;
    }
    .karento-faq-card .card-header p {
      min-width: 0;
      margin: 0;
      padding: 0 !important;
      font-size: var(--karento-type-card-size);
      font-weight: var(--karento-type-card-weight) !important;
      line-height: var(--karento-type-card-leading);
      text-wrap: pretty;
    }
    .karento-faq-card .arrow {
      flex: 0 0 auto;
      margin: 0 0 0 auto !important;
    }
    .karento-faq-card .card-header a[aria-expanded="false"] .arrow {
      transform: none;
    }
    .karento-faq-card .card-header a[aria-expanded="true"] .arrow {
      transform: rotate(180deg);
    }
    .karento-faq-card .card-body {
      margin: 0;
      padding: 0 var(--karento-space-3) var(--karento-space-3) !important;
      font-size: var(--karento-type-body-size);
      font-weight: var(--karento-type-body-weight);
      line-height: var(--karento-type-body-leading);
    }
  }
</style>
