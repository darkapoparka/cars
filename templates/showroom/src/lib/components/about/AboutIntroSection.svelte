<script lang="ts">
	import { resolve } from '$app/paths';
	import { ArrowRight, Check, ChevronDown } from '@lucide/svelte';
	import { eliqAboutActivities, eliqAboutServiceGroups } from '$lib/data/eliqauto-about';
	import AboutSectionHeader from './AboutSectionHeader.svelte';
	import HomeFiveActionBand from '$lib/components/home/HomeFiveActionBand.svelte';
	const actionCopy = {
		actionBand: {
			importTitle: 'Купувате автомобил?',
			importBody: 'Налични автомобили, внос, собствен лизинг и бартер.',
			importCta: 'Виж колите',
			buyTitle: 'Продавате автомобил?',
			buyBody: 'Оценка, изкупуване и съдействие с документите.',
			buyCta: 'Заяви оценка'
		}
	};
</script>

<div class="container">
	<AboutSectionHeader
		heading="Съдействие на всяка стъпка"
		description="Подбор, проверка и подготовка за покупка или продажба на автомобил."
	/>
</div>
<HomeFiveActionBand
	copy={actionCopy}
	primaryHref="/inventory"
	secondaryHref="/sell-your-car"
	compact
/>
<div class="container">
	<details class="about-activity-details">
		<summary>Покупка, продажба и финансиране <ChevronDown size={20} aria-hidden="true" /></summary>
		<div class="about-activity-grid">
			{#each eliqAboutActivities as activity (activity.title)}
				<a class="about-activity" href={resolve(activity.href)}>
					<h3>{activity.title}<ArrowRight size={16} aria-hidden="true" /></h3>
					<p>{activity.description}</p>
				</a>
			{/each}
		</div>
	</details>
	<div class="about-all-services">
		<h3>Всички 27 услуги</h3>
		<p>От документите и транспорта до сервиза. Изберете категория, за да разгледате услугите.</p>
		<div class="about-all-services__groups">
			{#each eliqAboutServiceGroups as group (group.title)}
				<details class="about-service-group">
					<summary
						><span>{group.title}<small>{group.services.length} услуги</small></span><ChevronDown
							size={20}
							aria-hidden="true"
						/></summary
					>
					<ul>
						{#each group.services as service (service)}<li>
								<Check size={16} aria-hidden="true" />{service}
							</li>{/each}
					</ul>
				</details>
			{/each}
		</div>
		<a class="about-all-services__contact" href={resolve('/contact')}
			>Свържете се с нас за конкретна услуга <ArrowRight size={16} aria-hidden="true" /></a
		>
	</div>
</div>

<style>
	.about-all-services {
		margin-top: 28px;
	}
	.about-all-services > h3 {
		font-size: 22px;
		font-weight: 600;
		margin: 0 0 8px;
	}
	.about-all-services > p {
		font-size: 14px;
		color: #62626b;
		margin: 0 0 20px;
		line-height: 1.6;
	}
	.about-all-services__groups {
		display: grid;
		grid-template-columns: repeat(2, minmax(0, 1fr));
		gap: 12px;
		align-items: start;
	}
	.about-service-group {
		border: 1px solid #e4e4e7;
		border-radius: 8px;
	}
	.about-service-group summary {
		display: flex;
		justify-content: space-between;
		align-items: center;
		gap: 16px;
		padding: 16px;
		cursor: pointer;
		font-size: 16px;
		font-weight: 600;
		list-style: none;
	}
	.about-service-group summary::-webkit-details-marker {
		display: none;
	}
	.about-service-group summary small {
		display: block;
		margin-top: 4px;
		font-size: 13px;
		color: #62626b;
		font-weight: 400;
	}
	.about-service-group[open] summary > :global(svg) {
		transform: rotate(180deg);
	}
	.about-service-group ul {
		padding: 0 16px 16px;
		margin: 0;
		list-style: none;
	}
	.about-service-group li {
		display: flex;
		align-items: flex-start;
		gap: 10px;
		padding-block: 6px;
		font-size: 14px;
		line-height: 1.5;
	}
	.about-service-group li > :global(svg) {
		flex-shrink: 0;
		margin-top: 2px;
		color: var(--bc-accent);
	}
	.about-service-group summary:focus-visible {
		outline: 2px solid var(--bc-accent);
		outline-offset: 3px;
		border-radius: 8px;
	}
	.about-all-services__contact {
		display: inline-flex;
		align-items: center;
		gap: 10px;
		min-height: 44px;
		margin-top: 12px;
		color: var(--bc-accent);
		font-size: 14px;
		font-weight: 600;
	}
	.about-all-services__contact:focus-visible {
		outline: 2px solid var(--bc-accent);
		outline-offset: 3px;
	}
	.about-activity-details {
		margin-top: 16px;
		border: 1px solid #e4e4e7;
		border-radius: 8px;
	}
	.about-activity-details summary {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 16px;
		padding: 16px;
		font-size: 16px;
		font-weight: 600;
		cursor: pointer;
		list-style: none;
	}
	.about-activity-details summary::-webkit-details-marker {
		display: none;
	}
	.about-activity-details[open] summary > :global(svg) {
		transform: rotate(180deg);
	}
	.about-activity-grid {
		display: grid;
		grid-template-columns: repeat(2, minmax(0, 1fr));
		gap: 20px 32px;
		padding: 8px 20px 24px;
	}
	.about-activity {
		color: var(--bc-ink);
	}
	.about-activity h3 {
		display: flex;
		justify-content: space-between;
		align-items: center;
		gap: 12px;
		font-size: 16px;
		font-weight: 600;
		margin: 0 0 6px;
	}
	.about-activity h3 > :global(svg) {
		color: var(--bc-accent);
		flex-shrink: 0;
	}
	.about-activity p {
		margin: 0;
		font-size: 14px;
		line-height: 1.6;
		color: #62626b;
	}
	.about-activity:hover h3 {
		color: var(--bc-accent);
	}
	.about-activity:focus-visible,
	.about-activity-details summary:focus-visible {
		outline: 2px solid var(--bc-accent);
		outline-offset: 3px;
	}
	@media (max-width: 767px) {
		.about-all-services__groups,
		.about-activity-grid {
			grid-template-columns: 1fr;
		}
	}
</style>
