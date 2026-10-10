/** Local preview resources only: no uploads, persistence or shared visitor state. */
export type EnquiryPhoto = { file: File; url: string };
export type EnquiryPhotoError = 'type' | 'size' | 'limit' | '';
type ObjectUrls = Pick<typeof URL, 'createObjectURL' | 'revokeObjectURL'>;
const acceptedTypes = new Set(['image/jpeg', 'image/png', 'image/webp']);
const maximumBytes = 10 * 1024 * 1024;
const maximumPhotos = 6;

/** Preserve selection order and existing previews; allocate each accepted file once. */
export function appendEnquiryPhotos(current: readonly EnquiryPhoto[], files: Iterable<File>, urls: ObjectUrls = URL) {
  const photos = [...current];
  let error: EnquiryPhotoError = '';
  try {
    for (const file of files) {
      if (!acceptedTypes.has(file.type)) { error = 'type'; continue; }
      if (file.size > maximumBytes) { error = 'size'; continue; }
      if (photos.some(photo => photo.file.name === file.name && photo.file.size === file.size && photo.file.lastModified === file.lastModified)) continue;
      if (photos.length >= maximumPhotos) { error = 'limit'; break; }
      photos.push({ file, url: urls.createObjectURL(file) });
    }
  } catch (cause) {
    // The caller never receives partial state: release only this attempt's allocations.
    releaseEnquiryPhotos(photos.slice(current.length), urls);
    throw cause;
  }
  return { photos, error };
}

export function removeEnquiryPhoto(photos: readonly EnquiryPhoto[], url: string, urls: ObjectUrls = URL): EnquiryPhoto[] {
  if (photos.some(photo => photo.url === url)) urls.revokeObjectURL(url);
  return photos.filter(photo => photo.url !== url);
}

export function releaseEnquiryPhotos(photos: readonly EnquiryPhoto[], urls: ObjectUrls = URL): void {
  for (const photo of photos) urls.revokeObjectURL(photo.url);
}
