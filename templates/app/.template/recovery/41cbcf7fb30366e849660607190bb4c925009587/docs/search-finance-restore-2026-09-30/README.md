# Search finance strip restoration

Restores the finance strip immediately preceding the mobile search polish: retained card artwork, 51px minimum height, 7px corner radius, 7px gaps, subtle border, and inline underlined action. Search capsule, suggestion typography, and filter changes are preserved. The decorative artwork and chevron are hidden from assistive technology.

`before-390.jpg` is the screenshot from the preceding polish pass. `after-390.jpg` shows the restored strip at the same viewport width, reloaded from the restarted dev server. `after-320.jpg` records the narrow phone layout from the built app.

The previous dev server reported repeated JSON parse errors matching `.next/dev/prerender-manifest.json`, followed by a JavaScript heap out-of-memory crash. The corrupt generated dev cache was preserved at `L:/CODEX/cars/runtime/app-search-finance-restore-20260930/corrupted-dev-cache` before regeneration. Existing browser tabs also timed out during focus emulation; verification uses a fresh in-app browser tab.

Verification: `npm run check` passed using Node 22.20.0, including lint, type checking, and the webpack production build with 407 generated pages. The built app was inspected in the in-app browser at 320px, 390px, and 1440px. The finance link is 51px high, the artwork loads, and there is no document horizontal overflow. Tab and Enter open `/bg/finance`; Toyota suggestions still select nine matching cars. No browser warnings or errors were captured. Search text remains 16px with a borderless field; the keyboard focus indicator remains available.

See `layout-observations.json` for measured styles and interaction results. These are focused manual checks of the changed strip, not a new full-site accessibility certification.

The Node 22 dev server was restarted on port 3001 and warmed sequentially. After the cold compile, search returned HTTP 200 in 454ms, the dev prerender manifest parsed successfully, and the fresh browser tab reloaded with the restored strip and no console warnings or errors. The initial generated-file contents in `tsconfig.json` and `next-env.d.ts` were preserved.
