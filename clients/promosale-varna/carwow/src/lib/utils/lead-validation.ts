export type LeadIssue = { field: string; message: string };
export type SellVehicleDraft = {
	plate: string;
	vin: string;
	make: string;
	model: string;
	year: string;
	mileage: string;
};
export type ImportVehicleDraft = { sourceUrl: string; query: string; year: string; budget: string };
const compactNumber = (value: string) => value.replace(/\s/g, '');

export function isWholeAmount(value: string) {
	const compact = compactNumber(value);
	return /^\d+$/.test(compact) && Number.isSafeInteger(Number(compact));
}

function validateYear(value: string, currentYear: number): LeadIssue | null {
	if (!value.trim()) return null;
	const year = Number(value);
	return /^\d{4}$/.test(value.trim()) && year >= 1900 && year <= currentYear + 2
		? null
		: { field: 'year', message: `Въведете година между 1900 и ${currentYear + 2}.` };
}

export function validateSellVehicle(
	draft: SellVehicleDraft,
	currentYear = new Date().getFullYear()
): LeadIssue | null {
	const vin = draft.vin.trim().replace(/[\s-]/g, '').toUpperCase();
	if (vin && !/^[A-HJ-NPR-Z0-9]{17}$/.test(vin))
		return { field: 'vin', message: 'VIN трябва да е от 17 букви и цифри, без I, O и Q.' };
	if (
		draft.plate.trim() &&
		!/^[A-Za-zА-Яа-я0-9][A-Za-zА-Яа-я0-9\s-]{1,19}$/.test(draft.plate.trim())
	)
		return { field: 'plate', message: 'Проверете регистрационния номер (букви и цифри).' };
	if (!vin && !draft.plate.trim() && (!draft.make.trim() || !draft.model.trim()))
		return {
			field: draft.make.trim() ? 'model' : 'make',
			message: 'Добавете номер, VIN или поне марка и модел.'
		};
	for (const field of ['make', 'model'] as const)
		if (draft[field].length > 120) return { field, message: 'Въведете до 120 знака.' };
	const yearIssue = validateYear(draft.year, currentYear);
	if (yearIssue) return yearIssue;
	if (draft.mileage.trim() && !isWholeAmount(draft.mileage))
		return { field: 'mileage', message: 'Въведете пробег като положително цяло число или 0.' };
	return null;
}

export function validateImportVehicle(
	draft: ImportVehicleDraft,
	currentYear = new Date().getFullYear()
): LeadIssue | null {
	if (!draft.sourceUrl.trim() && !draft.query.trim())
		return { field: 'query', message: 'Добавете линк, VIN или описание на автомобила.' };
	if (draft.sourceUrl.trim()) {
		try {
			const url = new URL(draft.sourceUrl.trim());
			if (
				!['http:', 'https:'].includes(url.protocol) ||
				!url.hostname ||
				url.username ||
				url.password
			)
				throw new Error('url');
		} catch {
			return {
				field: 'sourceUrl',
				message: 'Добавете валиден линк, започващ с https:// или http://.'
			};
		}
	}
	const yearIssue = validateYear(draft.year, currentYear);
	if (yearIssue) return yearIssue;
	if (draft.budget.trim() && !isWholeAmount(draft.budget))
		return { field: 'budget', message: 'Въведете бюджет като цяло число в евро.' };
	return null;
}

export function validateLeadContact(value: string, phoneOnly = false): LeadIssue | null {
	const contact = value.trim();
	const email = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contact) && contact.length <= 180;
	const digits = contact.replace(/\D/g, '');
	const phone = /^\+?[\d\s().-]+$/.test(contact) && digits.length >= 7 && digits.length <= 15;
	return phone || (!phoneOnly && email)
		? null
		: {
				field: 'contact',
				message: phoneOnly
					? 'Въведете валиден телефон за обратна връзка.'
					: 'Въведете валиден телефон или имейл за обратна връзка.'
			};
}
