import type { VehicleIdentityErrors } from '$data/enquiry';

export function setIdentityValidity(form: HTMLFormElement, errors: VehicleIdentityErrors) {
  for (const name of ['make', 'model', 'year'] as const) {
    const field = form.elements.namedItem(name);
    if (field instanceof HTMLInputElement) field.setCustomValidity(errors[name] ?? '');
  }
}

export function clearIdentityError(event: Event, errors: VehicleIdentityErrors): VehicleIdentityErrors {
  const input = event.target;
  if (!(input instanceof HTMLInputElement) || !['make', 'model', 'year'].includes(input.name)) return errors;
  input.setCustomValidity('');
  const next = { ...errors };
  delete next[input.name as keyof VehicleIdentityErrors];
  return next;
}
