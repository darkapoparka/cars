<script lang="ts">
	import { SvelteURLSearchParams } from 'svelte/reactivity';
	import { lockBodyScroll, unlockBodyScroll } from '$lib/utils/body-scroll-lock';

	function go(url: string) {
		window.location.href = url;
	}

	function closeHeaderSearch() {
		const form = document.querySelector<HTMLElement>('#searchForm.daynight-header-search');
		const toggle = document.querySelector<HTMLElement>('#searchToggle');
		const wrapper = toggle?.closest<HTMLElement>('.header-search-wrapper');
		const wasOpen = Boolean(
			form?.classList.contains('active') ||
			form?.classList.contains('is-active') ||
			wrapper?.classList.contains('is-open') ||
			toggle?.getAttribute('aria-expanded') === 'true'
		);

		form?.classList.remove('active');
		form?.classList.remove('is-active');
		form?.setAttribute('aria-hidden', 'true');
		wrapper?.classList.remove('is-open');
		toggle?.setAttribute('aria-expanded', 'false');
		if (wasOpen) {
			unlockBodyScroll();
		}
	}

	function openHeaderSearch() {
		const form = document.querySelector<HTMLElement>('#searchForm.daynight-header-search');
		const toggle = document.querySelector<HTMLElement>('#searchToggle');
		const wrapper = toggle?.closest<HTMLElement>('.header-search-wrapper');

		if (!form) {
			go('/inventory');
			return;
		}

		const wasOpen = Boolean(
			form.classList.contains('active') ||
			form.classList.contains('is-active') ||
			wrapper?.classList.contains('is-open') ||
			toggle?.getAttribute('aria-expanded') === 'true'
		);

		form.classList.add('active');
		form.setAttribute('aria-hidden', 'false');
		wrapper?.classList.add('is-open');
		toggle?.setAttribute('aria-expanded', 'true');
		if (!wasOpen) {
			lockBodyScroll();
		}
	}

	function toggleHeaderSearch() {
		const form = document.querySelector<HTMLElement>('#searchForm.daynight-header-search');
		if (form?.classList.contains('active')) {
			closeHeaderSearch();
			return;
		}

		openHeaderSearch();
	}

	function headerSearchPath(form: HTMLFormElement) {
		const query = (new FormData(form).get('q') || '').toString().trim();
		const params = new SvelteURLSearchParams();
		if (query) {
			params.set('q', query);
		}

		const serialized = params.toString();
		return serialized ? `/inventory?${serialized}` : '/inventory';
	}

	function heroSearchPath(root: Element | null) {
		const params = new SvelteURLSearchParams();
		const activeType = root?.querySelector<HTMLElement>('.search-cars__type-option.active');
		const condition = activeType?.dataset.vehicleCondition ?? '';
		if (condition && condition !== 'all') {
			params.set('condition', condition);
		}

		root?.querySelectorAll<HTMLSelectElement>('select[name]').forEach((field) => {
			if (field.value) {
				params.set(field.name, field.value);
			}
		});

		const searchInput = root?.querySelector<HTMLInputElement>('input[name="q"]');
		if (searchInput?.value.trim()) {
			params.set('q', searchInput.value.trim());
		}

		const serialized = params.toString();
		return serialized ? `/inventory?${serialized}` : '/inventory';
	}

	function showSendInquiryStatus(form: HTMLFormElement) {
		let status = form.querySelector('.daynight-form-status');
		if (!status) {
			status = document.createElement('p');
			status.className = 'daynight-form-status text-highlight font-weight-600 mt-12';
			form.append(status);
		}
		status.textContent = 'Запитването е изпратено локално';
	}

	function isInquiryForm(form: HTMLFormElement) {
		if (form.dataset.daynightLiveLead === 'true') return false;
		if (form.matches('.send-inquiry')) return true;

		return Boolean(
			form.querySelector('[name="Firstname"], [name="SendInquiryname"]') &&
			form.querySelector('[name="SendInquiryemail"]') &&
			form.querySelector('[name="message"]')
		);
	}

	function handleDocumentClick(event: MouseEvent) {
		const target = event.target;
		if (!(target instanceof Element)) {
			return;
		}

		const searchToggle = target.closest('#searchToggle');
		if (searchToggle) {
			event.preventDefault();
			toggleHeaderSearch();
			return;
		}

		if (target.closest('#searchModalClose')) {
			event.preventDefault();
			closeHeaderSearch();
			return;
		}

		if (target.classList.contains('search-modal__overlay')) {
			closeHeaderSearch();
			return;
		}

		if (target.closest('.daynight-header-search')) {
			return;
		}

		closeHeaderSearch();

		const typeOption = target.closest<HTMLElement>('.search-cars__type-option');
		if (typeOption) {
			event.preventDefault();
			const group = typeOption.closest('.search-cars__type');
			group?.querySelectorAll<HTMLElement>('.search-cars__type-option').forEach((option) => {
				const isActive = option === typeOption;
				option.classList.toggle('active', isActive);
				option.setAttribute('aria-pressed', isActive ? 'true' : 'false');
			});
			return;
		}

		const sendInquiryButton = target.closest<HTMLButtonElement>('form button');
		const sendInquiryForm = sendInquiryButton?.closest<HTMLFormElement>('form');
		if (sendInquiryForm && isInquiryForm(sendInquiryForm)) {
			if (!sendInquiryForm.reportValidity()) {
				return;
			}

			event.preventDefault();
			showSendInquiryStatus(sendInquiryForm);
			return;
		}

		const modalTrigger = target.closest<HTMLElement>('.open-modal[data-modal-id]');
		const modalId = modalTrigger?.dataset.modalId ?? '';
		if (modalId.includes('LoginModal') || modalId.includes('SignUpModal')) {
			event.preventDefault();
			go('/admin');
			return;
		}

		if (modalId.includes('ForgotPasswordModal')) {
			event.preventDefault();
			go('/admin/settings');
			return;
		}

		if (modalId.includes('CompareModal') || modalId.includes('СравниModal')) {
			event.preventDefault();
			go('/compare');
			return;
		}

		if (modalId.includes('CardModal')) {
			event.preventDefault();
			go('/inventory');
			return;
		}

		const searchButton = target.closest('.search-cars__search');
		if (
			searchButton &&
			!searchButton.closest('[data-daynight-inventory-filter]') &&
			!searchButton.hasAttribute('data-daynight-inventory-search-action')
		) {
			event.preventDefault();
			go(heroSearchPath(searchButton.closest('.search-cars')));
			return;
		}

		const listingLink = target.closest('.card-box a, .view-details');
		if (
			listingLink instanceof HTMLAnchorElement &&
			/listing-details/i.test(listingLink.getAttribute('href') || '')
		) {
			event.preventDefault();
			go('/inventory/chrysler-300c-2018-gaz');
		}
	}

	function handleDocumentKeydown(event: KeyboardEvent) {
		const target = event.target;
		if (
			target instanceof Element &&
			target.closest('#searchToggle') &&
			(event.key === 'Enter' || event.key === ' ')
		) {
			event.preventDefault();
			toggleHeaderSearch();
			return;
		}

		if (event.key === 'Escape') {
			closeHeaderSearch();
		}
	}

	function handleDocumentSubmit(event: SubmitEvent) {
		const form = event.target;
		if (!(form instanceof HTMLFormElement)) {
			return;
		}

		if (form.matches('.daynight-header-search-form')) {
			event.preventDefault();
			closeHeaderSearch();
			go(headerSearchPath(form));
			return;
		}

		if (!isInquiryForm(form)) {
			return;
		}

		event.preventDefault();
		showSendInquiryStatus(form);
	}
</script>

<svelte:document
	onclick={handleDocumentClick}
	onkeydown={handleDocumentKeydown}
	onsubmit={handleDocumentSubmit}
/>

<style>
	:global([data-daynight-hero-search-box] .filter-select-dropdown__menu) {
		background: #fff;
		border: 1px solid #e5e7eb;
		border-radius: 12px;
		box-shadow: 0 24px 60px rgba(15, 23, 42, 0.22);
		opacity: 0 !important;
		overflow: hidden;
		pointer-events: none;
		transform: translateY(8px) !important;
		visibility: hidden !important;
		z-index: 1000 !important;
	}

	:global(
		[data-daynight-hero-search-box] .filter-select-dropdown.active > .filter-select-dropdown__menu
	),
	:global(
		[data-daynight-hero-search-box]
			.filter-select-dropdown:has(.filter-select-dropdown__toggle:checked)
			> .filter-select-dropdown__menu
	) {
		opacity: 1 !important;
		pointer-events: auto;
		transform: translateY(0) !important;
		visibility: visible !important;
	}
</style>
