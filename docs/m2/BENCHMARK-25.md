# M2: authenticated 25-pack native-build benchmark

**25 of 25 temporary packs passed every native build and local QA gate.** The seven build lanes completed in **37m 30s** from workflow start; the entire workflow finished in **37m 37s**. The measured seven-lane model forecasts **1h 52m 48s for 100 ready packs**, and **7h 31m 12s for four sequential 100-pack batches** at the same seven-runner budget. These are build and local-QA forecasts; live asset upload, final bundle transport, deployment and hosted checks are additional.

## Identity and evidence

Benchmark: [run 39310711918](https://github.com/darkapoparka/cars/actions/runs/39310711918), attempt 1, source commit [`dedb9c0565c7d39da1c1cb12c3958f03e45464f6`](https://github.com/darkapoparka/cars/commit/dedb9c0565c7d39da1c1cb12c3958f03e45464f6). It ran from **19:24:24 to 20:02:01 UTC on 19 October 2026**. Every job, artifact ID, artifact size and ZIP SHA-256 was obtained through the authenticated GitHub connector. Downloaded archives were matched against those digests before extraction; every extracted report, log and screenshot was then hashed and recorded in `metadata/lane-N-archive-receipt.json`.

The plan contained exactly 25 valid temporary slugs and no rejected entries: 7 copies of ZA Motors, 1 Granada Auto Sales, and 17 Wadishee Used Cars. All clones retained their sourced business and logo inputs, carried `benchmarkOnly: true` and `neverDeploy: true`, and used temporary `m2-bench-*` identities. Every build and QA report records zero provider writes. Nothing in this benchmark was deployed.

The stable release was `cars-six-2b310cbaa31f68e04a40ef46148f124ec9b7b9beedf75cf999c8ef4022b37bb0`. Each pack used the same template release and native workspace key. This is the **fresh native build with shared dependencies fallback**: six application compiles plus one router bundle per pack. The measured run performed **150 application compiles + 25 router bundles = 175 build operations**. A 400-pack run still requires **2,400 application compiles + 400 router bundles = 2,800 build operations**.

## Actual lane results

Each lane built its dealers serially, and each dealer built its seven components serially. All seven lanes ran concurrently. “Cold” means the first pack installed its component dependencies; “warm” means all seven component dependency installations were reused. Fresh native compilation still occurred for every warm pack.

| Lane | Packs passed | Job wall | Setup before build step | Pack work, summed | Cold pack | Warm mean | Report ZIP | Cache uploaded |
|---|---:|---:|---:|---:|---:|---:|---:|---:|
| [1](https://github.com/darkapoparka/cars/actions/runs/39310711918/job/118259886756) | 4/4 | 35m 34s | 03m 35s | 30m 57s | 10m 18s | 06m 53s | 43.18 MB | 1.203 GB |
| [2](https://github.com/darkapoparka/cars/actions/runs/39310711918/job/118259886673) | 4/4 | 31m 21s | 05m 05s | 25m 34s | 08m 23s | 05m 44s | 42.91 MB | 1.203 GB |
| [3](https://github.com/darkapoparka/cars/actions/runs/39310711918/job/118259886643) | 4/4 | 32m 18s | 03m 58s | 27m 38s | 09m 23s | 06m 05s | 42.91 MB | 1.203 GB |
| [4](https://github.com/darkapoparka/cars/actions/runs/39310711918/job/118259886651) | 4/4 | 36m 07s | 02m 50s | 32m 22s | 10m 15s | 07m 22s | 43.18 MB | 1.203 GB |
| [5](https://github.com/darkapoparka/cars/actions/runs/39310711918/job/118259887530) | 3/3 | 23m 16s | 04m 51s | 17m 53s | 08m 03s | 04m 55s | 31.95 MB | 1.203 GB |
| [6](https://github.com/darkapoparka/cars/actions/runs/39310711918/job/118259886646) | 3/3 | 27m 59s | 02m 32s | 24m 47s | 10m 27s | 07m 10s | 32.25 MB | 1.203 GB |
| [7](https://github.com/darkapoparka/cars/actions/runs/39310711918/job/118259886667) | 3/3 | 29m 32s | 04m 43s | 24m 06s | 10m 09s | 06m 59s | 32.25 MB | 1.203 GB |

The seven lane jobs occupied **3h 36m 07s** of runner execution in total. All ten workflow jobs, including plan, contracts and result, occupied **3h 39m 30s**. Pack work summed to **3h 03m 18s**; that occupied execution is distinct from the **37m 37s** elapsed workflow wall time.

Cold packs: mean **09m 34s**, median **10m 09s**, range **08m 03s–10m 27s** (7 observations). Warm packs: mean **06m 28s**, median **06m 51s**, range **04m 49s–07m 28s** (18 observations). The large between-runner variation is retained in the forecast; the fastest lane is not used as the fleet-wide rate.

## Where the pack time went

| Stage | Total across 25 | Mean per pack | Cold mean | Warm mean |
|---|---:|---:|---:|---:|
| Source assembly | 11m 12s | 26.89s | 25.44s | 27.45s |
| Provider preparation / source synchronization | 03m 08s | 7.52s | 8.01s | 7.33s |
| Seven native build drivers, elapsed | 1h 39m 06s | 237.85s | 362.80s | 189.25s |
| Single-Worker composition and dry-run | 06m 05s | 14.61s | 15.20s | 14.38s |
| Local browser QA | 1h 02m 50s | 150.81s | 160.32s | 147.11s |

The seven component receipts sum to **1h 36m 22s**; the native-driver elapsed total is **1h 39m 06s** and includes process/driver overhead. Source assembly and provider preparation together average **34.41s**. Roughly another **55.70s across the whole 25-pack run** covers the remaining binding, report and cleanup work. Stage totals are not added again to the parent totals.

## Forecast for the ready batches

For each observed lane, the model keeps its measured setup and finish overhead, adds its actual cold-pack cost, then adds its own observed warm mean for each subsequent pack. The planned split is 15, 15, 14, 14, 14, 14, 14 for 100 packs. The forecast workflow wall is the slowest projected lane plus the measured plan/start and final-gate delay.

| Scenario | Concurrency assumption | Forecast build + local QA wall | Native build operations |
|---|---|---:|---:|
| One batch of 100 | Seven concurrent lane jobs | **1h 52m 48s** | 700 |
| Four batches of 100, one after another | Same seven-runner budget; four cold lane starts | **7h 31m 12s** | 2,800 |
| Model with all 400 in continuously warm lanes | Seven long-lived lane jobs; current workflow input remains capped at 100 | 7h 08m 25s | 2,800 |
| Four overlapping 100-pack runs | All **28** lane jobs start together; capacity has not been verified | 1h 52m 48s if that capacity exists | 2,800 |

Combining the observed fastest and slowest runner conditions gives **1h 20m 16s–2h 02m 17s** for 100 packs. This is a scenario envelope, **not a statistical confidence interval**. Four sequential 100-pack batches give **5h 21m 05s–8h 09m 07s** on the same basis. The measured result supports planning around two hours of build/local QA for 100 ready packs, but does not establish a two-hour deployment of 400 packs.

These estimates assume packs have already been researched and migrated. They use three proof businesses, not 25 independent researched businesses. They hold the observed native release, runner speed distribution and fixed overhead constant. Larger final bundle sealing/transport, increased report upload time, Cloudflare asset upload and account-serialized hosted deployment are excluded. No speed improvement is credited to cache changes made after this measured commit.

### Comparison with the original M1 model

The owner’s M2 request supplied the M1 forecast for 400 dealers: **36 hours elapsed, 2,800 native build operations, 3,616 workflow jobs, 1.1 TB of artifacts and 765 GB of caches**, with roughly 1 GB of per-dealer source archives moving through seven jobs. Those numbers describe the earlier model, not an observed 400-dealer run. The new 25-pack execution is measured; the new 100/400 figures are projections from it. The native compile count remains 2,800 for 400. Source/native archive transfers were eliminated in this benchmark, while final deployment bundles and live delivery remain a separate measurement. Comparing modeled build wall times is useful for planning, but does not establish an end-to-end measured speedup for 400 live deployments.

## Transfer and storage evidence

The benchmark transferred **zero source archives and zero native-build archives**. It uploaded only plan and report evidence. The seven lane report ZIPs total **268,639,656 bytes (268.64 MB)**; extracted reports, logs and 450 screenshots total **312,561,996 bytes (312.56 MB)**. Retention is three days. Scaling this same report/screenshot mix alone gives approximately **1.075 GB for 100**, or **4.298 GB for 400**. These are report-storage forecasts, not final deployment bundle sizes.

All seven lanes initially missed their release-scoped dependency-download cache and later reported successful cache saves. Actual compressed cache uploads sum to **8,421,557,456 bytes (8.422 GB)**, around 1.203 GB per lane. The displayed cache key is the same stable release key, but this commit used lane-specific cache paths, creating separate cache versions. A subsequent fixed-path normalization is a storage correction and is not part of the benchmark. The GitHub connector does not expose the repository cache inventory endpoint, so these are authenticated job-log upload/save observations, not a claim about current cache-account inventory or retention.

Source assembly still expands about **1.076 GB per pack locally**, with **26.888 GB** of logical source bytes assembled across the run. The persistent source synchronization wrote **7.638 GB** in total: a cold mean of **1.072 GB**, falling to a warm mean of **7.25 MB**. Native intermediates were cleaned after successful packs. Native family asset receipts still total roughly **0.889–0.895 GB per pack before composition/deduplication**. Final content-addressed bundle transport was intentionally skipped for temporary benchmark packs; its deployed payload and storage savings need separate proof-artifact measurement.

The preparation subprocess peak RSS ranged from **3.84 to 4.11 GiB**. That is local build memory, not Worker runtime memory or total concurrent job memory. Runner logs show 107 GB free after setup cleanup, but do not measure peak or final filesystem use. The composed Worker compressed-code readings ranged from **9,648,258 to 9,650,776 bytes**. Hosted CPU, startup time and memory were not measured by this local-only benchmark.

## QA and the two CI conclusions

Across all 25 packs, **350 QA gates, 1,050 route observations and 450 screenshot digests passed**. Every pack has six accepted design identities, and screenshots at 320, 390 and 1280 pixels. The checks cover page identity, sourced telephone links, logo rendering, fleet-default FAB behavior, route responses, known other-dealer identity leakage, images, JavaScript errors and bundle immutability. Historical identity coverage remains explicit: registry names and retained public phones were checked, but missing historical phone evidence was not invented. These screenshots are evidence of this run; this report makes no claim of pixel equality with M1 bundles.

The [original benchmark run](https://github.com/darkapoparka/cars/actions/runs/39310711918) correctly concludes **failure overall**, despite seven successful build lanes. Its shared-contract job passed 528 tests with no test failures and one Linux-inapplicable Windows test skipped, then Node 22 rejected the unsupported `--test-isolation=none` invocation before the separate Svelte tests could run. The final result gate retained that failure. The [corrected run 39312845364](https://github.com/darkapoparka/cars/actions/runs/39312845364) at `1c2d56a0a3014f0c17aae6547f8018fb9c979949` is independently verified **green**, with 537 main tests passed, the same one Windows-only skip, and all 20 separate Svelte tests passed. It did not rerun or replace the 25-pack benchmark measurements.

## Evidence files

- `benchmark-25.json`: machine-readable measurements, full per-pack rows, lane IDs, forecasts and explicit limits.
- `benchmark-25-timings.csv`: all 25 pack outcomes and individual stage timings.
- `benchmark-25-api-evidence.json`: authenticated final run, job and artifact metadata, plus corrected-contract evidence.
- `metadata/lane-N-archive-receipt.json`: exact downloaded ZIP digest and every extracted file digest.
- `reports/lane-N/`: original batch, build, assembly, preparation and QA reports, native logs and screenshots.
- `logs/`: original job logs, original failure evidence and corrected contracts log.

The full raw archives, logs and analysis scripts were authenticated in the working evidence directory. Reproduce the analysis there with `python runtime/m2-benchmark-39310711918/analyze.py --complete`, then `python runtime/m2-benchmark-39310711918/write-report.py`. No builds, workflow reruns, deployment, provider writes or source-pack edits are performed by the analysis.
