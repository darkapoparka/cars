# Home hero action width

The mobile Buy action now fits its localized label and arrow instead of retaining the shared 208px width. Bulgarian is 155.92px wide; English is 121.64px. The existing 20px side padding, 44px tap height, 40px painted height, rounded shape and arrow remain.

The change is one scoped `--dn-entry-action-width: fit-content` override in [SearchBox.svelte](../../src/lib/components/home/SearchBox.svelte), below 768px. Its shared maximum width continues to contain longer or enlarged text. Other entry actions and desktop styling retain their existing width rules.

## Comparison

Both screenshots use the same in-app browser, Bulgarian Home route on port 6461, 320×844 viewport, 305px content canvas, loaded Inter font and scroll position 0.

| Before | After |
| --- | --- |
| [208px action](home-320-before.jpg) | [Content-sized action](home-320-after.jpg) |

## Checks

- In-app browser: Bulgarian/English at 320/390px, aligned 15px arrow, 44px target, unchanged padding/font and no clipping or horizontal overflow. Clicking the English action opens `/en/listing-grid`.
- Desktop at 1440px: mobile action hidden, desktop form visible and no horizontal overflow.
- Existing Home reflow checks: 2/2 EN/BG cases at 320px, including normal layout, text-spacing overrides and 200% root text; no clipped actions or page overflow.
- CSS policy and token checks passed. Svelte diagnostics: 0 errors, 0 warnings. Production build and locale prechecks passed.

[Recorded measurements](verification.json) cover the current working tree. Unrelated shared checkout changes were preserved; this adjustment does not select a new template release or deploy dealers.
