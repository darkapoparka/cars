<script lang="ts">
 import DesktopSectionHeading from '$lib/components/shared/DesktopSectionHeading.svelte';
 import { daynightVehicles } from '$lib/data/daynight-vehicles';
</script>
<section class="home-videos" aria-label="Снимки от обявите"><div class="daynight-home-container">
 <DesktopSectionHeading title="Автомобилите отблизо" href="/inventory" label="Всички обяви" />
 <p>Снимки към 09.09.2026 г. Няма потвърден видео канал за тази демонстрация.</p>
 <div class="home-videos__grid">{#each daynightVehicles.slice(0,3) as car (car.slug)}<article class="home-video"><a class="home-video__image" href={`/inventory/${car.slug}`} aria-label={car.shortTitle}><img src={car.gallery[1] ?? car.image} alt={car.shortTitle} width="480" height="270" loading="lazy" style="display:block;width:100%;height:100%;object-fit:cover" /></a></article>{/each}</div>
</div></section>
<style>
	.home-videos { background: #f5f6f7; padding: 40px 0; }
	.home-videos__title { display: inline-flex; align-items: center; gap: 12px; font: inherit !important; color: inherit !important; }
	.home-videos__title img { display: block; width: 186px; height: 62px; margin-block: -9px; object-fit: contain; }
	.home-videos__grid { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 24px; }
	.home-video { border-radius: 12px; overflow: hidden; }
	.home-video__image { aspect-ratio: 16 / 9; min-height: 200px; background: #24282c; }
	.home-video__image iframe { display: block; width: 100%; height: 100%; min-height: 200px; border: 0; }
</style>
