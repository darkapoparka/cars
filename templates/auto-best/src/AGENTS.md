# Source notes

See [Architecture](../ARCHITECTURE.md) and [Components](../docs/COMPONENTS.md) for ownership.

Routes assemble pages and load URL data. Components render the interface and own local interaction state. Config/data modules supply identity, records and shared domain functions; browser helpers live in `lib/ui`.

Use typed Svelte 5 props, derived values and snippets. Keep applied filters in URLs and drafts local to their dialog. Release browser resources when their owner unmounts.

Use the existing component or route style owner and [Styling](../docs/STYLING.md). Preserve the current appearance during code-only refactors.
