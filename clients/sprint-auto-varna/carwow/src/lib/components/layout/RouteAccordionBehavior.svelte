<script lang="ts">
	function setupRouteAccordions() {
		const accordions = Array.from(
			document.querySelectorAll<HTMLElement>('.flat-accordion:not([data-daynight-native-accordion])')
		);
		if (!accordions.length) {
			return () => {};
		}

		const controller = new AbortController();
		const setToggleState = (toggle: HTMLElement, isOpen: boolean) => {
			const title = toggle.querySelector<HTMLElement>('.toggle-title');
			const content = toggle.querySelector<HTMLElement>('.toggle-content');

			toggle.classList.toggle('active', isOpen);
			title?.classList.toggle('active', isOpen);
			if (content) {
				content.style.display = isOpen ? 'block' : 'none';
			}
		};

		accordions.forEach((accordion) => {
			const toggles = Array.from(accordion.querySelectorAll<HTMLElement>('.flat-toggle'));

			toggles.forEach((toggle) => {
				const title = toggle.querySelector<HTMLElement>('.toggle-title');
				const content = toggle.querySelector<HTMLElement>('.toggle-content');
				if (!title || !content) {
					return;
				}

				const isInitiallyOpen =
					toggle.classList.contains('active') ||
					title.classList.contains('active') ||
					content.style.display === 'block';
				setToggleState(toggle, isInitiallyOpen);
				title.setAttribute('role', 'button');
				title.tabIndex = 0;
				title.addEventListener(
					'click',
					(event) => {
						event.preventDefault();
						event.stopImmediatePropagation();
						const shouldOpen =
							!toggle.classList.contains('active') && !title.classList.contains('active');

						toggles.forEach((item) => setToggleState(item, false));
						if (shouldOpen) {
							setToggleState(toggle, true);
						}
					},
					{ signal: controller.signal, capture: true }
				);
				title.addEventListener(
					'keydown',
					(event) => {
						if (event.key !== 'Enter' && event.key !== ' ') {
							return;
						}

						event.preventDefault();
						title.click();
					},
					{ signal: controller.signal }
				);
			});
		});

		return () => controller.abort();
	}

	$effect(() => setupRouteAccordions());
</script>
