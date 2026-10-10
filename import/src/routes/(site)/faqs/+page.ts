// csr=true: the page is tiny (no app.css / no Auxero runtime), and hydration makes the
// clean header's language/search interactive + drives the sidebar TOC active-highlight
// (IntersectionObserver). The FAQ accordions themselves are native <details>, so the
// answers stay reachable even before hydration.
export const csr = true;
