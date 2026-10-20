# Import recovered audit integration

The exact recovered 11-file patch was applied to the maintained Import checkout and to a source-only remote candidate. No additional implementation edits were made.

- Canonical immutable base: `b49b5cd10b8a3a3bea5c86d89f80a1c88426c96f`.
- Recorded Import subtree: `d841ddfe5bec918bf6b2c19fd6971fecd6b8e54d`.
- Original patch: 19,094 UTF-8 bytes, SHA-256 `9b3f025f85c1f0beccceabb1362f13b8bcb7484e8ac941655f99e4d80182be1b`.
- Candidate: `files/templates/import/`; only its 11 manifest-listed source files belong in publication.
- Eight existing remote blobs were fetched through the connected GitHub file API at the immutable base, reconstructed in full, and independently checked against the publisher's exact Git blob pins. Three new specs were absent from that recorded tree.
- The eight maintained local source blobs matched those pins after CRLF-to-LF normalization. Candidate files are LF-normalized and byte-equal to all 11 patched local files after the same normalization.

The local checkout remained on main at `3bc5a0ea33969f18ccc34d5e4b0e8cab1513e6a2`. Its 21 pre-existing dirty Import paths were outside this patch. The aggregate tracked Import diff outside the 11-path allowlist has the same SHA-256 before application, immediately afterward, and after validation. `preserved-import-context.diff` is local preservation evidence, not part of this candidate. No Git index/ref, lockfile, dependency installation, clone/fetch, provider or publication operation was performed.

## Review

The About fix moves only the old master's literal consultant presentation into optional sample-record metadata and selects it by consultant slug. Generated dealer records that omit this metadata retain their own identity and contacts. Literal AST comparison proves all three master presentation payloads remain equivalent, including portrait/crop and social data. The new regression checks zero, one and four generated contacts and reordered optional metadata.

Each of the five admin POST actions calls the existing `requireDayNightPageSession` before `request.formData`. The helper is unchanged: unauthenticated live requests are denied, authenticated live staff cannot enable these unsupported demonstration CMS capabilities, customer preview roles remain denied, and agent preview permission remains messages-only. The existing anonymous/admin preview remains intentional. These changes strengthen action enforcement; they do not introduce production CMS or widen live capabilities.

The seven inline JSON interpolation points now escape literal `<` characters as `\u003c`. Seven focused round-trip probes preserve the parsed data, including mixed-case closing tags and nested values; two regression cases exercise the actual profile handler, renderer and script-removal boundary. This is serialization-boundary evidence, not a demonstrated browser exploit or full production security audit.

## Validation

All commands used retained dependencies and Node **24.21.0**, with bounded job TEMP/TMP in this folder. Exact commands, durations and exits are in `validation.json`.

- SvelteKit sync: pass.
- Svelte check: **0 errors, 0 warnings**.
- Focused Vitest: **4 files / 40 tests passed**, comprising the 36 recovered regressions plus four runtime-capability tests.
- ESLint on all 11 changed/new files: pass.
- Prettier check on the same 11 files: pass.
- Source preservation probes: three master consultant payloads equivalent; seven JSON round trips; seven escaped interpolation sites; five guards precede parsing; 11 local/candidate parity checks; two reverse-apply checks; outside-patch tracked Import diff unchanged.

No failed checks remain. The original retained report's eight deferred proposals remain outside this exact patch. Production build, asset completeness, browser/visual acceptance, full test suite, dealer generation/publication, mounted FAB and hosted six-design acceptance were not run or claimed. No release lock, live deployment, logo, asset, Svelte markup, CSS or approved composition was changed by this patch.

`manifest.json` contains the exact scope, before/after blob hashes and preservation receipts. `preservation-probes.json` and the five validation logs retain the compact results. The preparation script is a one-shot application record; do not rerun it over already patched files.
