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
		body: 'Body style',
		feature: 'Features',
		condition: 'Condition',
		Firstname: 'Your name',
		Lastname: 'Inquiry subject',
		SendInquiryname: 'Your name',
		SendInquiryemail: 'Email',
		SendInquiryphone: 'Phone',
		message: 'Message',
		FinancingCalculatorCarPrice: 'Vehicle price',
		FinancingCalculatorInterestRate: 'Buyer-arranged interest rate',
		FinancingCalculatorLoanTerm: 'Buyer-arranged loan term',
		FinancingCalculatorDownPayment: 'Down payment'
	};

	function translateTemplateLabels() {
		const labelMap = new Map([
			['Home', 'Home'],
			['Listing', 'Vehicles'],
			['Pages', 'More'],
			['All Brand', 'All makes'],
			['All Model', 'All models'],
			['All Miles', 'All mileage'],
			['All Price', 'All prices'],
			['All Fuel Type', 'All fuel types'],
			['All Transmission', 'All transmissions'],
			['All Body Style', 'All body styles'],
			['All Categories', 'All categories'],
			['All Branding', 'All makes'],
			['Filters', 'Filters'],
			['Lowest Price', 'Lowest price'],
			['No accidents', 'Accident history unverified'],
			['Great Price', 'Good price'],
			['REMOVE ALL', 'Clear'],
			['Remove All', 'Clear'],
			['Special', 'Featured'],
			['Compare', 'Compare'],
			['PREV', 'PREVIOUS'],
			['NEXT', 'NEXT'],
			['Play Video', 'Video overview'],
			['View All Photo', 'View all photos'],
			['View All Photos', 'View all photos'],
			['Write A Review', 'Add feedback'],
			['Write a review', 'Add feedback'],
			['Login To Add A Review', 'Sign in to add a review'],
			['Login to add a Review', 'Sign in to add a review'],
			['View More Reviews (98)', daynightSite.reviewLinkLabel],
			['View more reviews', daynightSite.reviewLinkLabel],
			['Chat via WhatsApp', 'Viber / WhatsApp'],
			['View details', 'View details'],
			['See Finance', 'Buyer-arranged funding'],
			['You might also like', 'Similar vehicles']
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
			'Field';
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
