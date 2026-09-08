// Preserve the captured widgets' DOM ownership during the fidelity phase.
// Replace each widget with a Svelte component before enabling hydration.
export const csr = false;
export const trailingSlash = 'always';
