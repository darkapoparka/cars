import * as stylex from '@stylexjs/stylex';
import {tokens as $} from '@/app/tokens.stylex';

/** One surface and geometry for page, photo and dialog icon actions. */
export const iconButtonStyles = stylex.create({
  button: {position: 'relative', display: 'grid', placeItems: 'center', flexShrink: 0, boxSizing: 'border-box', width: $.controlHeight, height: $.controlHeight, padding: 0, color: $.ink, borderWidth: 0, borderRadius: $.radiusPill, backgroundColor: 'transparent', boxShadow: {default: 'none', ':focus-visible': $.controlActionFocusShadow}, outlineWidth: 2, outlineStyle: 'solid', outlineColor: {default: 'transparent', ':focus-visible': $.ink}, outlineOffset: 2, pointerEvents: 'auto', cursor: 'pointer'},
  content: {position: 'relative', display: 'grid', placeItems: 'center', boxSizing: 'border-box', width: $.controlSurfaceHeight, height: $.controlSurfaceHeight, borderRadius: 'inherit', backgroundColor: {default: $.surfaceAlt, ':hover': $.line, ':active': $.line}},
  photo: {borderWidth: 1, borderStyle: 'solid', borderColor: $.line, backgroundColor: {default: $.surface, ':hover': $.surfaceAlt, ':active': $.line}},
  grey: {backgroundColor: {default: $.surfaceAlt, ':hover': $.line, ':active': $.line}},
  icon: {display: 'block', flexShrink: 0, width: $.controlIconSize, height: $.controlIconSize, strokeWidth: 2},
  selected: {color: $.surface, borderColor: $.ink, backgroundColor: {default: $.ink, ':hover': $.violetDark, ':active': $.violetDark}},
  embedded: {width: '100%', height: '100%', borderWidth: 0, color: $.muted, backgroundColor: {default: 'transparent', ':hover': $.line, ':active': $.line}},
  badge: {position: 'absolute', top: -3, right: -3, display: 'grid', placeItems: 'center', boxSizing: 'border-box', width: $.controlBadgeSize, height: $.controlBadgeSize, color: $.ink, fontSize: $.controlBadgeFontSize, fontWeight: 600, lineHeight: '14px', borderWidth: 1, borderStyle: 'solid', borderColor: $.ink, borderRadius: $.radiusPill, backgroundColor: $.surface},
});
