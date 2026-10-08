# History and provenance

The architectural cleanup removes accumulated polishing screenshots, JSON reports, logs, dated iteration notes and one-off repair/capture scripts from the active tree. It does not rewrite Git history.

The complete pre-cleanup snapshot is retained in commit `a433c9e552b3c3e369e457156b61175ac527051d` ("Publish polished app template for phone testing"). Inspect historical material without reintroducing it into current builds:

```sh
git show a433c9e552b3c3e369e457156b61175ac527051d:docs/ARCHITECTURE.md
git ls-tree -r a433c9e552b3c3e369e457156b61175ac527051d -- docs scripts
```

`SOURCE-README.md`, `SOURCE-AGENTS.md`, `CARS24-PARITY.md` and `IMPORT.md` remain as source/provenance context. Historical commands and capture counts in those documents describe their original snapshots, not the current quality gate. Current commands and invariants are documented in the root README, TEMPLATE.md and ARCHITECTURE.md.

`COMPARISON-PUBLISHING.md` retains the canonical-source and publishing relationship. `.template` recovery/publication records remain untouched as origin records; they are not assertions that later standalone edits have already been reconciled into Cars. Public artwork, font files, dealer fixtures and asset-provenance data also remain untouched.

New QA evidence belongs in ignored `runtime/`, not in a growing tracked screenshot archive. Keep only evidence needed for the current review and remove disposable compiler output after stopping its processes.
