<script lang="ts">
  import BoxSectionBlockBannerHome3bfeb1480 from "#lib/sections/BoxSectionBlockBannerHome3bfeb1480.svelte";
  import BoxSectionBoxSearchAdvanceHome101bf42523 from "#lib/sections/BoxSectionBoxSearchAdvanceHome101bf42523.svelte";
  import Sectioncae3d3c5 from "#lib/sections/Sectioncae3d3c5.svelte";
  import KarentoHomeBrandse42ce21b from "#lib/sections/KarentoHomeBrandse42ce21b.svelte";
  import KarentoHowItWorksa462d9b9 from "#lib/sections/KarentoHowItWorksa462d9b9.svelte";
  import SectionBoxBanner2e6f03532 from "#lib/sections/SectionBoxBanner2e6f03532.svelte";
  import SectionCta4PositionRelative48e1b39f from "#lib/sections/SectionCta4PositionRelative48e1b39f.svelte";
  import Sectiond6a6020d from "#lib/sections/Sectiond6a6020d.svelte";
  import BoxCta7d472647c from "#lib/sections/BoxCta7d472647c.svelte";
  import BoxFlights3300f4a2 from "#lib/sections/BoxFlights3300f4a2.svelte";
  import Section20986d1c from "#lib/sections/Section20986d1c.svelte";
  import BoxPropertiesAreaPt96ebd2b50a from "#lib/sections/BoxPropertiesAreaPt96ebd2b50a.svelte";
  import Pt0c5e22240 from "#lib/sections/Pt0c5e22240.svelte";
  import SectionTeam1Pb01cc02dd3 from "#lib/sections/SectionTeam1Pb01cc02dd3.svelte";
  import BoxNews7a68114b from "#lib/sections/BoxNews7a68114b.svelte";
  import BoxApp2PositionRelative2218c96e from "#lib/sections/BoxApp2PositionRelative2218c96e.svelte";
  import Footer from "#lib/components/Footer.svelte";
  import { dealer } from "#lib/content.ts";
</script>

<svelte:head
  ><title
    >{dealer.name === "Karento"
      ? "Home | Karento"
      : "Home" + " | " + dealer.name}</title
  ></svelte:head
>
<main class="main background-body"
  ><BoxSectionBlockBannerHome3bfeb1480 />
  <BoxSectionBoxSearchAdvanceHome101bf42523 />
  <Sectioncae3d3c5 />
  <KarentoHomeBrandse42ce21b />
  <KarentoHowItWorksa462d9b9 />
  <SectionBoxBanner2e6f03532 />
  <SectionCta4PositionRelative48e1b39f />
  <Sectiond6a6020d />
  <BoxCta7d472647c />
  <BoxFlights3300f4a2 />
  <Section20986d1c />
  <BoxPropertiesAreaPt96ebd2b50a />
  <Pt0c5e22240 />
  <SectionTeam1Pb01cc02dd3 />
  <BoxNews7a68114b />
  <BoxApp2PositionRelative2218c96e />
  <Footer /></main
>
