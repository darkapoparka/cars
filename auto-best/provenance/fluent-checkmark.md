# Desktop selection checkmark

Home and inventory desktop choices and selected model-family indicators share
`src/lib/components/ui/CheckmarkIcon.svelte`. This renders the official Microsoft
Fluent System Icons **Checkmark, native 24px Regular**, at the shared 18px control
icon size. Selection slots remain 20px. Unchecked multiple choices use a 4px
rounded frame; selected choices show the same unboxed charcoal tick as family
rows. Single choices retain their round radio indicator.

- Upstream commit: `a563cf9166f4f91aa617557ed272612b7f0a2f72`.
- Original [library SVG](https://raw.githubusercontent.com/microsoft/fluentui-system-icons/a563cf9166f4f91aa617557ed272612b7f0a2f72/assets/Checkmark/SVG/ic_fluent_checkmark_24_regular.svg).
- Original SVG SHA-256: `643b76be6638a22b348c14990f0957335fbe98b39e9adb7ba7b4dc86b6745177`.
- Geometry SHA-256, serialized as `{viewBox,paths}`:
  `4a41f837782a6e281e62fb88a06853ff1e6fdc01d97beb2222806360c7a11011`.
- Existing [MIT license](fluent-icons-LICENSE.txt) and [upstream notice](fluent-icons-NOTICE.txt).

Only the original fixed paint color is replaced with `currentColor`. The native
view box and path are unchanged; no additional strokes or package dependency
are added. Real checkbox/radio inputs continue to own keyboard behavior, focus,
labels and selection. Forced-color mode retains native inputs. Mobile navigation
continues through its separate [Fluent renderer](fluent-icons.md).
