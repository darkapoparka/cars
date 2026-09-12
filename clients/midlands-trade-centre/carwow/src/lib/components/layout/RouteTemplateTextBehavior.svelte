<script lang="ts">
	import { onMount } from 'svelte';
	import { daynightSite } from '$lib/data/daynight-site';

	const inferredFieldLabels: Record<string, string> = {
		brand: 'Make',
		model: 'Model',
		price: 'Price',
		mileage: 'Mileage',
		fuel: 'Fuel',
		transmission: 'Transmission',
		body: 'Каросерия',
		feature: 'Features',
		condition: 'Condition',
		Firstname: 'Вашето име',
		Lastname: 'Тема на запитването',
		SendInquiryname: 'Вашето име',
		SendInquiryemail: 'Email',
		SendInquiryphone: 'Phone',
		message: 'Message',
		FinancingCalculatorCarPrice: 'Цена на автомобила',
		FinancingCalculatorInterestRate: 'Лихвен процент',
		FinancingCalculatorLoanTerm: 'Срок на лизинга',
		FinancingCalculatorDownPayment: 'Initial payment'
	};

	function translateTemplateLabels() {
		const labelMap = new Map([
			['Home', 'Home'],
			['Listing', 'Vehicles'],
			['Pages', 'Още'],
			['All Brand', 'All makes'],
			['All Model', 'All models'],
			['All Miles', 'Всички пробези'],
			['All Price', 'Всички цени'],
			['All Fuel Type', 'Всички горива'],
			['All Transmission', 'Всички скорости'],
			['All Body Style', 'Всички каросерии'],
			['All Categories', 'Всички категории'],
			['All Branding', 'All makes'],
			['Filters', 'Filters'],
			['Lowest Price', 'Lowest price'],
			['No accidents', 'Без удари'],
			['Great Price', 'Добра цена'],
			['REMOVE ALL', 'Clear'],
			['Remove All', 'Clear'],
			['Special', 'Специално'],
			['Compare', 'Сравни'],
			['PREV', 'ПРЕДИШНА'],
			['NEXT', 'СЛЕДВАЩА'],
			['Play Video', 'Видео преглед'],
			['View All Photo', 'Виж всички снимки'],
			['View All Photos', 'Виж всички снимки'],
			['Write A Review', 'Добавете отзив'],
			['Write a review', 'Добавете отзив'],
			['Login To Add A Review', 'Вход за добавяне на отзив'],
			['Login to add a Review', 'Вход за добавяне на отзив'],
			['View More Reviews (98)', daynightSite.reviewLinkLabel],
			['View more reviews', daynightSite.reviewLinkLabel],
			['Chat via WhatsApp', 'Viber / WhatsApp'],
			['View details', 'View details'],
			['See Finance', 'Buying options'],
			['You might also like', 'Подобни автомобили']
		]);

		document.querySelectorAll('a, span, button, option, p, div, .current').forEach((element) => {
			element.childNodes.forEach((node) => {
				if (node.nodeType !== Node.TEXT_NODE || !node.textContent) {
					return;
				}

				const current = node.textContent.trim();
				const translated = labelMap.get(current);
				if (translated) {
					node.textContent = node.textContent.replace(current, translated);
				}

				if (/\bVehicles\b/.test(node.textContent)) {
					node.textContent = node.textContent.replaceAll('Vehicles', 'vehicles');
				}
			});
		});
	}

	function hasFieldLabel(field: HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement) {
		if (field.closest('label')) return true;
		if (field.getAttribute('aria-label') || field.getAttribute('aria-labelledby')) return true;
		const id = field.getAttribute('id');
		return Boolean(id && document.querySelector(`label[for="${CSS.escape(id)}"]`));
	}

	function inferFieldLabel(field: HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement) {
		const name = field.getAttribute('name') || '';
		const fallback =
			field.getAttribute('placeholder') ||
			(field instanceof HTMLSelectElement ? field.options[0]?.textContent : '') ||
			field.closest<HTMLElement>('[data-name]')?.dataset.name ||
			'Поле';
		return (inferredFieldLabels[name] || fallback).replace(/\*/g, '').trim();
	}

	function ensureTemplateFieldLabels() {
		document
			.querySelectorAll<
				HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
			>('input, select, textarea')
			.forEach((field) => {
				if (field.type === 'hidden' || hasFieldLabel(field)) {
					return;
				}

				field.setAttribute('aria-label', inferFieldLabel(field));
			});
	}

	function syncTemplateText() {
		translateTemplateLabels();
		ensureTemplateFieldLabels();
	}

	onMount(() => {
		syncTemplateText();

		const timers = [
			window.setTimeout(syncTemplateText, 250),
			window.setTimeout(syncTemplateText, 1000)
		];
		const observer = new MutationObserver(syncTemplateText);
		observer.observe(document.body, { characterData: true, childList: true, subtree: true });

		return () => {
			timers.forEach((timer) => window.clearTimeout(timer));
			observer.disconnect();
		};
	});
</script>
