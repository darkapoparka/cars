import {vehicles} from './data';
import {inventoryNameKey, inventoryModelKey} from './inventory-identity';

const referenceMakes = ['Nissan', 'Toyota', 'Mitsubishi', 'MG', 'Mercedes-Benz', 'BMW', 'Ford', 'Chevrolet', 'Hyundai', 'Kia', 'Jeep', 'JAC', 'Mazda', 'Honda', 'Suzuki', 'Audi', 'Volkswagen', 'Lexus', 'Renault', 'Volvo', 'Land Rover', 'Infiniti', 'Peugeot', 'Porsche', 'Haval', 'Tesla', 'GMC', 'Dodge', 'Mini', 'Jaguar'];
// Every make offered by the brand strip must also be selectable in the filters.
export function buildInventoryOptions(stock: readonly {make: string; model: string}[]) {
  const namesByMake = new Map(referenceMakes.map(make => [inventoryNameKey(make), make]));
  for (const {make} of stock) if (make.trim() && !namesByMake.has(inventoryNameKey(make))) namesByMake.set(inventoryNameKey(make), make.trim());
  const canonicalMake = (make: string) => namesByMake.get(inventoryNameKey(make)) ?? make.trim();
  const filterMakes = [...namesByMake.values()];
  const models = new Map<string, {make: string; model: string}>();
  for (const vehicle of stock) {
    const key = inventoryModelKey(`${vehicle.make}::${vehicle.model}`);
    if (!models.has(key)) models.set(key, {make: canonicalMake(vehicle.make), model: vehicle.model.trim()});
  }
  const modelChoices = [...models.values()]
    .sort((a, b) => a.make.localeCompare(b.make, 'en') || a.model.localeCompare(b.model, 'en'));
  return {canonicalMake, filterMakes, modelChoices};
}
export const {canonicalMake, filterMakes, modelChoices} = buildInventoryOptions(vehicles);
export const modelKey = (make: string, model: string) => `${make}::${model}`;
export const modelBelongsToMake = (model: string, make: string) => inventoryNameKey(model.split('::')[0]) === inventoryNameKey(make);
export const hasModel = (models: string[], value: string) => models.some(model => inventoryModelKey(model) === inventoryModelKey(value));
export const toggleModelSelection = (models: string[], value: string) => hasModel(models, value) ? models.filter(model => inventoryModelKey(model) !== inventoryModelKey(value)) : [...models, value];
