<script lang="ts">
	import DesktopBrowseLink from '$lib/components/shared/DesktopBrowseLink.svelte';
	import { resolve } from '$app/paths';
	import { desktopOnlyImagePlaceholder, desktopOnlySizes, desktopOnlySrcset } from '$lib/utils/desktop-only-assets';
	import { daynightVehicles } from '$lib/data/daynight-vehicles';
	import { daynightSite } from '$lib/data/daynight-site';

	type CampaignVariant = 'single' | 'campaign-grid';
	let { showMetrics = true, variant = 'single' }: { showMetrics?: boolean; variant?: CampaignVariant } = $props();
	const campaigns = [
		{id:'collection',title:'Вижте автомобилите',copy:'Разгледайте публикуваната извадка и попитайте за актуална наличност.',cta:'Към автомобилите',href:'/inventory',image:'/assets/images/home-promos/gclass-urus-pair-v4.webp'},
		{id:'viewing',title:'Уговорете оглед',copy:'Изберете автомобил и потвърдете удобно посещение директно по телефона.',cta:'Свържете се',href:'/contact',image:'/assets/images/home-promos/phone-portrait-generated-v7.webp'},
		{id:'contact',title:'Адрес и въпроси',copy:'Проверете адреса и задайте въпрос за цена, пробег, документи или оборудване.',cta:'Контакти',href:'/contact',image:'/assets/images/home-promos/gclass-urus-pair-v4.webp'}
	] as const;
	const metrics = [
		{id:'stock',value:String(daynightVehicles.length),label:'обяви в демонстрационната извадка',hasDivider:true},
		{id:'brands',value:String(new Set(daynightVehicles.map((vehicle)=>vehicle.brand)).size),label:'марки в извадката',hasDivider:true},
		{id:'location',value:'1',label:`публикувана локация: ${daynightSite.locationShort}`,hasDivider:true},
		{id:'contact',value:'1',label:'публикуван основен телефон',hasDivider:false}
	] as const;
</script>

<section class="daynight-home-section daynight-home-section--why">
	<div class="daynight-home-container">
		{#if variant === 'campaign-grid'}
			<div class="daynight-home-campaign-grid" aria-label="Автомобили и директен контакт">
				{#each campaigns as campaign (campaign.id)}
					<article class={`daynight-home-campaign-card daynight-home-campaign-card--${campaign.id}`}>
						<div class="daynight-home-campaign-card__media" aria-hidden="true"><img src={desktopOnlyImagePlaceholder} srcset={desktopOnlySrcset(campaign.image,1536)} sizes={desktopOnlySizes('min(420px, calc((100vw - 80px) / 3))')} width="1536" height="1024" alt="" loading="lazy" decoding="async" /></div>
						<div class="daynight-home-campaign-card__content"><h2>{campaign.title}</h2><p>{campaign.copy}</p><DesktopBrowseLink href={resolve(campaign.href)} label={campaign.cta} tone={campaign.id === 'collection' ? 'light' : 'dark'} /></div>
					</article>
				{/each}
			</div>
		{:else}
			<div class="daynight-home-why"><div class="daynight-home-why__content"><h2 class="daynight-home-why__title">Информация за обявите</h2><p class="daynight-home-why__copy">Цените, пробегът, оборудването и наличността се потвърждават директно с {daynightSite.name}.</p><a href={resolve('/contact')} class="daynight-home-why__cta"><span>Свържете се</span></a></div></div>
		{/if}
		{#if showMetrics}<div class="daynight-home-metrics">{#each metrics as metric (metric.id)}<div class={['daynight-home-metric',metric.hasDivider&&'daynight-home-metric--divided']}><div class="daynight-home-metric__content"><div class="daynight-home-metric__number"><span class="daynight-home-metric__value">{metric.value}</span></div><p class="daynight-home-metric__label">{metric.label}</p></div></div>{/each}</div>{/if}
	</div>
</section>

<style>
.daynight-home-campaign-grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:16px}.daynight-home-campaign-card{--campaign-ink:#fff;--campaign-copy:#e5e7eb;background:var(--desktop-action);border:1px solid transparent;border-radius:12px;display:grid;grid-template-rows:auto minmax(220px,1fr);min-height:440px;overflow:hidden;position:relative}.daynight-home-campaign-card--viewing{--campaign-ink:var(--desktop-action);--campaign-copy:var(--desktop-action);background:var(--sa-yellow)}.daynight-home-campaign-card--contact{--campaign-ink:var(--desktop-action);--campaign-copy:var(--discovery-muted);background:var(--desktop-panel);border-color:var(--desktop-control-border)}.daynight-home-campaign-card__media{grid-row:2;min-width:0;overflow:hidden;position:relative}.daynight-home-campaign-card__media img{display:block;position:absolute;max-width:none;object-fit:contain;object-position:right bottom}.daynight-home-campaign-card--collection .daynight-home-campaign-card__media img,.daynight-home-campaign-card--contact .daynight-home-campaign-card__media img{width:104%;height:auto;right:0;bottom:-16%}.daynight-home-campaign-card--viewing .daynight-home-campaign-card__media img{height:320px;width:320px;right:12px;top:0}.daynight-home-campaign-card__content{align-items:flex-start;box-sizing:border-box;display:flex;flex-direction:column;grid-row:1;padding:28px 28px 16px;position:relative;min-width:0}.daynight-home-campaign-card h2{color:var(--campaign-ink);font-size:clamp(24px,1.8vw,30px);font-weight:700;letter-spacing:-.025em;line-height:1.15;margin:0 0 12px}.daynight-home-campaign-card p{color:var(--campaign-copy);font-size:16px;line-height:1.5;margin:0 0 20px;min-height:3em}.daynight-home-campaign-card__content :global(.desktop-browse-link){margin-top:auto}.daynight-home-why{padding:34px;border-radius:12px;background:var(--desktop-panel)}.daynight-home-why__title{margin:0 0 12px}.daynight-home-why__copy{max-width:720px}.daynight-home-why__cta{display:inline-flex;margin-top:18px;min-height:44px;align-items:center;padding:0 18px;border-radius:10px;background:var(--desktop-action);color:#fff}.daynight-home-metrics{display:grid;grid-template-columns:repeat(4,1fr);gap:18px;margin-top:24px}.daynight-home-metric{padding:18px}.daynight-home-metric__value{font-size:28px;font-weight:700}.daynight-home-metric__label{margin:6px 0 0;color:var(--discovery-muted)}@media(max-width:1120px){.daynight-home-campaign-card__content{padding:24px 20px 16px}}
</style>
