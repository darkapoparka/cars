# Existing dealer updater: large-file release fix

The October 10 existing-dealer pilot exposed `spawnSync git ENOBUFS` before source installation. The shared three-way updater now writes complete Git merge output to its owned temporary file instead of limiting candidate bytes to a stdout buffer.

Binary assets retain exact before/after hashes and a compact review notice without a Git process for each image. Large text patches show exact before/after byte lengths and SHA-256 identities rather than overflowing the review display. Complete source and candidate bytes remain available. This display limit does not resolve conflicts or waive preservation, template pin, candidate, review, installation, or publishing checks.

The focused regression suite passes 23 tests, including binary conflicts, bounded large text review, and a complete clean merge exceeding the previous 16 MiB output limit. The normal release workflow remains `refresh-client`, review the real candidate, install the reviewed run, package, export, then verify the existing production project.

The original failed pilot run is retained under `runtime/dealer-template-upgrades/promosale-varna-1791653769086-GknD8e`. No canonical dealer was modified by that failed plan. Existing unrelated edits to `docs/LEAD-PUBLISHING.md` were left untouched.
## Broader regression result

The workflow documentation check passed. The full 604-test run recorded 601 passed, 2 failed, and 1 optional compiler fixture skipped. The two failures are existing UK-batch expectations against the newly selected release lock: its deliberately frozen source selection and a changed Mobile UK personalization boundary. The UK batch is outside this existing BG/UAE/USA 25-dealer rollout; its pinned batch and consumer code were not modified or treated as approved. All preservation-aware updater, six-design rollout, packaging, and export tests in that run passed. Full test output is retained in runtime/vercel-six-rollout-20261010-execute/workflow-diff-fix-tests.log.
