# LEGEND AUTO local preview

Safe ports explicitly assigned on 2026-09-08: Auto Best 6671, Modern 6672, Carwow 6673. Previous 6666–6668 assignments are superseded. Check listener ownership and free ports before starting.

From J:/cars use scripts/start-preview.ps1 -Client legend-auto -Template auto-best -Port 6671 (or modern/6672, carwow/6673). Modern retains Node 22.23.2 and its complete monorepo; set SKIP_ENV_VALIDATION=true, AUTOMARKET_PUBLIC_DATA_MODE=demo, NEXT_PUBLIC_WEB_URL=http://127.0.0.1:6672, NEXT_PUBLIC_API_URL=http://127.0.0.1:6674, NEXT_PUBLIC_APP_URL=http://127.0.0.1:6675 before launching. API/app origins are configuration only; no provider services started. Carwow uses Node 24.20.0.

Assigned entries: http://127.0.0.1:6671/ , http://127.0.0.1:6672/cars , http://127.0.0.1:6673/ . These are local review URLs, not published offers. Previews are stopped after bounded QA.
