export function cleanFilterFormData(event: FormDataEvent) {
  for (const key of new Set(event.formData.keys())) {
    if (event.formData.getAll(key).every(value => typeof value === 'string' && !value.trim())) event.formData.delete(key);
  }
}
