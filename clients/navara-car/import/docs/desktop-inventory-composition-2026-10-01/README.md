# Import desktop inventory composition

Removed the inset filter panel and repeated inventory heading. Filters, result count, sorting and View now form one catalog header on the same canvas and alignment as the cards. Grid density, map/list and the existing sidebar toggle share the View menu. The header sticks within the results section. Six quick filters fit one row from 1024px; narrower desktop widths use two rows.

Matched comparisons: [1440px before](before-1440.jpg), [1440px after](after-1440.jpg), [1024px before](before-1024.jpg), [1024px after](after-1024.jpg). Also recorded the [View menu](view-menu-1440.jpg), [applied filters](filtered-after-1440.jpg) and [sidebar](sidebar-after-1440.jpg).

Type checking, scoped formatting/lint, architecture checks and a production build passed in a frozen source snapshot using Node 24.21.0. The inventory, filter-input and desktop-search browser suites passed 26 cases, with 22 device-specific skips. Bulgarian and English desktop geometry passed ten cases from 768px through 1920px. Existing native GET filter/sort/view/layout and keyboard behavior remain covered.

Mobile components and shared style files were not edited. The 320px screenshots are pixel-identical. At 390px, 95 pixels in the first car photo differ by at most 2/255 per color channel; all other pixels, including text and controls, match. The 390px comparison is retained with that limitation instead of being described as pixel-identical. See [verification](verification.json) and [mobile comparison](mobile-comparison.json).

The canonical development server remains at port 6790. This work does not promote a template release or deploy dealers.
