# Asset provenance

Runtime assets are downloaded from the licensed source during `npm run mirror` and recorded in `mirror/manifest.json`. The manifest includes each local path, source URL, content type, and byte size.

The mirror is intentionally isolated from other Agency OS templates. Do not replace source media, fonts, or client bundles with remote URLs in a generated clone without checking the license scope.

```agency-os-asset-reuse
schema: agency-os-asset-reuse/v1
media-clearance: approved
font-clearance: not-applicable
remote-font-clearance: not-applicable
```

Runtime media covered by the approved source scope:

- `static/assets/agent-01.png`
- `static/assets/agent-02.png`
- `static/assets/agent-03.png`
- `static/assets/agent-04.png`
- `static/assets/vehicle-classic.jpg`
- `static/assets/vehicle-electric.jpg`
- `static/assets/vehicle-hatch.jpg`
- `static/assets/vehicle-hero.jpg`
- `static/assets/vehicle-sedan.jpg`
- `static/assets/vehicle-suv.jpg`
