export type ImportCostInputs = {
	price: number;
	transport: number;
	dutyRate: number;
	vatRate: number;
	prep: number;
};

/** Illustrative compatibility model, not a determination of applicable taxes or customs value. */
export function estimateImportCost(input: ImportCostInputs) {
	if (Object.values(input).some((value) => !Number.isFinite(value) || value < 0)) return null;
	if (input.dutyRate > 100 || input.vatRate > 100) return null;
	const duty = (input.price * input.dutyRate) / 100;
	const vat = ((input.price + input.transport + duty) * input.vatRate) / 100;
	return { duty, vat, total: input.price + input.transport + duty + vat + input.prep };
}
