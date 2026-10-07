import type { Handle } from "@sveltejs/kit/hooks";
import { dealer } from "./lib/content.ts";
import { brandingAttributes } from "./lib/branding.ts";

const branding = brandingAttributes(dealer);
export const handle: Handle = ({ event, resolve }) =>
  resolve(event, {
    transformPageChunk: ({ html }) =>
      html.replace(
        '<html lang="en"',
        `<html lang="${branding.locale}"${branding.style ? ` style="${branding.style}"` : ""}`,
      ),
  });
