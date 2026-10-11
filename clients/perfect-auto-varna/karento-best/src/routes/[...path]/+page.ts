import { error } from "@sveltejs/kit";
import { resolveRoute } from "#lib/routes.ts";
import type { PageLoad } from "./$types";
import type { Component } from "svelte";
const components = import.meta.glob<{ default: Component }>(
  "/src/lib/pages/*.svelte",
);
export const load: PageLoad = async ({ params }) => {
  const key = resolveRoute(params.path || "");
  if (!key) error(404, "Page not found");
  const loaded = await components["/src/lib/pages/" + key + ".svelte"]();
  return { key, component: loaded.default };
};
