import * as stylex from '@stylexjs/stylex';
import {media, tokens as $} from '@/app/tokens.stylex';

/** Shared field paint; each form keeps its existing dimensions and validation. */
export const formControl = stylex.create({
  surface: {borderColor: 'transparent', backgroundColor: $.surfaceAlt},
  focus: {outlineWidth: 2, outlineStyle: 'solid', outlineColor: {default: 'transparent', ':focus-visible': $.ink, ':focus-within': $.ink}, outlineOffset: 2},
  // Desktop NumberField owns the surface and focus ring around its native value.
  embedded: {backgroundColor: {[media.desktop]: 'transparent', default: $.surfaceAlt}, outlineStyle: {[media.desktop]: 'none', default: 'solid'}},
});
