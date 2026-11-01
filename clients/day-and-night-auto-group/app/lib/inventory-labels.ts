/** Compact display names never replace the make stored in inventory or selection keys. */
export function displayMake(make: string): string {
  return /^mercedes(?:-|\s+)benz$/i.test(make.trim()) ? 'Mercedes' : make;
}

export function displayModelSelection(value: string): string {
  const separator = value.indexOf('::');
  return separator < 0 ? value : `${displayMake(value.slice(0, separator))} ${value.slice(separator + 2)}`;
}

/** Listing headlines can repeat the make or append import notes; stock data stays intact. */
export function vehicleCardModel(make: string, model: string): string {
  const aliases = /^mercedes(?:-|\s+)benz$/i.test(make.trim()) ? [make, 'Mercedes'] : [make];
  let label = model.trim();
  for (const alias of aliases) {
    const duplicate = label.toLocaleLowerCase().indexOf(' ' + alias.toLocaleLowerCase() + ' ');
    if (duplicate > 0) label = label.slice(0, duplicate);
  }
  const note = label.search(/\s+очакван(?:\s|$)/iu);
  if (note > 0) label = label.slice(0, note);
  return label.trim() || model;
}
