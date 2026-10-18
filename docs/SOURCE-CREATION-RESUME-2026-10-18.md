# Owned source-creation resume

The maintained `prepare-new-dealer-source.mjs` flow records seven checkpoints: creator, factual inputs, primary adapters, App/extended adapters, catalogs, branding/seals, and source proposal. It uses the existing creator, adapters and catalog generator. It creates no build, publication or hosting approval.

Start with the ordinary reviewed request and `--write`. The attempt's `owner.json` and result/failure evidence provide the relative area and owner UUID. Resume explicitly:

```powershell
node scripts/prepare-new-dealer-source.mjs --request docs/releases/cloudflare-existing25-20261011/new-source/REQUEST.json --dealer SLUG --write --resume-area runtime/new-dealer-source/RUN-ATTEMPT/SLUG --resume-owner OWNER-UUID
```

Both resume flags and `--write` are required. Current committed request, original base, six source tuples, approved lock, row inputs, tool package, code bytes and branch proof must match the owned checkpoint. The executable/resource inventory is bounded at 128. Ownership and exact physical file state are verified before exempting only the selected candidate folder from the ordinary absence check. Other folder, registry, alias, repository and Worker conflicts still reject.

Schema 2 checkpoints require an invocation-owned mutation writer. It keeps an expected tree distinct from the observed filesystem and records each intended file write with its exact preimage and resulting bytes/metadata. Collected maps are checked against that expected tree before writing. Existing file writes reject changed preimages; new files use exclusive creation. A checkpoint rejects edits, additions, deletions, links or mode/identity changes outside the recorded writes. A direct helper write that bypasses the supported interface cannot advance the checkpoint. Schema 1 attempts remain preserved and held; there is no automatic conversion or adoption.

The creator keeps its ordinary staging and atomic directory install. Its optional proof interface declares the exact file set from immutable Git blob identities, source modes and the actual generated metadata buffers. Every source blob is checked using raw bytes, including retained CRLF. Unexpected staging content or altered metadata holds before installation. The final creator receipt is separately bound to exact bytes and physical file state. No second source tree or replacement generator is used.

Primary adapter text/asset writes use narrow optional interfaces scoped to their invocation through AsyncLocalStorage. The global filesystem object is never patched. Ordinary consumers keep their existing writes and return shapes. Catalog regeneration still runs the existing reviewed generator; its single known file-write seam is routed through the optional writer. An unknown catalog mutator holds before that generator executes. Proposal blobs, receipt and artifact manifest use the same explicit output writer.

Completed stages are skipped using recorded creator receipt, primary changes, App provenance, extended seal fields and the owned mutation proof. A completed proposal returns its existing result. Failed phases resume only when candidate/output still exactly match the last completed checkpoint. Partial writes, concurrent work, uncertain checkpoint renames, changed pins and foreign or stale locks stay held. Source and failed output are retained. A killed owner requires explicit lock reconciliation.

Modern and Import stock compatibility are checked through their maintained normalizer and fact guards before creating a client. Unknown facts remain unknown and hold incompatible source generation before a large copy.

The ownership lock coordinates cooperating Cars writers. Node filesystem APIs do not provide a cross-process compare-and-swap or mandatory exclusion for arbitrary editors. There is no await between a guarded existing-file preimage check and its synchronous descriptor write, and file identity is checked after opening; however, an uncooperative process editing the same inode inside that final check/write window can still race. Snapshot verification is also a sequence of reads rather than a filesystem transaction. Do not claim protection from arbitrary simultaneous editors; keep one editorial owner for the selected candidate, and treat a reported conflict as a manual reconciliation hold. No conflict handler deletes, restores or replaces the other owner's files.

Real six-template source creation/interruption/retry remains a separate canonical CI qualification. Focused tests cover ordinary consumers, immutable materialization/install, asynchronous touched and unrelated conflicts, recorded write proofs, resumable checkpoints, pin drift and refusal paths. They do not establish build or hosted acceptance.
