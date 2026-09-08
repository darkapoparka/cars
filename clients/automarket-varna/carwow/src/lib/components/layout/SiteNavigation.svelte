<script lang="ts">
	import { resolve } from '$app/paths';
	import { publicNavItems } from '$lib/data/daynight-site';

	const desktopNavItems = publicNavItems.filter((item) => item.href !== '/contact');

	const navClasses = 'static mr-[18px]';
	const menuClasses = 'flex min-h-[58px] list-none items-center gap-2.5 p-0 max-[1180px]:gap-1';
	const topItemClasses = 'relative flex min-h-[58px] items-center';
	const topLinkClasses =
		'flex h-[58px] items-center gap-1.5 px-3 !text-[18px] !font-semibold !leading-sa-nav text-sa-surface no-underline transition-none hover:bg-transparent hover:text-sa-surface focus-visible:bg-transparent focus-visible:text-sa-surface focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-sa-surface/50 group-focus-within/menu-item:bg-transparent group-focus-within/menu-item:text-sa-surface max-[1180px]:px-2.5 max-[1180px]:!text-sa-base';
</script>

<nav id="main-nav" class={navClasses} aria-label="Основна навигация">
	<ul id="menu-primary-menu" class={menuClasses}>
		{#each desktopNavItems as item (item.href)}
			<li class={topItemClasses}>
				<a class={topLinkClasses} href={resolve(item.href)}>{item.label}</a>
			</li>
		{/each}
	</ul>
</nav>
