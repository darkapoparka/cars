# Dock car icon

The dock uses Google's Material Icons Outlined `directions_car` artwork under Apache-2.0.

- Source: https://github.com/google/material-design-icons/blob/master/src/maps/directions_car/materialiconsoutlined/24px.svg
- Source blob: `b478e14817983270f47077bac62152ae345e5b4c`
- License: [material-design-icons.txt](material-design-icons.txt)

The original paths are retained in `components/ShowroomIcon.tsx`, adapted to React and `currentColor`. The viewBox starts at y=1 to center the painted shape in the dock. Only the dock uses this icon; other car icon consumers retain their existing glyph.
