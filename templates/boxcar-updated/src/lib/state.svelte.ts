import { vehicles } from "./catalog";
import { validatedIds } from "./domain";
const known = vehicles.map((v) => v.id);
function read(key: string) {
  try {
    return validatedIds(JSON.parse(localStorage.getItem(key) || "[]"), known);
  } catch {
    return [];
  }
}
export const selections = $state({
  favorites: read("boxcar-updated-favorites"),
  compare: read("boxcar-updated-compare").slice(0, 4),
  notice: "",
});
let timer: ReturnType<typeof setTimeout>;
export function notify(message: string) {
  clearTimeout(timer);
  selections.notice = message;
  timer = setTimeout(() => {
    selections.notice = "";
  }, 4500);
}
function persist(kind: "favorites" | "compare") {
  try {
    localStorage.setItem(
      `boxcar-updated-${kind}`,
      JSON.stringify(selections[kind]),
    );
  } catch {
    notify(
      "Your selection is available for this visit. Browser storage is unavailable.",
    );
  }
}
export function toggleFavorite(id: string) {
  if (!known.includes(id)) return;
  const saved = selections.favorites.includes(id);
  selections.favorites = saved
    ? selections.favorites.filter((x) => x !== id)
    : [...selections.favorites, id];
  persist("favorites");
  notify(saved ? "Removed from saved cars." : "Added to saved cars.");
}
export function toggleCompare(id: string) {
  if (!known.includes(id)) return;
  if (selections.compare.includes(id))
    selections.compare = selections.compare.filter((x) => x !== id);
  else {
    if (selections.compare.length >= 4) {
      notify("Compare up to four cars. Remove one to add another.");
      return;
    }
    selections.compare = [...selections.compare, id];
  }
  persist("compare");
}
export function clearCompare() {
  selections.compare = [];
  persist("compare");
}
export function syncSelections(event: StorageEvent) {
  if (event.key === "boxcar-updated-favorites")
    selections.favorites = read(event.key);
  if (event.key === "boxcar-updated-compare")
    selections.compare = read(event.key).slice(0, 4);
}
