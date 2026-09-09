<script lang="ts">
	function setupStaticHero() {
		let tries = 0;
		const freeze = () => {
			const slider = document.querySelector('.page-title--slider') as
				| (HTMLElement & {
						swiper?: {
							autoplay?: { stop: () => void };
							params?: { autoplay?: { enabled: boolean } };
						};
				  })
				| null;
			const swiper = slider?.swiper;
			if (!swiper) return false;
			swiper.autoplay?.stop();
			if (swiper.params?.autoplay) swiper.params.autoplay.enabled = false;
			return true;
		};
		if (freeze()) return () => {};
		const interval = window.setInterval(() => {
			if (freeze() || ++tries > 50) window.clearInterval(interval);
		}, 100);
		return () => window.clearInterval(interval);
	}

	$effect(() => {
		const cleanupHero = setupStaticHero();

		return () => {
			cleanupHero();
		};
	});
</script>
