# Script notes

[Test reference](../docs/TESTING.md) maps scripts to their responsibilities. Run them from the package root. Browser suites use `BASE_URL` and the shared browser helper.

Test actual application functions and visitor behavior. Keep selectors aligned with the current components, report the real failure, and distinguish provider fixtures from live-provider checks. Generated reports belong in `artifacts/`.
