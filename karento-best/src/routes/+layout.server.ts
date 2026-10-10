import type { LayoutServerLoad } from "./$types";
import { resolve } from "$app/paths";
export const load: LayoutServerLoad = ({ locals, url }) => {
  // Reading lang makes SvelteKit invalidate this server data on client locale navigation.
  url.searchParams.get("lang");
  return {
    locale: locals.locale,
    mount: new URL(resolve(""), url).pathname.replace(/\/$/, ""),
  };
};
