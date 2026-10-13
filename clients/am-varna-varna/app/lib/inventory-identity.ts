/** Shared comparison keys preserve display spelling and ignore surrounding whitespace. */
export const inventoryNameKey = (value: string) => value.trim().toLowerCase();
export function inventoryModelKey(value: string) {
  const separator = value.indexOf('::');
  return separator < 0 ? inventoryNameKey(value) : `${inventoryNameKey(value.slice(0, separator))}::${inventoryNameKey(value.slice(separator + 2))}`;
}
