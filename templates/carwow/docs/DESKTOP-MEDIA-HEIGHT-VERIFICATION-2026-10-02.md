# Matching desktop YouTube and testimonial panels

Home previously sized YouTube from its thumbnail aspect ratio and testimonials from their text. At 1440px in English, the white panels were 359.83px and 391.17px high. The desktop composition now places both sections in equal CSS grid rows and stretches each white panel to fill its row. The taller content determines both heights; no fixed height, resize script or review-text clipping is needed.

The panels share 28px padding, reduced to 24px at 992–1199px, and retain their 48px separation. Three equal video thumbnails stay at 16:9 and sit centrally in the available content area. Playback, close-button focus return, review links and the separate mobile composition retain their existing behaviour.

Development and final production verification passed all eight EN/BG states at 992, 1280, 1440 and 1920px: panel heights, widths and padding match, videos retain their ratio, reviews are not clipped and no horizontal overflow occurs. Four fresh mobile signatures match the baseline at 320/390px in EN/BG. Both `/home1` review compositions also match their previous dimensions and content. All 125 protected mobile, shared-data, asset and base-style hashes match.

The production build passed in 2m 8s. All three focused browser cases passed: mobile composition/image requests, desktop stylesheet loading without JavaScript, and click-to-play video with close-button focus return. Svelte diagnostics report zero errors and warnings; scoped Prettier, ESLint and the typography gate pass. Before/after screenshots, measurements and logs are retained in `.audit/desktop-media-height-2026-10-02/`. Node 24.21.0 and the npm lockfile are retained. This is shared master source work, with unrelated Cars work preserved.

Final visual evidence is `proof/en-1440-panels.png` and `bg-992-visible.png`. The narrow proof uses a viewport capture with both panels visible; the earlier full-page capture omitted thumbnail paint despite the images being loaded and decoded. Native browser inspection also confirms all three thumbnails and matching 391.17px panels at 1440px.
