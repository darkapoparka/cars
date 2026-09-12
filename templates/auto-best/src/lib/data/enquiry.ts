import { maximumVehicleYear, minimumVehicleYear } from '$config/discovery';

export type VehicleIdentityErrors = Partial<Record<'make' | 'model' | 'year', string>>;

/** Native required inputs accept spaces; validate the trimmed values as well. */
export function validateVehicleIdentity(make: string, model: string, allowUnspecified = false, year = '') {
  const values = { make: make.trim(), model: model.trim(), year: year.trim() };
  const errors: VehicleIdentityErrors = {};
  if (!allowUnspecified && !values.make) errors.make = 'Въведете марка.';
  if (!allowUnspecified && !values.model) errors.model = 'Въведете модел.';
  if (values.year && (!/^\d{4}$/.test(values.year) || Number(values.year) < minimumVehicleYear || Number(values.year) > maximumVehicleYear())) {
    errors.year = `Въведете година между ${minimumVehicleYear} и ${maximumVehicleYear()}.`;
  }
  return { values, errors };
}
