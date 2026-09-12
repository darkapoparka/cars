<script lang="ts">
	import DesktopSectionHeading from '$lib/components/shared/DesktopSectionHeading.svelte';
	import { daynightSite } from '$lib/data/daynight-site';
	import { resolve } from '$app/paths';
</script>

<section class="home-videos" aria-label={`Публикуван източник за ${daynightSite.shortName}`}>
	<div class="daynight-home-container">
		<DesktopSectionHeading title="Публикувани обяви" href={daynightSite.sourceInventory} label="Отвори mobile.bg" />
		<div class="home-videos__panel">
			<div><strong>{daynightSite.name}</strong><p>Вижте оригиналния публичен каталог за актуални снимки и потвърдете наличността директно с автокъщата.</p></div>
			<div class="home-videos__actions"><a href={daynightSite.sourceInventory} target="_blank" rel="noopener">Оригинален каталог</a><a href={resolve('/contact')}>Контакти</a></div>
		</div>
	</div>
</section>

<style>
.home-videos{background:#f5f6f7;padding:40px 0}.home-videos__panel{display:flex;align-items:center;justify-content:space-between;gap:24px;padding:28px;border-radius:14px;background:#fff;border:1px solid #e3e6ea}.home-videos__panel strong{font-size:22px}.home-videos__panel p{margin:8px 0 0;max-width:720px;color:#626a75;line-height:1.6}.home-videos__actions{display:flex;flex-wrap:wrap;gap:10px}.home-videos__actions a{display:inline-flex;min-height:44px;align-items:center;padding:0 16px;border-radius:10px;border:1px solid #202329;color:#202329;font-weight:650;white-space:nowrap}@media(max-width:800px){.home-videos__panel{align-items:flex-start;flex-direction:column}}
</style>
