<script lang="ts">
	import { resolve } from '$app/paths';
	import type { AuxeroVehicleTrust } from '$lib/auxero/detail';

	let { trust }: { trust: AuxeroVehicleTrust } = $props();
</script>

<aside class="eliqauto-pdp-trustbar" aria-label={trust.verdict}>
	<span class="eliqauto-pdp-trustbar__mark">
		<img src="/assets/icons/SealCheck.svg" alt="" aria-hidden="true" />
	</span>
	<span class="eliqauto-pdp-trustbar__text">
		<span class="eliqauto-pdp-trustbar__verdict">{trust.verdict}</span>
		<span class="eliqauto-pdp-trustbar__summary">{trust.summary}</span>
	</span>
	<span class="eliqauto-pdp-trustbar__providers">{trust.providers}</span>
	<a class="eliqauto-pdp-trustbar__link" href={resolve('/contact')}>
		{trust.reportLabel}
		<img src="/assets/icons/CaretCircleRight.svg" alt="" aria-hidden="true" />
	</a>
</aside>

<style>
	.eliqauto-pdp-trustbar {
		display: flex;
		align-items: center;
		gap: 14px;
		flex-wrap: wrap;
		margin-bottom: 24px;
		padding: 14px 18px;
		border: 1px solid #efdddd;
		border-left: 3px solid #a51717;
		border-radius: 8px;
		background: #ffffff;
	}

	.eliqauto-pdp-trustbar__mark {
		display: inline-flex;
		flex: 0 0 auto;
		align-items: center;
		justify-content: center;
		width: 34px;
		height: 34px;
		border-radius: 9px;
		background: var(--bc-accent-soft);
	}

	.eliqauto-pdp-trustbar__mark img {
		width: 19px;
		height: 19px;
	}

	.eliqauto-pdp-trustbar__text {
		display: flex;
		flex-direction: column;
		gap: 1px;
		min-width: 0;
		flex: 1 1 240px;
	}

	.eliqauto-pdp-trustbar__verdict {
		font-size: 14px;
		font-weight: 700;
		color: #2a0c0c;
	}

	.eliqauto-pdp-trustbar__summary {
		font-size: 12.5px;
		color: #4b4b4b;
		line-height: 1.4;
	}

	.eliqauto-pdp-trustbar__providers {
		flex: 0 0 auto;
		font-size: var(--bc-text-micro);
		font-weight: 700;
		letter-spacing: 0.02em;
		color: var(--bc-muted);
		white-space: nowrap;
	}

	.eliqauto-pdp-trustbar__link {
		display: inline-flex;
		flex: 0 0 auto;
		align-items: center;
		gap: 5px;
		font-size: 13px;
		font-weight: 700;
		color: #7a1212;
		white-space: nowrap;
	}

	.eliqauto-pdp-trustbar__link img {
		width: 17px;
		height: 17px;
	}

	@media (hover: hover) and (pointer: fine) {
		.eliqauto-pdp-trustbar__link:hover {
			color: #2a0c0c;
		}
	}

	.eliqauto-pdp-trustbar__link:focus-visible {
		outline: 2px solid #a51717;
		outline-offset: 3px;
		border-radius: 6px;
	}

	@media (max-width: 575px) {
		.eliqauto-pdp-trustbar__providers {
			display: none;
		}
	}
</style>
