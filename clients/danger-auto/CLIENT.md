# DANGER AUTO — in-progress branch handoff

This is a prospect demo, not a commissioned site or an outreach event. No deployment or dealer contact has been performed.

## Source and identity

Public sources observed 2026-09-09: https://dangerauto.mobile.bg/ and https://dangerauto.mobile.bg/contacts. Published contacts: 0888 000 055 and 0878 842 409; Sofia, Gorublyane, Samokovsko shose 1, DJANI lot beside BOILA. The contacts page does not supply hours, while advertisement prose contains hours; confirm before visiting. The seller expressly distinguishes bank financing from in-house leasing. No universal rate, bank partner, approval time or loan terms have been adopted.

## Actual implementation

- `auto-best/` is an independent retained master copy, not a replacement lookalike. Its company module has source-backed service/contact-topic and map data.
- `STOCK.json` and `auto-best/src/lib/data/dealer-stock.json` are byte-identical eight-record snapshots. The app's imported inventory module now uses this data for catalogue cards, filters, detail lookup and recommendations.
- Source EUR cash prices, kilometres, seller URLs/IDs, observation date and unverified availability remain explicit. Unknown Mercedes power remains null.
- `checks/stock-contract.mjs` ran on Node v22.16.0: 22 passed, 0 failed. This is data-module execution, not Svelte typechecking or browser testing.

## Not finished

The attempted next contact/branding write was rejected by the tool and did not reach the branch. Central branding and additional source-dealer content therefore remain unfinished. Do not present the current app as a completed DANGER AUTO website or use its contact links for outreach.

There is no final integrated logo or permitted local stock-photo pack. The new stock uses an explicit temporary missing-photo illustration rather than another dealer's vehicles; it is not accepted final media. Additional inherited hero/editorial media still needs its content sweep.

Modern and Carwow have not been created. Application install/build/browser QA has not run. The fixed-count asset checker, JSON loader in the domain checker and zero-principal finance display need follow-up fixes; they are not claimed passed.

See `REVIEW.md` and `checks/RESULTS.json`. All full-app QA flags remain false. The existing template source/provenance remains applicable; no new media-rights determination is asserted.
