<svelte:options preserveWhitespace={true} runes={true} />

<script lang="ts">
  import { useLocale } from "#lib/i18n/context.svelte.ts";
  const locale = useLocale();
  import DemoActionLink from "#lib/components/DemoActionLink.svelte";
  import type { AgentItem } from "#lib/data/editorial.ts";

  let { item }: { item: AgentItem } = $props();
</script>

<div class="col-lg-3 col-md-6 col-12">
  <div class={[item.cardClass, "agent-card desktop-card"]}>
    <div class="card-image">
      <a
        href={locale.href("/import/source")}
        aria-label={locale.t("ui.agent-card.view-details")}
      >
        <img src={item.image} alt={locale.t("image.illustrative")} />
      </a>
    </div>
    <div class="card-info p-4">
      <div class="card-title">
        <a
          class="text-xl-bold neutral-1000"
          href={locale.href("/import/source")}
          aria-label={locale.t("ui.agent-card.view-details")}
        >
          <h6 class="desktop-type-card">{item.name}</h6>
        </a>
        <span class="text-sm-medium neutral-500 desktop-type-meta"
          >{locale.text(item.role)}</span
        >
      </div>
      <div class="card-program">
        <div class="endtime">
          <div class="card-author d-flex align-items-center gap-2">
            <DemoActionLink
              href="#!"
              class="rounded-circle background-100 icon-shape icon icon-sm agent-action"
              aria-label={locale.t("ui.agent-card.view-details")}
            >
              <img
                class="m-0"
                src="/assets/imgs/team/team-1/icon-1.svg"
                alt={locale.t("image.illustrative")}
              />
            </DemoActionLink>
            <DemoActionLink
              href="#!"
              class="rounded-circle background-100 icon-shape icon icon-sm agent-action"
              aria-label={locale.t("ui.agent-card.view-details")}
            >
              <img
                class="m-0"
                src="/assets/imgs/team/team-1/icon-2.svg"
                alt={locale.t("image.illustrative")}
              />
            </DemoActionLink>
            <DemoActionLink
              href="#!"
              class="rounded-circle background-100 icon-shape icon icon-sm agent-action"
              aria-label={locale.t("ui.agent-card.view-details")}
            >
              <img
                class="m-0"
                src="/assets/imgs/team/team-1/icon-3.svg"
                alt={locale.t("image.illustrative")}
              />
            </DemoActionLink>
            <DemoActionLink
              href="#!"
              class="rounded-circle background-100 icon-shape icon icon-sm agent-action"
              aria-label={locale.t("ui.agent-card.view-details")}
            >
              <img
                class="m-0"
                src="/assets/imgs/team/team-1/icon-4.svg"
                alt={locale.t("image.illustrative")}
              />
            </DemoActionLink>
          </div>
          <a
            href={locale.href("/import/source")}
            class="rounded-circle background-100 icon-shape icon icon-sm border icon-shape-arrow agent-action"
            aria-label={locale.t("ui.agent-card.view-details")}
          >
            <img
              class="m-0"
              src="/assets/imgs/team/team-1/arrow-up-right.svg"
              alt={locale.t("image.illustrative")}
            />
          </a>
        </div>
      </div>
    </div>
  </div>
</div>

<style>
  @media (max-width: 767.98px) {
    .agent-card {
      display: flex;
      flex-direction: column;
      height: 100%;
      margin: 0 !important;
      border-radius: var(--karento-radius-card);
    }

    .agent-card .card-image {
      flex-shrink: 0;
    }

    .agent-card .card-info {
      flex: 1;
      min-width: 0;
      padding: var(--karento-space-4) !important;
    }

    .agent-card .card-title a {
      display: flex;
      align-items: center;
      min-height: var(--karento-touch-target);
    }

    .agent-card .card-title {
      margin-bottom: var(--karento-space-6);
    }

    .agent-card h6 {
      margin: 0;
      font-size: var(--karento-type-card-size);
      font-weight: var(--karento-type-card-weight);
      line-height: var(--karento-type-card-leading);
    }

    .agent-card .card-title span {
      display: block;
      font-size: var(--karento-type-label-size);
      font-weight: var(--karento-type-label-weight);
      line-height: var(--karento-type-label-leading);
      overflow-wrap: break-word;
    }

    .agent-card .card-author {
      gap: var(--karento-space-3) !important;
    }

    .agent-card :global(.agent-action) {
      position: relative;
      flex-shrink: 0;
    }

    /* Keep the original small circles with separate 44px transparent targets. */
    .agent-card :global(.agent-action)::after {
      content: "";
      position: absolute;
      top: 50%;
      left: 50%;
      width: var(--karento-touch-target);
      height: var(--karento-touch-target);
      transform: translate(-50%, -50%);
    }
  }

  @media (min-width: 992px) {
    .agent-card {
      height: 100%;
      margin-bottom: 0;
    }
    .agent-card .card-info {
      display: flex;
      flex-direction: column;
      gap: var(--karento-desktop-card-gap);
      padding: var(--karento-desktop-card-padding) !important;
    }
    .agent-card .card-title {
      margin: 0;
    }
    .agent-card h6 {
      margin-bottom: var(--karento-desktop-space-1);
    }
    .agent-card .card-program {
      margin-top: auto;
    }
  }
</style>
