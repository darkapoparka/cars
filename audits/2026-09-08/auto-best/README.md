# Auto Best audit package

8 September 2026. Independent reusable master: `J:/cars/templates/auto-best`. Reviewed at <http://127.0.0.1:6461/>.

**Recommendation: preserve the design and improve the master in staged batches.** It already has useful native SvelteKit components. The highest-value work is selected-car enquiry context, a missing keyboard-focus token, trustworthy client data, reliable browser qualification, and clearer shared filter/dialog/CSS ownership.

## Reports

- [Mobile audit — 13 findings](MOBILE-AUDIT.md)
- [Desktop audit — 11 findings](DESKTOP-AUDIT.md)
- [Architecture and code quality — 12 findings](ARCHITECTURE-AUDIT.md)
- [Complete route and check coverage](COVERAGE.md)
- [Implementation-thread handoff](REFACTOR-HANDOFF.md)

Several mobile/desktop findings describe the same shared defect. Deduplicate by the handoff batches; these are not 36 independent implementation tasks.

## Verified outcome

- All eight vehicles and all nine articles captured at both primary widths, along with the complete retained route/intents/error matrix: 31 states per layout.
- 54 additional route/viewport checks, with no document-wide horizontal overflow.
- All 84 internal URL entries checked had successful final responses.
- Architecture/assets/Svelte/build validation passed; Svelte reported zero errors/warnings.
- Dedicated mobile-filter, enquiry and desktop-discovery checks passed. Sharing/clipboard were mocked; no enquiry was sent.
- General smoke suite did **not** finish successfully: mobile baseline assertions failed and a later picker sequence timed out. The equivalent isolated brand change passed; the report preserves the unresolved full-suite result.
- Maps rendered after settling; first YouTube video playback and stop/focus-return were verified.

This folder has no Git repository. The [manifest](evidence/source-manifest.json) records the audited files. The preview was launched with the workspace helper, independently of the old M: source projects. Application source was not edited; no commit, push, deployment or CRM action occurred.

## Evidence

Individual screenshots are linked from the coverage matrix. JSON observations and test logs are under [evidence](evidence/). Fast full-page captures can show unloaded maps and fixed bars at their viewport position; the reports explicitly distinguish those artifacts from defects. Follow-up observations supersede a few initial prematurely sampled navigation URLs.

The reports/evidence are also copied to `C:/Users/radev/Desktop/Auto-Best-Audit-2026-09-08` for convenient review. The workspace package is the primary audit record. Do not treat either folder as a new application baseline or edit the old Day & Night source from these reports.
