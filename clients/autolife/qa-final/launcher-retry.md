# Launcher retry

2026-09-08: first focused Autolife attempt waited on an inherited PowerShell pipe after launch. Owned Vite PID68688 on6643 was stopped, releasing the blocked launcher and causing ERR_CONNECTION_REFUSED before a browser capture. No product defect inferred. Harness now resolves bounded runtime JSON on stdout, ignores stdin, waits for HTTP readiness, and bounds navigation/screenshots. Fresh focus-only rerun passed six checks and stopped its runtime; focused.json is final evidence.
