<script lang="ts">
  import './about.css';
  import AboutHero from '$components/company/AboutHero.svelte';
  import AboutProcess from '$components/company/AboutProcess.svelte';
  import AboutTeam from '$components/company/AboutTeam.svelte';
  import AboutPartners from '$components/company/AboutPartners.svelte';
  import ShowroomMap from '$components/company/ShowroomMap.svelte';
  import { brand } from '$config/brand';
</script>

<svelte:head>
  <title>За нас — {brand.name}</title>
  <meta name="description" content={`${brand.name} — публикувани автомобили и контакт за оглед в ${brand.city}.`} />
</svelte:head>

<AboutHero />
<AboutProcess />
<AboutTeam />
<AboutPartners />

<section class="dn-about-showroom dn-section" aria-labelledby="about-showroom-title">
  <div class="container">
    <div class="dn-about-showroom__heading">
      <h2 id="about-showroom-title">Шоурум в {brand.city}</h2>
      <p>{brand.address}. {brand.appointment}.</p>
    </div>
    <ShowroomMap />
  </div>
</section>
