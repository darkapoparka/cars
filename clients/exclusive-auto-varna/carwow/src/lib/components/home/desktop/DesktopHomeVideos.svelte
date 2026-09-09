<script lang="ts">
  import { resolve } from '$app/paths';
  import DesktopSectionHeading from '$lib/components/shared/DesktopSectionHeading.svelte';
  import { featuredDayNightVehicles } from '$lib/data/daynight-vehicles';
</script>

<section class="home-videos" aria-label="Снимки и допълнителна информация">
  <div class="daynight-home-container">
    <DesktopSectionHeading title="Още за автомобилите" href={resolve('/inventory')} label="Всички обяви" />
    <p>Видео прегледи не са предоставени. Разгледайте снимките от обявите и поискайте допълнителни кадри от продавача.</p>
    <div class="home-videos__grid">
      {#each featuredDayNightVehicles.slice(0, 3) as vehicle (vehicle.slug)}
        <article class="home-video">
          <a href={resolve('/inventory/[slug]', { slug: vehicle.slug })}>
            <div class="home-video__image"><img src={vehicle.image} alt={vehicle.shortTitle} width="480" height="270" loading="lazy" style="width:100%;height:100%;object-fit:cover" /></div>
            <h3>{vehicle.shortTitle}</h3>
            <p>Снимки, данни и източник на обявата</p>
          </a>
        </article>
      {/each}
    </div>
  </div>
</section>

<style>
	.home-videos { background: #f5f6f7; padding: 40px 0; }
	.home-videos__title { display: inline-flex; align-items: center; gap: 12px; font: inherit !important; color: inherit !important; }
	.home-videos__title img { display: block; width: 186px; height: 62px; margin-block: -9px; object-fit: contain; }
	.home-videos__grid { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 24px; }
	.home-video { border-radius: 12px; overflow: hidden; }
	.home-video__image { aspect-ratio: 16 / 9; min-height: 200px; background: #24282c; }
	.home-video__image iframe { display: block; width: 100%; height: 100%; min-height: 200px; border: 0; }
</style>
