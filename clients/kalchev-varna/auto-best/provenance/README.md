# Provenance records

This directory contains dated image-origin notes, source capture metadata and third-party notices. It is reference material for media and source history, not a development task list.

Start with [Asset provenance](../ASSET_PROVENANCE.md) for the media families and origin notes. [Source notices](../SOURCE_LICENSE.md) explains the historical licensing record.

## Capture metadata

`mirror-manifest.json` comes from the retired mirror payload. Its existing provenance record describes 150 routes and 479 resources, observed source `daynight.mobile.bg`, and acquisition timestamp `2026-08-13T05:09:17.976Z`. The separately retained acquisition script names the AutoDeal reference host. These are separate records, not proof of matching acquisition provenance.

Historical acquisition tooling under `scripts/provenance/`, where retained, is not needed to build or run the SvelteKit application. The application renders its own routes rather than serving the captured mirror.

## Media records

Dated Markdown files record original inputs, generated outputs, conversions and usage limits. Historical paths may point to the creator machine or a superseded encoding. Current runtime paths are defined by the application source. Directories containing superseded media retain history outside public `static/`.

Third-party license files are preserved as received. For new media, record the actual input and role without treating an illustration as verified stock or premises photography.
