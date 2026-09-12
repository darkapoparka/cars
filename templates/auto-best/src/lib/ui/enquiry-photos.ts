export type EnquiryPhoto = { file: File; url: string };
export type PhotoMessages = { type: string; size: string; count: string };

/** Files stay local; object URLs belong to the mounted enquiry, not a store. */
export function appendEnquiryPhotos(current: readonly EnquiryPhoto[], files: Iterable<File>, messages: PhotoMessages) {
  const photos = [...current];
  let error = '';
  for (const file of files) {
    if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type) || !file.size) { error = messages.type; continue; }
    if (file.size > 10 * 1024 * 1024) { error = messages.size; continue; }
    if (photos.some(photo => photo.file.name === file.name && photo.file.size === file.size && photo.file.lastModified === file.lastModified)) continue;
    if (photos.length >= 6) { error = messages.count; break; }
    photos.push({ file, url: URL.createObjectURL(file) });
  }
  return { photos, error };
}

export function removeEnquiryPhoto(photos: readonly EnquiryPhoto[], url: string) {
  URL.revokeObjectURL(url);
  return photos.filter(photo => photo.url !== url);
}
export const releaseEnquiryPhotos = (photos: readonly EnquiryPhoto[]) => photos.forEach(photo => URL.revokeObjectURL(photo.url));
