/** Selected makes remain editable even when they are absent from current stock. */
export function showroomMakeOptions(
  availableMakes: readonly string[],
  selectedMakes: readonly string[] = [],
  query = '',
): string[] {
  const search = query.trim().toLocaleLowerCase();
  const names = [...new Set(['Any', ...availableMakes, ...selectedMakes].filter(Boolean))];
  return names.filter(
    (name) => !search || (name === 'Any' ? 'Any make' : name).toLocaleLowerCase().includes(search),
  );
}
