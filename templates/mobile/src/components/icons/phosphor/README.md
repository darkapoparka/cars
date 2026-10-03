# Phosphor navigation icons

`navigation.ts` retains unmodified path data from the official Phosphor core
SVG assets used by the former bottom bar. The adjacent `LICENSE` retains the
MIT license. The floating dock now uses the installed `lucide-react` package
through `ShowroomNavIcon.tsx`; these paths are preserved as source provenance.

Reviewed on 2 October 2026. Pinned upstream commit:
`2b75f3ad12b420c9504ef05df8d2564a28f8500e`.

Source: <https://github.com/phosphor-icons/core/tree/2b75f3ad12b420c9504ef05df8d2564a28f8500e>.

| Destination | Upstream icon    | Weights        |
| ----------- | ---------------- | -------------- |
| Cars        | car              | regular / fill |
| Services    | wrench           | regular / fill |
| Contact     | chat-circle-dots | regular / fill |

Regular assets are under `assets/regular/<name>.svg`. Filled assets are under
`assets/fill/<name>-fill.svg`. All use the original 256-unit viewBox and render
at 24px in the former bar. Inactive destinations used the regular glyph; the
current destination used the filled glyph and showroom accent.
