<script lang="ts">
  import PageHeaderPt3007a17f79 from "#lib/sections/PageHeaderPt3007a17f79.svelte";
  import Section175ea2fea from "#lib/sections/Section175ea2fea.svelte";
  import SectionTeam1BorderTop79f2655f from "#lib/sections/SectionTeam1BorderTop79f2655f.svelte";
  import SectionCta7fc3183d2 from "#lib/sections/SectionCta7fc3183d2.svelte";
  import SectionStatic1Background2e19b6fdf from "#lib/sections/SectionStatic1Background2e19b6fdf.svelte";
  import SectionCta7bc878ce0 from "#lib/sections/SectionCta7bc878ce0.svelte";
  import Section6d539111 from "#lib/sections/Section6d539111.svelte";
  import BoxFaqsPt0f7ef4810 from "#lib/sections/BoxFaqsPt0f7ef4810.svelte";
  import BoxNews7a68114b from "#lib/sections/BoxNews7a68114b.svelte";
  import Footer from "#lib/components/Footer.svelte";
  import { dealer } from "#lib/content.ts";
</script>

<svelte:head
  ><title
    >{dealer.name === "Karento"
      ? "About Us | Karento"
      : "About Us" + " | " + dealer.name}</title
  ></svelte:head
>
<main class="main"
  ><PageHeaderPt3007a17f79 />
  <Section175ea2fea />
  <SectionTeam1BorderTop79f2655f />
  <SectionCta7fc3183d2 />
  <SectionStatic1Background2e19b6fdf />
  <SectionCta7bc878ce0 />
  <Section6d539111 />
  <BoxFaqsPt0f7ef4810 />
  <BoxNews7a68114b />
  <Footer /></main
>
