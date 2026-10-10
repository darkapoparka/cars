import type { MessageKey, MessageValues } from "./schema.ts";

export type PlainMessageKey = {
  [Key in MessageKey]: keyof MessageValues<Key> extends never ? Key : never;
}[MessageKey];
/** UI references use catalog IDs. Literal strings remain available for business facts. */
export type CatalogText = string | { readonly message: PlainMessageKey };
export const message = <Key extends PlainMessageKey>(
  key: Key,
): { readonly message: Key } => ({ message: key });
