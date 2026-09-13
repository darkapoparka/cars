/** Match the existing CSS composition boundary; this is not a phone detection heuristic. */
export const MOBILE_SHELL_MAX_WIDTH = 991;
export const MOBILE_SHELL_MEDIA = '(max-width: ' + MOBILE_SHELL_MAX_WIDTH + 'px)';
export const DESKTOP_SHELL_MEDIA = '(min-width: ' + (MOBILE_SHELL_MAX_WIDTH + 1) + 'px)';
