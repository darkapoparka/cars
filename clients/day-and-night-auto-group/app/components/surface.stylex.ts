import * as stylex from '@stylexjs/stylex';
import {tokens as $} from '@/app/tokens.stylex';

/** Light-grey cards share a flat surface and retain a keyboard-only focus edge. */
export const surfaceStyles = stylex.create({
  card: {backgroundColor: {default: $.surfaceAlt, ':hover': $.line, ':active': $.line}, borderWidth: 0, outlineWidth: 2, outlineStyle: {default: 'none', ':focus-visible': 'solid'}, outlineColor: $.ink, outlineOffset: -2},
});
