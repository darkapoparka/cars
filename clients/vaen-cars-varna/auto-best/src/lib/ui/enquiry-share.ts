export type EnquiryShareResult = 'shared' | 'copy' | 'unsupported-files' | 'cancelled' | 'failed';
type ShareCapabilities = Partial<Pick<Navigator, 'share' | 'canShare'>>;

/** Invoke from the click handler: do not await before the native share call. */
export async function shareEnquiry(data: ShareData, browser: ShareCapabilities = navigator): Promise<EnquiryShareResult> {
  try {
    if (data.files?.length && !browser.canShare?.({ files: data.files })) return 'unsupported-files';
    if (!browser.share) return 'copy';
    await browser.share(data);
    // Sharing is not a receipt or confirmation that the dealer received an enquiry.
    return 'shared';
  } catch (error) {
    return typeof error === 'object' && error !== null && 'name' in error && error.name === 'AbortError'
      ? 'cancelled' : 'failed';
  }
}
