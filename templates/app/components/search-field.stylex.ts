import * as stylex from '@stylexjs/stylex';
import {tokens as $} from '@/app/tokens.stylex';

/** Shared geometry and typography for editable search fields and their entry link. */
export const searchField = stylex.create({
  field: {display: 'flex', alignItems: 'center', gap: 8, minHeight: 44, paddingInline: 12, color: $.subtle, fontFamily: $.fontSans, fontSize: 16, fontWeight: 400, lineHeight: 1.5, borderWidth: 1, borderStyle: 'solid', borderColor: '#e4e4e7', borderRadius: 9999, backgroundColor: '#f7f7f8', outline: {default: 'none', ':focus-visible': '2px solid #242428'}, outlineOffset: 2},
  input: {flexGrow: 1, width: '100%', minWidth: 0, minHeight: 40, padding: 0, color: {default: $.ink, '::placeholder': $.muted}, opacity: {default: 1, '::placeholder': 1}, fontFamily: $.fontSans, fontSize: 16, fontWeight: 400, lineHeight: 1.5, borderWidth: 0, outlineStyle: 'none', backgroundColor: 'transparent'},
  icon: {width: 20, height: 20, flexShrink: 0, color: $.ink},
  copy: {display: 'inline-flex', alignItems: 'center', gap: 4, minWidth: 0},
  editableGroup: {display: 'flex', alignItems: 'center', gap: 4, flexGrow: 1, minWidth: 0},
  inputSlot: {position: 'relative', display: 'inline-grid', alignItems: 'center', gridTemplateColumns: 'minmax(0, 1fr)', minWidth: 20, minHeight: 40},
  inputMeasure: {visibility: 'hidden', overflow: 'hidden', whiteSpace: 'pre', paddingRight: 2, fontFamily: $.fontSans, fontSize: 16, fontWeight: 400, lineHeight: 1.5},
  inlineInput: {position: 'absolute', inset: 0, height: '100%'},
  count: {flexShrink: 0, color: $.subtle, fontSize: 16, fontWeight: 400, fontVariantNumeric: 'tabular-nums'},
  clear: {display: 'grid', placeItems: 'center', flexShrink: 0, width: 42, height: 42, marginRight: -10, padding: 0, color: $.muted, borderWidth: 0, borderRadius: '50%', backgroundColor: {default: 'transparent', ':hover': '#e8e8eb'}, cursor: 'pointer'},
});
