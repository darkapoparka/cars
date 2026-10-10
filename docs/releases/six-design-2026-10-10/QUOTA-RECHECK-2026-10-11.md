# Existing 25-dealer fleet: post-midnight quota recheck

## Actual attempt

On 11 October 2026, after midnight in Europe/Sofia, the existing Promosale six-design pilot was submitted again through the authenticated Vercel API and the mapped Vercel CLI fallback. Both attempts were rejected; neither created a deployment.

- Team: `team_RTNXBnClGWDdcYFFUW0BnqvJ` (`tyj5`).
- Existing project: `prj_yjXIu0an7sqCiY26hKWgOGUl5hbY` (`cars-promosalevarna`).
- Repository: `darkapoparka/cars-promosalevarna`.
- Branch: `codex/six-design-pilot-20261010`.
- Exact source: `963ba03df08ecaa98e7508fc9111af056c57fd3a`.
- Environment: preview; no production alias assignment requested.
- API observation: `2026-10-10T21:07:44.929Z` / `2026-10-11 00:07:44.929 Europe/Sofia`.
- API result: HTTP 402, `payment_required`, resource `api-deployments-free-per-day`, message `Resource is limited - try again in 24 hours (more than 100, code: "api-deployments-free-per-day").`
- API `retryAfter`: `86400`.
- CLI: Vercel `63.1.2`, identical team/project/Git source request, exit 1 with the same quota error.

The response does not establish an exact guaranteed reset time. Midnight Sofia time did not clear the quota. Do not call this a fresh production deployment or repeat submissions across all 25 projects while the provider is rejecting the pilot.

## Where the activity is coming from

An authenticated team deployment-history query returned 100 latest records, with an additional pagination cursor. In that 100-record sample, 98 records belong to `treido-bg-shop` or `treido-eu` and have the `PRO` Git branch and non-production target; two belong to `cars-template-app` production. The sample includes READY, ERROR and CANCELED records. This is a latest-100 sample, not a complete 24-hour billing-counter reconciliation.

The repeated Treido PRO-branch pushes explain the large volume of preview deployment creation visible on this team. The public Vercel limits documentation describes the Hobby daily deployment limit as 100 per 86400 seconds and scopes the deployment-per-day rate limit to the owner, not a separate allowance for each dealer project. Reference: https://vercel.com/docs/limits .

No Treido settings were changed. Disabling another application's branch previews, changing billing or moving projects to another team was not performed.

## Fleet status

The earlier six native Promosale build passes and shared Modern logo-binding fix remain recorded in `WEB-RESUME-NATIVE-CHECKPOINT.md`. The selected six source pins remain unchanged in the inspected checkout. The new observation adds zero production deployments: the latest-template fleet rollout is still not 25/25 complete. Other dealer source refreshes, exact package/export reconciliation, combined hosting validation and public-alias checks remain outstanding.

The local checkout was inspected without resetting source or staging unrelated work. It had approximately 492 MiB free on L and 1.45 GiB free on C at the start of this recheck, so another large candidate/dependency copy was not launched. The inaccessible I-drive preparation was not accessed or replaced. No project source, Git history, Codex data, billing, DNS, protection settings or existing public aliases were deleted or changed by this recheck.

Runtime request and CLI error evidence is retained under `L:/CODEX/cars/runtime/vercel-six-rollout-20261011/`. A separate attempt to aggregate all history pages through the Windows CLI failed due to shell parsing of URL query separators, so no complete all-pages history count is claimed.
