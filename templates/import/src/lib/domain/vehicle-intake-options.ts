import { importMakes } from '$lib/data/import-criteria';
import type { Vehicle } from '$lib/types/vehicle';

export type IntakeChoice = { value: string; label: string; flag?: string };
export type VehicleIntakeOptions = {
	makes: string[];
	modelsByMake: Record<string, string[]>;
};

export const emptyVehicleIntakeOptions: VehicleIntakeOptions = {
	makes: [...importMakes].sort(),
	modelsByMake: {}
};

export function vehicleIntakeOptions(
	stock: Pick<Vehicle, 'brand' | 'model'>[]
): VehicleIntakeOptions {
	const modelsByMake: Record<string, string[]> = {};
	for (const { brand, model } of stock) {
		if (!brand.trim() || !model.trim()) continue;
		const models = (modelsByMake[brand] ??= []);
		if (!models.includes(model)) models.push(model);
	}
	for (const models of Object.values(modelsByMake)) {
		models.sort((a, b) => a.localeCompare(b, undefined, { numeric: true }));
	}
	return {
		makes: [...new Set([...importMakes, ...Object.keys(modelsByMake)])].sort(),
		modelsByMake
	};
}
