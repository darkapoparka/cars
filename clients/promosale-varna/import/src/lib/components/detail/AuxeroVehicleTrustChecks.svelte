<script lang="ts">
	import { resolve } from '$app/paths';
	import type { AuxeroVehicleTrust } from '$lib/auxero/detail';

	let { trust }: { trust: AuxeroVehicleTrust } = $props();
</script>

<aside class="daynight-pdp-trustbar" aria-label={trust.verdict}>
	<span class="daynight-pdp-trustbar__mark">
		<img src="/assets/icons/SealCheck.svg" alt="" aria-hidden="true" />
	</span>
	<span class="daynight-pdp-trustbar__text">
		<span class="daynight-pdp-trustbar__verdict">{trust.verdict}</span>
		<span class="daynight-pdp-trustbar__summary">{trust.summary}</span>
	</span>
	<span class="daynight-pdp-trustbar__providers">{trust.providers}</span>
	<a class="daynight-pdp-trustbar__link" href={resolve('/contact')}>
		{trust.reportLabel}
		<img src="/assets/icons/CaretCircleRight.svg" alt="" aria-hidden="true" />
	</a>
</aside>

<style>
	.daynight-pdp-trustbar {
		display: flex;
		align-items: center;
		gap: 14px;
		flex-wrap: wrap;
		margin-bottom: 24px;
		padding: 14px 18px;
		border: 1px solid var(--bc-border);
		border-left: 3px solid var(--bc-accent);
		border-radius: 8px;
		background: #ffffff;
	}

	.daynight-pdp-trustbar__mark {
		display: inline-flex;
		flex: 0 0 auto;
		align-items: center;
		justify-content: center;
		width: 34px;
		height: 34px;
		border-radius: 9px;
		background: #e4f0bf;
	}

	.daynight-pdp-trustbar__mark img {
		width: 19px;
		height: 19px;
	}

	.daynight-pdp-trustbar__text {
		display: flex;
		flex-direction: column;
		gap: 1px;
		min-width: 0;
		flex: 1 1 240px;
	}

	.daynight-pdp-trustbar__verdict {
		font-size: 14px;
		font-weight: 700;
		color: #1c1c1c;
	}

	.daynight-pdp-trustbar__summary {
		font-size: 12.5px;
		color: #4b4b4b;
		line-height: 1.4;
	}

	.daynight-pdp-trustbar__providers {
		flex: 0 0 auto;
		font-size: 11px;
		font-weight: 700;
		letter-spacing: 0.02em;
		color: #6f7d56;
		white-space: nowrap;
	}

	.daynight-pdp-trustbar__link {
		display: inline-flex;
		flex: 0 0 auto;
		align-items: center;
		gap: 5px;
		font-size: 13px;
		font-weight: 700;
		color: #b9161c;
		white-space: nowrap;
	}

	.daynight-pdp-trustbar__link img {
		width: 17px;
		height: 17px;
	}

	@media (hover: hover) and (pointer: fine) {
		.daynight-pdp-trustbar__link:hover {
			color: #1c1c1c;
		}
	}

	.daynight-pdp-trustbar__link:focus-visible {
		outline: 2px solid var(--bc-focus);
		outline-offset: 3px;
		border-radius: 6px;
	}

	@media (max-width: 575px) {
		.daynight-pdp-trustbar__providers {
			display: none;
		}
	}
</style>
