import * as stylex from '@stylexjs/stylex';
import {media, tokens as $} from '@/app/tokens.stylex';

/** Shared visible pill inside a full 44px pointer and keyboard target. */
export const pillStyles = stylex.create({
  control: {display: 'inline-flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, minHeight: 44, padding: 0, color: $.ink, fontFamily: $.fontSans, fontSize: 15, fontWeight: 500, lineHeight: '20px', whiteSpace: 'nowrap', borderWidth: 0, borderRadius: 9999, backgroundColor: 'transparent', cursor: 'pointer', outlineOffset: -5},
  selectedControl: {outlineColor: {default: null, ':focus-visible': '#fff'}},
  surface: {display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: {[media.mobile]: 6, default: 5}, minHeight: {[media.mobile]: 40, default: 36}, paddingInline: {[media.mobile]: 12, default: 8}, borderWidth: 1, borderStyle: 'solid', borderColor: $.surfaceBorder, borderRadius: 9999, backgroundColor: {default: $.surface, ':hover': $.surfaceAlt}},
  soft: {fontSize: $.controlFontSize, fontWeight: 400, borderColor: $.surfaceBorder, backgroundColor: {default: $.surface, ':hover': $.surfaceAlt}},
  grey: {borderColor: 'transparent', backgroundColor: {default: $.surfaceAlt, ':hover': $.line}},
  selected: {color: '#fff', borderColor: $.ink, backgroundColor: {default: $.ink, ':hover': $.violetDark}},
  onDark: {color: $.ink, borderColor: $.surfaceBorder, backgroundColor: {default: $.surface, ':hover': $.surfaceAlt}},
  selectedOnDark: {color: '#fff', borderColor: '#fff', backgroundColor: {default: $.ink, ':hover': $.violetDark}},
  controlOnDark: {outlineColor: '#fff'},
});
