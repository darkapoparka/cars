# Register validation — 2026-09-08

Checks run locally against the delivered data:

- All nine JSON files parsed successfully.
- 547 rows have exactly the six documented columns; publisher profile keys are unique.
- 553 directory appearances collapse to 540 unique directory profiles; three separately discovered profiles and four assigned source-snapshot records bring the total to 547.
- All 62 screening entries join to a source profile. Ad count/category/crawl label and uncertainty remain distinct.
- All 49 follow-up queue entries are unique and resolve to screened profiles; none intersects known existing/protected or assigned accounts.
- All seven previously assigned Bulgarian lead IDs and destinations are retained, with no new completion assertion.
- All identity-group members resolve to profiles. Five same-primary-phone groups were detected; phone normalization was used for comparison, not to replace published contacts.
- Eleven catalogue holds and two franchise audits are outside the ordinary follow-up queue.
- KJ Cars domain corrected to the dealer-published `kj-cars.com`; no `kj-cars.bg` appears in delivered files.
- Geographic subtotals match the register; Banovo remains outside Varna city and directory buckets are not claimed as precise showroom locations.
- Output paths are new research documentation/data only. No client, template, existing assignment, report or private sales record is included.

Not executed: whole-country census, full 52-page Sofia directory sweep, legal-owner verification for every profile, private contact-history check, an HTTP test of every source URL, visual logo/site audit, inventory/media permission clearance, app installation/build/browser QA. Public source text and selected catalogues were reviewed through the research tool; this validator verifies data structure, not business truth.

GitHub commit/head/changed-path verification is performed separately when publishing. Do not interpret this file as a passed dealer-build QA report.
