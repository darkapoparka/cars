import * as stylex from '@stylexjs/stylex';
import {tokens as $} from '@/app/tokens.stylex';

/** Shared geometry and typography for editable search fields and their entry link. */
export const searchField = stylex.create({
  field: {display: 'flex', alignItems: 'center', gap: $.controlActionGap, minHeight: $.controlHeight, paddingInline: 12, color: $.subtle, fontFamily: $.fontSans, fontSize: 16, fontWeight: 400, lineHeight: 1.5, borderWidth: 0, borderRadius: $.radiusPill, backgroundColor: $.surfaceAlt, outline: {default: 'none', ':focus-visible': '2px solid #242428', ':focus-within': '2px solid #242428'}, outlineOffset: 2},
  input: {flexGrow: 1, width: '100%', minWidth: 0, minHeight: $.controlHeight, padding: 0, color: {default: $.ink, '::placeholder': $.muted}, opacity: {default: 1, '::placeholder': 1}, fontFamily: $.fontSans, fontSize: 16, fontWeight: 400, lineHeight: 1.5, borderWidth: 0, outlineStyle: 'none', backgroundColor: 'transparent'},
  icon: {width: $.controlIconSize, height: $.controlIconSize, flexShrink: 0, color: $.ink},
  copy: {display: 'inline-flex', alignItems: 'center', gap: 4, minWidth: 0},
  editableGroup: {display: 'flex', alignItems: 'center', gap: 4, flexGrow: 1, minWidth: 0},
  inputSlot: {position: 'relative', display: 'inline-grid', alignItems: 'center', gridTemplateColumns: 'minmax(0, 1fr)', minWidth: 20, minHeight: $.controlHeight},
  inputMeasure: {visibility: 'hidden', overflow: 'hidden', whiteSpace: 'pre', paddingRight: 2, fontFamily: $.fontSans, fontSize: 16, fontWeight: 400, lineHeight: 1.5},
  inlineInput: {position: 'absolute', inset: 0, height: '100%'},
  count: {flexShrink: 0, color: $.subtle, fontSize: 16, fontWeight: 400, fontVariantNumeric: 'tabular-nums'},
  clear: {marginRight: -10},
});
