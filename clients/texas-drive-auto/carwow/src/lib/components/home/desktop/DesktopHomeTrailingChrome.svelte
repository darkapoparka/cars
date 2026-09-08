<script lang="ts">
	function scrollTop() {
		window.scrollTo({ top: 0, behavior: 'smooth' });
	}
</script>

<button
	class="progress-wrap active-progress"
	type="button"
	aria-label="Back to home"
	onclick={scrollTop}
>
	<svg class="progress-circle svg-content" width="100%" height="100%" viewBox="-1 -1 102 102">
		<path
			d="M50,1 a49,49 0 0,1 0,98 a49,49 0 0,1 0,-98"
			style="transition: stroke-dashoffset 10ms linear 0s; stroke-dasharray: 307.919, 307.919; stroke-dashoffset: 286.138;"
		>
		</path>
	</svg>
	<img class="progress-wrap-icon" src="/assets/icons/top.svg" alt="top" />
</button>

<style>
	.progress-wrap {
		position: fixed;
		right: 30px;
		bottom: 30px;
		z-index: 100;
		display: flex;
		width: 50px;
		height: 50px;
		align-items: center;
		justify-content: center;
		border: 0;
		border-radius: 30px;
		background: #111827;
		box-shadow: inset 0 0 0 2px rgba(130, 130, 130, 0.2);
		color: #fff;
		cursor: pointer;
		opacity: 0;
		padding: 0;
		transform: translateY(20px);
		transition: all 300ms linear;
		visibility: hidden;
	}

	.progress-wrap.active-progress {
		opacity: 1;
		transform: translateY(0);
		visibility: visible;
	}

	.progress-wrap-icon {
		position: absolute;
		z-index: 1;
		width: 20px;
		height: 20px;
	}

	.progress-circle path {
		box-sizing: border-box;
		fill: none;
		stroke: #fff;
		stroke-width: 4;
		transition: all 0.4s linear;
	}
</style>
