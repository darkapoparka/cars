import type { Reroute } from '@sveltejs/kit';
import { isResource, routeParts } from '$lib/locale/core';
/** Pure URL-only mapping; never reads cookies or shared state. */
export const reroute: Reroute = ({ url }) => {
  const parts = routeParts(url.pathname);
  if (parts.locale && !isResource(url.pathname)) return parts.base + parts.path;
};
