<script lang="ts">
	import { resolve } from '$app/paths';
	import { ArrowLeftRight, CarFront, Globe, KeyRound, ShieldCheck, Wallet } from '@lucide/svelte';
	import { eliqAboutActivities, eliqAboutCompany } from '$lib/data/eliqauto-about';
	import AboutSectionHeader from './AboutSectionHeader.svelte';
	const icons = {
		car: CarFront,
		key: KeyRound,
		wallet: Wallet,
		swap: ArrowLeftRight,
		globe: Globe,
		check: ShieldCheck
	};
</script>

<section class="about-showroom" aria-label="За ELIQ AUTO">
	<div class="container">
		<AboutSectionHeader
			heading={`ELIQ AUTO — от ${eliqAboutCompany.since} година`}
			description="Автомобили, финансиране и съдействие на едно място в Пазарджик."
		/>
		<p class="about-story">
			От 2017 г. развиваме ELIQ AUTO с грижа за хората, които ни избират и препоръчват. Работата ни
			обхваща покупката, изкупуването и вноса на автомобили, както и съдействието след избора — с
			документи, регистрация, застраховане и сервиз.
		</p>
		<div class="about-activities">
			{#each eliqAboutActivities as activity (activity.title)}
				{@const Icon = icons[activity.icon]}
				<a class="about-activity" href={resolve(activity.href)}>
					<Icon size={24} strokeWidth={1.7} aria-hidden="true" />
					<h3>{activity.title}</h3>
					<p>{activity.description}</p>
				</a>
			{/each}
		</div>
	</div>
</section>

<style>
	.about-showroom {
		padding-block: 48px 32px;
	}
	.about-story {
		max-width: 860px;
		margin: -8px auto 28px;
		font-size: 16px;
		line-height: 1.7;
		color: #52525b;
		text-align: center;
	}
	.about-activities {
		display: grid;
		grid-template-columns: repeat(3, minmax(0, 1fr));
		gap: 16px;
	}
	.about-activity {
		display: grid;
		grid-template-columns: 28px minmax(0, 1fr);
		gap: 8px 12px;
		padding: 20px;
		border: 1px solid #e4e4e7;
		border-radius: 10px;
		color: var(--bc-ink);
		background: #fff;
	}
	.about-activity > :global(svg) {
		color: var(--bc-accent);
		margin-top: 2px;
	}
	.about-activity h3 {
		margin: 0;
		font-size: 18px;
		font-weight: 600;
		line-height: 1.4;
	}
	.about-activity p {
		grid-column: 2;
		margin: 0;
		color: #62626b;
		font-size: 14px;
		line-height: 1.6;
	}
	.about-activity:hover {
		border-color: var(--bc-accent);
	}
	.about-activity:focus-visible {
		outline: 2px solid var(--bc-accent);
		outline-offset: 3px;
	}
	@media (max-width: 1023px) {
		.about-activities {
			grid-template-columns: repeat(2, minmax(0, 1fr));
		}
	}
	@media (max-width: 767px) {
		.about-showroom {
			padding-block: 28px;
		}
		.about-story {
			text-align: left;
			font-size: 14px;
			margin-bottom: 20px;
		}
		.about-activities {
			grid-template-columns: 1fr;
			gap: 10px;
		}
		.about-activity {
			padding: 16px;
		}
		.about-activity h3 {
			font-size: 16px;
		}
	}
</style>
