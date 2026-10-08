/** Make and Model are two steps of the same pending vehicle selection. */
export function continuesIdentityPicker(from: string | undefined, to: string | undefined): boolean {
  return from === 'make' && to === 'model' || from === 'model' && to === 'make';
}
