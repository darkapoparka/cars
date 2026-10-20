# Reviewed Worker capacity — 18 October 2026

The singleton deployment bridge had two fixed `allowedScripts === 100` checks, so it could not use the documented paid allowance. Local CLI help also silently returned no output through the supported `J:\\cars` junction. This change adds explicit allowance evidence and reuses `isEntrypoint` from the maintained helper.

Cloudflare's [Workers limits](https://developers.cloudflare.com/workers/platform/limits/#number-of-workers), retrieved through Cloudflare Docs on 18 October 2026, list 100 Workers per account for Free and 500 for Paid. Its [pricing](https://developers.cloudflare.com/workers/platform/pricing/) distinguishes the Workers Paid subscription from other account/zone subscriptions. The connected OpenAPI specification exposes read-only `GET /accounts/{account_id}/subscriptions`. Documentation and purchase intent do not establish this account's subscription.

## Capacity contract

- Without `providerSnapshot.capacityReview`, only numeric `allowedScripts: 100` is accepted, as a conservative cap rather than a claim that the account is Free.
- Numeric 500 needs a schema-v1 `cars-workers-capacity-review`: exact target account, `reviewed: true`, observed/reviewed timestamps no more than 15 minutes old and not future, `workersPlan: "paid"`, and matching `allowedScripts: 500`. Optional explicit Free evidence follows the same contract with `"free"` / 100.
- The retained observation hash must reference the exact authenticated account subscriptions endpoint or exact account Workers plans dashboard URL. Reviewers must identify the active **Workers** subscription/allowance; a Paid zone plan, invoice, docs quote or promised purchase is insufficient. The code validates this explicit review envelope; it does not independently authenticate arbitrary handwritten JSON or fetch billing data.
- Creates still need a separate fresh authenticated absent-target snapshot and complete account Worker names. `scriptInventory.checkedAt` is now required, fresh within 15 minutes and no later than the snapshot. Duplicate names, count mismatches and an occupied exact target remain refused.
- Creates default to **one spare Worker slot**: 98→99 under 100 and 498→499 under 500 are allowed. A reviewed Paid-500 envelope may explicitly include `reservePolicy: {minimumSpareScripts: 0, reason: "..."}` with a concrete nonempty reason (at most 1,000 characters). Then 499→500 is allowed with complete fresh inventory; 500→501 always fails. Free zero-reserve and negative/unknown policies fail. Existing updates need no new slot and remain possible at/above a conservative cap.
- Allowance/review pins are checked against the reviewed provider snapshot before the lock, under the lock and after upload. Drift after upload keeps reconciliation evidence; retry is not automatic.
- Receipts record review basis/hash and expected spare count, and retain `scriptCountVerifiedAfter: false`. No live post-upload account-count read is invented.

The paid review must be prepared from actual authenticated account evidence and retained in the existing ignored review/receipt area. **No paid evidence has been populated, subscription purchased, Worker created/uploaded, or billing/DNS/provider state changed by this task.** A sealed reviewed source/artifact, target identity, exact six-design source acceptance and current provider observations are still required.

At a starting count of 100, a Paid-500 cap permits 400 additional Workers only with the explicit reasoned zero-reserve policy for the final slot. The conservative default keeps one slot available. The owner has authorized the 400-dealer objective; this policy preparation does not create a new permission gate, assert a current live count, or establish that Paid was purchased. Any creates beyond 500 need a real quota increase.

## Focused verification

On Windows, physical `L:\\CODEX\\cars` with existing Node 26.10.0:

- `node --test L:\\CODEX\\cars\\scripts\\deploy-dealer-single-worker.test.mjs`: 22 passed after initial patch.
- Added after-upload allowance-drift regression: 1 passed.
- After adding early inspection validation, focused default-inspection / missing-paid-evidence / paid-creation tests: 3 passed. The added cases were checked by name without repeating the whole suite. After the final-slot policy refinement, 10 relevant cases passed, including free/paid boundaries, explicit zero reserve, policy drift before/under/after upload, paid receipt provenance and junction dispatch. There are 26 current tests in the owned file.
- `node scripts/deploy-dealer-single-worker.mjs --help` from `J:\\cars` now prints real usage and policy text. The focused test creates one bounded directory junction, checks help, argument failure and silent import, unlinks the verified junction, then removes its verified temporary area. No source tree is copied and the owner's J junction is untouched.

