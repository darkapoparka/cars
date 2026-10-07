<script lang="ts">
  import BoxBannerHome7b226deee from "#lib/sections/BoxBannerHome7b226deee.svelte";
  import BorderBottomd32072b6 from "#lib/sections/BorderBottomd32072b6.svelte";
  import BoxFlights21829611 from "#lib/sections/BoxFlights21829611.svelte";
  import SectionCta4PositionRelativedae35d64 from "#lib/sections/SectionCta4PositionRelativedae35d64.svelte";
  import Pt80Pb509525f0ff from "#lib/sections/Pt80Pb509525f0ff.svelte";
  import SectionStatic1ClassList0754f62c from "#lib/sections/SectionStatic1ClassList0754f62c.svelte";
  import BoxFlights860c666e from "#lib/sections/BoxFlights860c666e.svelte";
  import Section22a42e50 from "#lib/sections/Section22a42e50.svelte";
  import SectionTeam1ec547cfe from "#lib/sections/SectionTeam1ec547cfe.svelte";
  import BoxCta5c4f130a1 from "#lib/sections/BoxCta5c4f130a1.svelte";
  import Section6d539111 from "#lib/sections/Section6d539111.svelte";
  import BoxWhyBook22ClassList7de3e37d from "#lib/sections/BoxWhyBook22ClassList7de3e37d.svelte";
  import Pb85cd5c61b8 from "#lib/sections/Pb85cd5c61b8.svelte";
  import BoxApp2PositionRelativeaa2090fd from "#lib/sections/BoxApp2PositionRelativeaa2090fd.svelte";
  import Footer from "#lib/components/Footer.svelte";
  import { dealer } from "#lib/content.ts";
</script>

<svelte:head
  ><title
    >{dealer.name === "Karento"
      ? "Carento - Car rental Bootstrap 5 Template"
      : "Carento - Car rental Bootstrap 5 Template" +
        " | " +
        dealer.name}</title
  ></svelte:head
>
<main class="main"
  ><BoxBannerHome7b226deee />
  <BorderBottomd32072b6 />
  <BoxFlights21829611 />
  <SectionCta4PositionRelativedae35d64 />
  <Pt80Pb509525f0ff />
  <SectionStatic1ClassList0754f62c />
  <BoxFlights860c666e />
  <Section22a42e50 />
  <SectionTeam1ec547cfe />
  <BoxCta5c4f130a1 />
  <Section6d539111 />
  <BoxWhyBook22ClassList7de3e37d />
  <Pb85cd5c61b8 />
  <BoxApp2PositionRelativeaa2090fd />
  <Footer /></main
>
