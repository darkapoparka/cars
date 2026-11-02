import * as stylex from '@stylexjs/stylex';
import {tokens as $} from '@/app/tokens.stylex';

/** A visible button surface; text roles stay in typography.stylex. */
export const actionButton = stylex.create({
  // Paint only: preserve the caller's touch target, layout and selected state.
  secondary: {color: $.ink, borderColor: 'transparent', backgroundColor: {default: $.surfaceAlt, ':hover': $.line}, outline: {default: 'none', ':focus-visible': '2px solid #202024'}, outlineOffset: 3},
  filled: {display: 'inline-flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, gap: 8, minHeight: $.controlHeight, padding: '10px 14px', color: $.ink, borderWidth: 0, borderRadius: $.radiusSm, backgroundColor: {default: $.surfaceAlt, ':hover': $.line}, cursor: 'pointer', outline: {default: 'none', ':focus-visible': '2px solid #242428'}, outlineOffset: 3},
});
