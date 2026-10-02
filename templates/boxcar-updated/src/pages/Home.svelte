<script lang="ts">
  import { type HomeDesign } from "../data/homes";
  import Hero from "../components/Hero.svelte";
  import HomeSection from "../components/HomeSection.svelte";
  let { design }: { design: HomeDesign } = $props();
</script>

<div class="home-page home-{design.id}">
  <Hero {design} />{#each design.sections as section, index (index)}<HomeSection
      {section}
      {design}
    />{/each}
</div>
