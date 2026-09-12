<script lang="ts">
	import { onMount } from 'svelte';
	import { resolve } from '$app/paths';
	import { daynightSite } from '$lib/data/daynight-site';

	onMount(() => {
		const root = document.querySelector<HTMLElement>('.mobile-home');
		if (!root) return;
		root.setAttribute('aria-label', `${daynightSite.name} — начало`);
		const brand = root.querySelector<HTMLAnchorElement>('.mh-hero__brand');
		brand?.setAttribute('aria-label', `${daynightSite.name} начало`);
		const logo = root.querySelector<HTMLImageElement>('.mh-hero__logo');
		if (logo) { logo.src = daynightSite.logoLight; logo.alt = daynightSite.name; }
		root.querySelector<HTMLElement>('.mh-hero__title')?.replaceChildren(daynightSite.name);
		root.querySelector<HTMLAnchorElement>('.mh-hero__bar-action--call')?.setAttribute('aria-label', `Обади се на ${daynightSite.name}`);
		const modeButtons = root.querySelectorAll<HTMLButtonElement>('.mh-hero__modes button');
		if (modeButtons[1]) modeButtons[1].hidden = true;
		root.querySelectorAll<HTMLAnchorElement>('a[href*="intent=import"]').forEach((link) => link.setAttribute('href', resolve('/contact')));
		root.querySelectorAll<HTMLElement>('*').forEach((element) => {
			if (element.childElementCount === 0 && element.textContent) {
				const value = element.textContent.trim();
				if (value === 'Day Night Auto' || value === 'Day Night Auto София') element.textContent = daynightSite.name;
				if (value === 'Внос' || value === 'Внос по заявка') element.textContent = 'Контакт';
			}
			for (const attr of ['aria-label','title']) {
				const value = element.getAttribute(attr);
				if (value?.includes('Day Night Auto')) element.setAttribute(attr, value.replaceAll('Day Night Auto София', daynightSite.name).replaceAll('Day Night Auto', daynightSite.name));
			}
		});
		const copyright = root.querySelector<HTMLElement>('.mh-footer__copy');
		if (copyright) copyright.textContent = `© 2026 ${daynightSite.name}. Демонстрационен проект.`;
	});
</script>
