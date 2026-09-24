<script lang="ts">
  import { getI18n } from '$lib/locale/context';
  const i18n = getI18n();

  import VehicleCard from '$components/vehicles/VehicleCard.svelte';
  import { demoWorkflowShowcases } from '$data/demo-content';

  let { topic }: { topic: 'trade-in' | 'import' } = $props();
  const showcase = $derived(demoWorkflowShowcases[topic]);
</script>

<section class="dn-workflow-showcase" aria-labelledby="workflow-showcase-title">
  <header>
    <h2 id="workflow-showcase-title">{i18n.text(showcase.title)}</h2>
    <span class="dn-workflow-showcase__demo">{i18n.t("m_5d82e4d122eb")}</span>
  </header>
  <ul aria-label={i18n.text(showcase.title)}>
    {#each showcase.vehicles as vehicle (vehicle.id)}
      <li>
        <VehicleCard {vehicle} layout="showcase" />
      </li>
    {/each}
  </ul>
</section>

<style>
  .dn-workflow-showcase { max-width: 760px; margin: var(--dn-space-6) auto 0; }
  header { display: flex; align-items: baseline; flex-wrap: wrap; gap: var(--dn-space-2); margin-bottom: var(--dn-space-4); }
  h2 { margin: 0; color: var(--dn-ink); font-size: var(--dn-text-card); font-weight: var(--dn-weight-medium); line-height: var(--dn-leading-heading); letter-spacing: var(--dn-tracking-heading); }
  .dn-workflow-showcase__demo { color: var(--dn-muted); font-size: var(--dn-text-meta); line-height: var(--dn-leading-meta); }
  ul { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: var(--dn-space-3); margin: 0; padding: 0; list-style: none; }
  li { min-width: 0; }

  @media (max-width: 767px) {
    .dn-workflow-showcase { margin-top: var(--dn-space-5); }
    header { padding-inline: var(--dn-space-1); margin-bottom: var(--dn-space-3); }
    ul {
      display: flex;
      overflow-x: auto;
      scroll-snap-type: x mandatory;
      scroll-padding-inline: var(--dn-space-3);
      margin-inline: calc(-1 * var(--dn-space-3));
      padding: 0 var(--dn-space-3) var(--dn-space-2);
      scrollbar-width: none;
    }
    li { flex: 0 0 min(216px, 76vw); scroll-snap-align: start; }
  }
</style>
