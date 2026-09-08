const multiValueQuickFields = new Set(['brand', 'model', 'feature']);

const compactQuickLabels: Record<string, Record<string, string>> = {
	price: {
		'under-10000': '≤ 10k EUR',
		'under-20000': '≤ 20k EUR',
		'under-30000': '≤ 30k EUR',
		'under-50000': '≤ 50k EUR',
		'over-50000': '> 50k EUR'
	},
	mileage: {
		'under-100000': '≤ 100k miles',
		'under-150000': '≤ 150k miles',
		'under-200000': '≤ 200k miles',
		'over-200000': '> 200k miles'
	},
	transmission: {
		Automatic: 'Automatic'
	}
};

export function isMultiValueQuickField(name: string | null | undefined) {
	return Boolean(name && multiValueQuickFields.has(name));
}

export function splitParamValues(values: string[]) {
	return Array.from(
		new Set(
			values
				.flatMap((value) => value.split(','))
				.map((value) => value.trim())
				.filter(Boolean)
		)
	);
}

export function getQuickSelectValues(select: HTMLSelectElement) {
	if (!isMultiValueQuickField(select.name)) {
		return select.value ? [select.value] : [];
	}

	return splitParamValues([select.dataset.daynightSelectedValues || select.value || '']);
}

export function setQuickSelectValues(select: HTMLSelectElement, values: string[]) {
	const nextValues = Array.from(new Set(values.filter(Boolean)));
	select.value = nextValues[0] ?? '';
	select.dataset.daynightSelectedValues = nextValues.join(',');
}

export function getQuickDisplayLabel(name: string, value: string, label: string) {
	return compactQuickLabels[name]?.[value] || label;
}

function quickSelectionSummary(name: string, labels: string[]) {
	if (!labels.length) return '';
	if (labels.length === 1) return labels[0];
	if (name === 'feature') return `${labels.length} features`;
	if (name === 'model') return `${labels.length} models`;
	if (labels.length === 2) return `${labels[0]} + ${labels[1]}`;
	return `${labels[0]} + more ${labels.length - 1}`;
}

export function syncQuickDropdown(dropdown: Element) {
	const select = dropdown.querySelector<HTMLSelectElement>('select');
	const valueLabel = dropdown.querySelector('[data-daynight-quick-value]');
	const trigger = dropdown.querySelector<HTMLElement>('.filter-select-dropdown__text');
	const clearButton = dropdown.querySelector<HTMLButtonElement>('[data-daynight-quick-clear]');
	if (!select || !valueLabel) {
		return;
	}

	const options = Array.from(
		dropdown.querySelectorAll<HTMLInputElement>('[data-daynight-quick-option]')
	);
	const selectedValues = getQuickSelectValues(select);
	const baseLabel = dropdown.getAttribute('data-name') || select.options[0]?.textContent || '';
	const placeholderLabel = dropdown.getAttribute('data-placeholder') || baseLabel;
	const selectedLabels = selectedValues.map((value) => {
		const option = Array.from(select.options).find((item) => item.value === value);
		return option?.textContent?.trim() || value;
	});
	const displayLabels = selectedValues.map((value, index) =>
		getQuickDisplayLabel(select.name, value, selectedLabels[index] || value)
	);
	const visibleLabel =
		selectedValues.length > 0
			? quickSelectionSummary(select.name, displayLabels)
			: placeholderLabel;
	const fullLabel =
		selectedValues.length > 0
			? quickSelectionSummary(select.name, selectedLabels)
			: placeholderLabel;

	valueLabel.textContent = visibleLabel;
	trigger?.setAttribute('aria-label', `${baseLabel}: ${fullLabel}`);
	trigger?.setAttribute('title', fullLabel);
	dropdown.classList.toggle('is-selected', selectedValues.length > 0);
	if (clearButton) {
		const hasSelection = selectedValues.length > 0;
		const clearLabel = hasSelection ? `Clear ${baseLabel}: ${fullLabel}` : `Clear ${baseLabel}`;
		clearButton.disabled = !hasSelection;
		clearButton.tabIndex = hasSelection ? 0 : -1;
		clearButton.setAttribute('aria-label', clearLabel);
		clearButton.setAttribute('title', clearLabel);
	}
	options.forEach((option) => {
		option.checked = option.value ? selectedValues.includes(option.value) : !selectedValues.length;
	});
}

export function syncQuickDropdowns(root: ParentNode = document) {
	root.querySelectorAll('[data-daynight-quick-dropdown]').forEach(syncQuickDropdown);
}

export function normalize(value: unknown) {
	return (value || '').toString().toLocaleLowerCase('en-US').trim();
}

export function normalizeCondition(value: unknown) {
	const normalized = normalize(value);
	if (['new', 'nov', 'novi', 'new', 'new', 'recently imported'].includes(normalized)) return 'new';
	if (['used', 'upotrebyavani', 'used', 'used'].includes(normalized)) {
		return 'used';
	}

	return '';
}

export function conditionLabel(value: string) {
	if (value === 'new') return 'New';
	if (value === 'used') return 'Used';
	return '';
}

export function priceMatches(price: number, value: string) {
	if (!value) return true;
	if (value === 'under-10000') return price > 0 && price <= 10000;
	if (value === 'under-20000') return price > 0 && price <= 20000;
	if (value === 'under-30000') return price > 0 && price <= 30000;
	if (value === 'under-50000') return price > 0 && price <= 50000;
	if (value === 'over-50000') return price > 50000;
	return true;
}

export function mileageMatches(mileage: number, value: string) {
	if (!value) return true;
	if (value === 'under-100000') return mileage > 0 && mileage <= 100000;
	if (value === 'under-150000') return mileage > 0 && mileage <= 150000;
	if (value === 'under-200000') return mileage > 0 && mileage <= 200000;
	if (value === 'over-200000') return mileage >= 200000;
	return true;
}
