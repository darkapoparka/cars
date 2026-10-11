export type ShareResult = "shared" | "copied" | "cancelled" | "unavailable";
export interface SharePlatform {
  readonly share?: (data: { title: string; url: string }) => Promise<void>;
  readonly writeText?: (text: string) => Promise<void>;
}

/** A result describes what the browser actually did; cancellation is silent. */
export async function shareVehiclePage(
  url: string,
  title: string,
  platform: SharePlatform,
): Promise<ShareResult> {
  try {
    if (platform.share) {
      await platform.share({ title, url });
      return "shared";
    }
    if (platform.writeText) {
      await platform.writeText(url);
      return "copied";
    }
  } catch (error) {
    if (error instanceof Error && error.name === "AbortError")
      return "cancelled";
  }
  return "unavailable";
}
