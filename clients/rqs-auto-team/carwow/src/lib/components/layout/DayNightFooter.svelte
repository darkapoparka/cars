<script lang="ts">
	import { resolve } from '$app/paths';
	import { daynightSite } from '$lib/data/daynight-site';
	import { daynightFooterBottomLinks, daynightFooterLinkGroups } from './daynight-footer-data';
	const linkClass='inline-block text-[15px] leading-6 text-sa-surface/70 no-underline hover:text-sa-surface';
</script>

<footer class="dealer-footer bg-sa-dark font-sa text-sa-surface">
	<div class="mx-auto grid w-full max-w-[1440px] grid-cols-3 gap-10 px-6 py-14 max-[900px]:grid-cols-1">
		<section>
			<a href={resolve('/')} aria-label={`${daynightSite.name} начало`}><img class="h-[58px] w-[220px] object-contain object-left" src={daynightSite.logoLight} alt={daynightSite.name}/></a>
			<p class="mt-5 max-w-md text-[15px] leading-6 text-sa-surface/65">Демонстрационна витрина с датирована извадка от публични обяви. Цена, пробег, оборудване и наличност се потвърждават директно с автокъщата.</p>
		</section>
		<section class="grid grid-cols-2 gap-8 max-[520px]:grid-cols-1">
			{#each daynightFooterLinkGroups as group (group.title)}
				<div><h2 class="mb-3 text-[16px] font-semibold">{group.title}</h2><ul class="m-0 grid list-none gap-2 p-0">{#each group.links as link (link.href)}<li><a class={linkClass} href={resolve(link.href)}>{link.label}</a></li>{/each}</ul></div>
			{/each}
		</section>
		<section>
			<h2 class="mb-3 text-[16px] font-semibold">Контакт</h2>
			<a class="block text-[22px] font-semibold text-sa-surface no-underline" href={daynightSite.phoneHref}>{daynightSite.phoneLabel}</a>
			<a class="mt-3 block text-[15px] leading-6 text-sa-surface/70 no-underline" href={daynightSite.mapUrl} target="_blank" rel="noopener">{daynightSite.location}</a>
			<div class="mt-5 flex flex-wrap gap-2"><a class="rounded-sa-xs border border-sa-surface/25 px-4 py-2 text-[14px] font-semibold text-sa-surface no-underline" href={daynightSite.sourceInventory} target="_blank" rel="noopener">Оригинален каталог</a><a class="rounded-sa-xs border border-sa-surface/25 px-4 py-2 text-[14px] font-semibold text-sa-surface no-underline" href={resolve('/contact')}>Контакти</a></div>
		</section>
	</div>
	<div class="border-t border-sa-surface/10"><div class="mx-auto flex w-full max-w-[1440px] items-center justify-between gap-5 px-6 py-5 text-[13px] text-sa-surface/55 max-[700px]:flex-col max-[700px]:items-start"><span>© 2026 {daynightSite.name}. Демонстрационен проект.</span><nav class="flex flex-wrap gap-4" aria-label="Правна информация">{#each daynightFooterBottomLinks as link (link.href)}<a class="text-sa-surface/55 no-underline hover:text-sa-surface" href={resolve(link.href)}>{link.label}</a>{/each}</nav></div></div>
</footer>