The exact23911 remote candidate subsequently passed all42 deployment tests on retained Node22.20.0:33 baseline canonical-exposure/archive/source guards plus9 new capacity/dispatch regressions. Candidate source/test hashes and maintained files stayed unchanged during that run. A bootstrap attempt stopped before test registration on seven missing eager resources; after adding those exact pinned resources, the one complete suite passed. No framework build or provider action was performed.

## Exact remote integration manifest

Local deployment files are pre-existing untracked/dirty work and differ from published main. **Do not publish either entire local file.** The canonical-exposure lease/live-reader and original archive-byte behavior at `8865442cf526daedab19671a6940903d0b7b198b` is newer than the local baseline. Root reports those two files unchanged at subsequent main `23911ca0e6731033a12a129eb0dcfefd5a410191`.

The following exact before/after replacements were applied successfully **in memory** to both files fetched through the connected GitHub tool at 8865442. Sixteen source replacements preserve its complete canonical-exposure block and original-byte checks; five test operations retain every remote test and append the new ones. `newTextFromLocal` selects only the owned new block by exact markers, without copying the surrounding stale file. Require each ordinary `oldText` to occur exactly once. `\\nEOF_APPEND` means append after the current remote test content. Review against current remote again before publication; root owns that checkpoint.

```json
{
  "sourceOps": [
    {
      "label": "Use shared junction-aware CLI guard",
      "oldText": "import {pathToFileURL} from 'node:url';",
      "newText": "import {isEntrypoint} from './lib/cli-entrypoint.mjs';"
    },
    {
      "label": "Add allowance-review validator without changing existing exposure code",
      "oldText": "export function validateCurrentSingletonTarget",
      "newTextFromLocal": {
        "path": "scripts/deploy-dealer-single-worker.mjs",
        "start": "export const MINIMUM_SPARE_WORKER_SCRIPTS",
        "end": "export function validateCurrentSingletonTarget",
        "append": "export function validateCurrentSingletonTarget",
        "sha256": "8e4029b077949ea3148d5ef3df99d018990a32533681fb08eb00ba3f05b4a48b"
      }
    },
    {
      "label": "Remove fixed-100 coupling",
      "oldText": "  Array.isArray(snapshot.bindings)&&Number.isSafeInteger(snapshot.scriptCount)&&Number.isSafeInteger(snapshot.allowedScripts)&&snapshot.allowedScripts===100,",
      "newText": "  Array.isArray(snapshot.bindings),"
    },
    {
      "label": "Check allowance after target shape",
      "oldText": "  'Fresh existing public Worker snapshot without foreign routes/resources is required');",
      "newText": "  'Fresh existing public Worker snapshot without foreign routes/resources is required');\n validateSingletonCapacity(snapshot,{now});"
    },
    {
      "label": "Retain one spare slot for new Workers",
      "oldText": " assert(Number.isSafeInteger(snapshot.scriptCount)&&snapshot.scriptCount>=0&&Number.isSafeInteger(snapshot.allowedScripts)&&snapshot.allowedScripts===100&&snapshot.scriptCount<snapshot.allowedScripts,\n  'New Worker requires dated available capacity within the existing 100-script allowance');\n",
      "newText": " const capacity=validateSingletonCapacity(snapshot,{now});\n assert(snapshot.scriptCount+1+capacity.minimumSpareScripts<=snapshot.allowedScripts,\n  'New Worker capacity must retain the reviewed spare script slots after creation');\n"
    },
    {
      "label": "Require fresh separately dated complete inventory",
      "oldText": " assert(inventory?.complete===true&&inventory.endpoint==='/accounts/'+SINGLETON_ACCOUNT+'/workers/scripts'&&Array.isArray(inventory.names)&&",
      "newText": " assert(inventory?.complete===true&&freshObservation(inventory.checkedAt,now)&&Date.parse(inventory.checkedAt)<=Date.parse(snapshot.checkedAt)&&\n  inventory.endpoint==='/accounts/'+SINGLETON_ACCOUNT+'/workers/scripts'&&Array.isArray(inventory.names)&&"
    },
    {
      "label": "Pin allowance proof in absent-target review",
      "oldText": "const absentTargetPins=snapshot=>canonical(Object.fromEntries(['accountId','workerName','publicOrigin','exists','workersDev','routes','domains','tailConsumers','schedules','bindings','versionId','versionTraffic','scriptCount','allowedScripts','evidence'].map(key=>[key,snapshot[key]]).concat([['scriptInventory',{complete:snapshot.scriptInventory.complete,endpoint:snapshot.scriptInventory.endpoint,names:[...snapshot.scriptInventory.names].sort()}]])));",
      "newText": "const absentTargetPins=snapshot=>canonical(Object.fromEntries(['accountId','workerName','publicOrigin','exists','workersDev','routes','domains','tailConsumers','schedules','bindings','versionId','versionTraffic','scriptCount','allowedScripts','evidence'].map(key=>[key,snapshot[key]]).concat([['capacityReview',snapshot.capacityReview??null],['scriptInventory',{complete:snapshot.scriptInventory.complete,endpoint:snapshot.scriptInventory.endpoint,names:[...snapshot.scriptInventory.names].sort()}]])));"
    },
    {
      "label": "Check allowance during read-only review",
      "oldText": " deploymentMode(mode,review);\n",
      "newText": " deploymentMode(mode,review);\n const capacity=validateSingletonCapacity(review.providerSnapshot);\n"
    },
    {
      "label": "Expose capacity provenance and policy",
      "oldText": "deployments:0,hostedVerified:false,ownerAccepted:false}};",
      "newText": "capacity,minimumSpareScripts:mode==='create-singleton'?capacity.minimumSpareScripts:null,deployments:0,hostedVerified:false,ownerAccepted:false}};"
    },
    {
      "label": "Pin allowance before lock",
      "oldText": " const before=validateBefore(await snapshotFor('before'));",
      "newText": " const before=validateBefore(await snapshotFor('before'));\n assert(capacityPins(before)===capacityPins(review.providerSnapshot),'Worker allowance evidence changed since the exact provider review');"
    },
    {
      "label": "Pin allowance under lock",
      "oldText": "  const fresh=validateBefore(await snapshotFor('locked'));",
      "newText": "  const fresh=validateBefore(await snapshotFor('locked'));\n  assert(capacityPins(fresh)===capacityPins(before),'Worker allowance evidence changed before upload');"
    },
    {
      "label": "Reconcile allowance drift after upload",
      "oldText": "  const after=validateCurrentSingletonTarget(await snapshotFor('after',deployed.version_id),review.workerName,{after:true,versionId:deployed.version_id,canonicalExposure:review.canonicalExposure});",
      "newText": "  const after=validateCurrentSingletonTarget(await snapshotFor('after',deployed.version_id),review.workerName,{after:true,versionId:deployed.version_id,canonicalExposure:review.canonicalExposure});\n  assert(capacityPins(after)===capacityPins(before),'Worker allowance evidence changed during upload; reconcile the deployment');"
    },
    {
      "label": "Preserve allowance review in receipt",
      "oldText": "   liveBindings:after.bindings,scriptCountSnapshot:{count:before.scriptCount,allowed:before.allowedScripts,checkedAt:before.resourceSnapshotCheckedAt??before.checkedAt,evidence:before.evidence},scriptCountVerifiedAfter:false,",
      "newText": "   liveBindings:after.bindings,scriptCountSnapshot:{count:before.scriptCount,allowed:before.allowedScripts,checkedAt:before.resourceSnapshotCheckedAt??before.checkedAt,evidence:before.evidence,capacity:validateSingletonCapacity(before)},scriptCountVerifiedAfter:false,"
    },
    {
      "label": "Record expected spare count",
      "oldText": "   ...(creating?{creationEvidence:{absentBefore:true,scriptInventorySha256:sha256(canonical(before.scriptInventory)),checkedAt:before.checkedAt,expectedScriptCountAfter:before.scriptCount+1,scriptCountVerifiedAfter:false,absenceProbe:before.absenceProbe??null}}:{}),",
      "newText": "   ...(creating?{creationEvidence:{absentBefore:true,scriptInventorySha256:sha256(canonical(before.scriptInventory)),checkedAt:before.checkedAt,expectedScriptCountAfter:before.scriptCount+1,minimumSpareScripts:validateSingletonCapacity(before).minimumSpareScripts,expectedSpareScriptsAfter:before.allowedScripts-before.scriptCount-1,scriptCountVerifiedAfter:false,absenceProbe:before.absenceProbe??null}}:{}),"
    },
    {
      "label": "Execute through J junction",
      "oldText": "if(process.argv[1]&&import.meta.url===pathToFileURL(path.resolve(process.argv[1])).href){try{",
      "newText": "if(isEntrypoint(import.meta.url)){try{"
    },
    {
      "label": "Describe capacity evidence in help",
      "oldText": " if(process.argv.slice(2).includes('--help'))console.log('Usage: deploy-dealer-single-worker.mjs --input REVIEW_JSON [--mode create-singleton] [--write --wrangler-package ABS_PACKAGE_JSON]\\nDefault: exact artifact/source inspection only; update-existing is the default target mode. Explicit create-singleton requires a reviewed absent target and available capacity. --write uploads once with standard Wrangler authentication. No builds/downloads/dependent Workers.');",
      "newText": " if(process.argv.slice(2).includes('--help'))console.log('Usage: deploy-dealer-single-worker.mjs --input REVIEW_JSON [--mode create-singleton] [--write --wrangler-package ABS_PACKAGE_JSON]\\nDefault: exact artifact/source inspection only; update-existing is the default target mode. Explicit create-singleton requires a fresh complete absent-target inventory. Reserve defaults to one slot; a concrete reviewed Paid-500 policy can explicitly use the final slot. Capacity defaults to 100; 500 requires fresh reviewed paid-plan evidence. --write uploads once with standard Wrangler authentication. No builds/downloads/dependent Workers.');"
    }
  ],
  "testOps": [
    {
      "label": "Add bounded-junction fixture imports",
      "oldText": "import test from 'node:test';import assert from 'node:assert/strict';import fs from 'node:fs';import path from 'node:path';",
      "newText": "import test from 'node:test';import assert from 'node:assert/strict';import fs from 'node:fs';import path from 'node:path';import os from 'node:os';\nimport {spawnSync} from 'node:child_process';import {pathToFileURL} from 'node:url';"
    },
    {
      "label": "Preserve canonical imports while adding capacity imports",
      "oldText": "validateSourcePublication,validateCurrentSingletonTarget",
      "newText": "validateSourcePublication,validateSingletonCapacity,MINIMUM_SPARE_WORKER_SCRIPTS,validateCurrentSingletonTarget"
    },
    {
      "label": "Date creation inventory fixture",
      "oldText": "  scriptInventory:{complete:true,endpoint:'/accounts/'+SINGLETON_ACCOUNT+'/workers/scripts',names:['preserved-other','retained-qualification']}};",
      "newText": "  scriptInventory:{complete:true,checkedAt:f.snapshot.checkedAt,endpoint:'/accounts/'+SINGLETON_ACCOUNT+'/workers/scripts',names:['preserved-other','retained-qualification']}};"
    },
    {
      "label": "Test inventory timestamp rejection",
      "oldText": "  {scriptInventory:{...f.snapshot.scriptInventory,complete:false}},{scriptInventory:{...f.snapshot.scriptInventory,endpoint:'/accounts/foreign/workers/scripts'}},{scriptInventory:{...f.snapshot.scriptInventory,names:['only-one']}},",
      "newText": "  {scriptInventory:{...f.snapshot.scriptInventory,complete:false}},{scriptInventory:{...f.snapshot.scriptInventory,checkedAt:undefined}},\n  {scriptInventory:{...f.snapshot.scriptInventory,checkedAt:'2020-01-01T00:00:00Z'}},{scriptInventory:{...f.snapshot.scriptInventory,checkedAt:new Date(Date.now()+60000).toISOString()}},\n  {scriptInventory:{...f.snapshot.scriptInventory,endpoint:'/accounts/foreign/workers/scripts'}},{scriptInventory:{...f.snapshot.scriptInventory,names:['only-one']}},"
    },
    {
      "label": "Append capacity and junction regressions",
      "oldText": "\nEOF_APPEND",
      "newTextFromLocal": {
        "path": "scripts/deploy-dealer-single-worker.test.mjs",
        "start": "function capacityReview(",
        "end": null,
        "append": "",
        "sha256": "2c5ba0c28edd8e160291509793fd1f7a2f66f6a7afacb46b44e72c3222c2d50d"
      }
    }
  ],
  "remoteBase": "8865442cf526daedab19671a6940903d0b7b198b",
  "currentMainReportedByIntegrator": "23911ca0e6731033a12a129eb0dcfefd5a410191",
  "policy": {
    "defaultMinimumSpareScripts": 1,
    "reviewedPaid500MayUseZeroReserveWithConcreteReason": true,
    "paidEvidencePopulated": false,
    "providerActionsPerformed": false
  }
}
```

