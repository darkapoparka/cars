# History and provenance

The standalone publishing snapshot's architectural cleanup removes accumulated polishing screenshots, JSON reports, logs, dated iteration notes and one-off repair/capture scripts. It does not rewrite Git history. Canonical reconciliation retains the owner's local evidence and design specifications, imports the maintained checks and removes only the eleven unchanged, unreachable legacy components identified by the architecture test.

The complete standalone pre-cleanup snapshot is retained in [commit a433c9e](https://github.com/darkapoparka/cars-template-app/tree/a433c9e552b3c3e369e457156b61175ac527051d) ("Publish polished app template for phone testing"). [Commit f08f679](https://github.com/darkapoparka/cars-template-app/commit/f08f679ff091e446ca0b57eec9c3710baaec7ef9) records its refactor and verification. These hashes belong to the standalone publishing repository, rather than the Cars main history.

`SOURCE-README.md`, `SOURCE-AGENTS.md`, `CARS24-PARITY.md` and `IMPORT.md` remain as source/provenance context. Historical commands and capture counts in those documents describe their original snapshots, not the current quality gate. Current commands and invariants are documented in the root README, TEMPLATE.md and ARCHITECTURE.md.

`COMPARISON-PUBLISHING.md` retains the canonical-source and publishing relationship. `.template` recovery/publication records remain untouched as origin records; they are not assertions that later standalone edits have already been reconciled into Cars. Public artwork, font files, dealer fixtures and asset-provenance data also remain untouched.

New QA evidence belongs in Cars `docs/` or ignored `runtime/`. Keep only evidence needed for the current review and remove disposable compiler output after stopping its processes. Canonical reconciliation preimages and receipts are retained under `runtime/final-template-20261007/`.
