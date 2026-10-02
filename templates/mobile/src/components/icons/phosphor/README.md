# Phosphor navigation icons

`navigation.ts` contains unmodified path data from the official Phosphor core
SVG assets. `ShowroomNavIcon.tsx` supplies the SVG wrapper and current color;
the icon geometry is unchanged. The adjacent `LICENSE` retains the MIT license.

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
at 24px. Inactive destinations use the regular glyph; the current destination
uses the filled glyph and showroom accent. No external icon font or new runtime
dependency is required.
