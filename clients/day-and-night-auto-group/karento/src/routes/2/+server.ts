import { redirect } from "@sveltejs/kit";
import { resolve } from "$app/paths";
import type { RequestHandler } from "./$types";

/** Preserve bookmarked discovery searches and car links at the canonical Home. */
export const GET: RequestHandler = ({ url }) => {
  redirect(307, resolve("/") + url.search);
};
