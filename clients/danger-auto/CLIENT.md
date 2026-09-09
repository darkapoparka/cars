# DANGER AUTO — Sofia

Status: **in-progress**. Branch-only handoff on `codex/astra-bg-08`; not dealer-ready and not deployed.

## Account and current sources

This continues this session's existing DANGER AUTO project; it does not create another account or CRM record. The retained earlier stock integration and tests remain intact. Source: https://dangerauto.mobile.bg/. Current contacts: https://dangerauto.mobile.bg/contacts, corroborated against the Chevrolet Cruze listing 11788853280325556 on 2026-09-09.

Current returned contacts are **0878 842 409** and **0888 000 055**, at **бул. Самоковско шосе 1, автоборса Джани до комплекс Боила, Горубляне, София**. These replace the different contact details recorded earlier in this work session. The map coordinates returned by the contacts page are 42.6425458, 23.4007179. No opening hours are entered on that contacts page; listing prose says 08:30–19:00, so client copy asks for confirmation before a visit.

The dealer explicitly describes bank financing, not in-house leasing. No APR, named finance partner or approval promise is reproduced. No email or matching social profile has been confirmed for use.

## Applications

- `auto-best/`: retained independent application; sourced stock/filter integration, corrected central dealer identity and contacts. Supporting content and final assets unfinished.
- `modern/`: actual full retained monorepo, including apps/web and packages, now copied independently. Lead-site configuration and public mock inventory exports use DANGER AUTO facts and the same eight source records. Supporting content and final assets unfinished.
- `carwow/`: actual full retained application copied independently. Site/navigation configuration, current-inventory adapter and vehicle adapter use the same source snapshot. Supporting content and final assets unfinished.

## Assets and truthfulness

The public Chevrolet photograph was visually inspected: its vehicle plate bears a plain DANGERAUTO wordmark. The local image download failed. Image generation was attempted but the service reported that generation did not start; there is no generated logo output. Current identity and stock placeholders are visibly marked development material and **are not final logos or vehicle photos**. Rights and permitted local media remain unresolved. No source stock photo has been claimed as licensed.

See FACTS.json, STOCK.json and REVIEW.md. The earlier 22 data checks do not establish the correctness of the newly copied apps. No new installation, framework build or browser QA is claimed.
