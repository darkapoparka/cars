<svelte:options preserveWhitespace={true} runes={true} />

<script lang="ts">
  import { useLocale } from "#lib/i18n/context.svelte.ts";
  const locale = useLocale();
  import AgentCard from "#lib/components/editorial/AgentCard.svelte";
  import ResponsiveCollection from "#lib/components/ResponsiveCollection.svelte";
  import { teamMembers, type AgentItem } from "#lib/data/editorial.ts";

  let {
    items = teamMembers,
    class: className = "",
  }: { items?: readonly AgentItem[]; class?: string } = $props();
</script>

<section
  class={[
    "section-team-1 py-96 background-body desktop-marketing-section",
    className,
  ]}
>
  <div class="container">
    <div class="row align-items-center justify-content-center">
      <div class="col-xl-6 col-lg-7 col-md-9 col-sm-11">
        <div class="text-center mb-5 team-heading desktop-section-heading">
          <span class="text-xl-medium neutral-500 desktop-type-eyebrow"
            >{locale.t("ui.agent-team.awesome-teams")}</span
          >
          <h3 class="section-title neutral-1000 desktop-section-title"
            >{locale.t("ui.agent-team.meet-our-agents")}</h3
          >
        </div>
      </div>
    </div>
    <ResponsiveCollection
      class="row mt-50"
      mobileLayout="rail"
      label={locale.t("ui.agent-team.our-agents")}
    >
      {#each items as item (item.id)}<AgentCard {item} />
      {/each}
    </ResponsiveCollection>
  </div>
</section>

<style>
  @media (max-width: 767.98px) {
    .team-heading {
      margin-bottom: var(--karento-space-4) !important;
    }
  }

  @media (min-width: 992px) {
    .desktop-marketing-section :global(.row.mt-50) {
      margin-top: 0 !important;
    }
  }
</style>
