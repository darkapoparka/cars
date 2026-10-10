import type { en } from "./catalogs/en.ts";

export type MessageKey = keyof typeof en;
export type MessageCatalog = { readonly [Key in MessageKey]: string };
type Tokens<Text extends string> =
  Text extends `${string}{${infer Name}}${infer Rest}`
    ? Name | Tokens<Rest>
    : never;
export type MessageValues<Key extends MessageKey> = {
  readonly [Name in Tokens<(typeof en)[Key]>]: string | number;
};
export type MessageArguments<Key extends MessageKey> =
  keyof MessageValues<Key> extends never
    ? [values?: MessageValues<Key>]
    : [values: MessageValues<Key>];
export type Translator = <Key extends MessageKey>(
  key: Key,
  ...args: MessageArguments<Key>
) => string;
