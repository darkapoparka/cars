<svelte:options preserveWhitespace={true} runes={true} />

<script lang="ts">
  import { useLocale } from "#lib/i18n/context.svelte.ts";
  const locale = useLocale();
  import type { FaqSupportTopic } from "#lib/data/faq.ts";
  import FaqSupportIcon from "./FaqSupportIcon.svelte";
  let {
    topic,
    desktop = false,
  }: { topic: FaqSupportTopic; desktop?: boolean } = $props();
</script>

<div class="col-lg-3 col-sm-6">
  <div class="card-contact">
    <div class="card-image">
      <div class="card-icon background-card border rounded-2 border-dark"
        ><FaqSupportIcon name={topic.icon} /></div
      >
    </div>
    <div class="card-info">
      <div class="card-title">
        <a
          class="title text-lg-bold desktop-type-compact-card"
          href={locale.href(topic.href)}
          aria-label={locale.text(topic.title)}>{locale.text(topic.title)}</a
        >
        <p class="text-xs-medium neutral-500 desktop-type-body-small"
          >{locale.text(topic.description)}</p
        >
      </div>
      <div class="card-method-contact">
        <a
          class={[
            "email text-md-bold desktop-type-control",
            desktop && "desktop-card-action desktop-action-primary",
          ]}
          href={locale.href(topic.href)}
          aria-label={locale.text(topic.actionLabel)}
        >
          {locale.text(topic.actionLabel)}
          <svg
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
            focusable="false"
          >
            <path
              d="M8 15L15 8L8 1M15 8L1 8"
              stroke=""
              stroke-width="1.5"
              stroke-linecap="round"
              stroke-linejoin="round"
            ></path>
          </svg>
        </a>
      </div>
    </div>
  </div>
</div>

<style>
  @media (min-width: 992px) {
    a.desktop-card-action svg path {
      fill: none;
      stroke: currentColor;
    }
  }
</style>
