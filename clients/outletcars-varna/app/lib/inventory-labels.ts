/** Compact display names never replace the make stored in inventory or selection keys. */
export function displayMake(make: string): string {
  return /^mercedes(?:-|\s+)benz$/i.test(make.trim()) ? 'Mercedes' : make;
}

export function displayModelSelection(value: string): string {
  const separator = value.indexOf('::');
  return separator < 0 ? value : `${displayMake(value.slice(0, separator))} ${value.slice(separator + 2)}`;
}
