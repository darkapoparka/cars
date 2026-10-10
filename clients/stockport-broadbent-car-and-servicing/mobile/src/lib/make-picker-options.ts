/** Stock stays first; an optional catalog and out-of-stock selections remain searchable. */
export function showroomMakeOptions(
  availableMakes: readonly string[],
  selectedMakes: readonly string[] = [],
  query = '',
  catalogMakes: readonly string[] = [],
): string[] {
  const search = query.trim().toLocaleLowerCase();
  const names = [
    ...new Set(['Any', ...availableMakes, ...catalogMakes, ...selectedMakes].filter(Boolean)),
  ];
  return names.filter(
    (name) => !search || (name === 'Any' ? 'Any make' : name).toLocaleLowerCase().includes(search),
  );
}
