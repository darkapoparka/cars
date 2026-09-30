import * as stylex from '@stylexjs/stylex';
import {tokens as $} from '@/app/tokens.stylex';

/** Shared geometry and typography for editable search fields and their entry link. */
export const searchField = stylex.create({
  field: {display: 'flex', alignItems: 'center', gap: 12, minHeight: 48, paddingInline: 16, color: $.muted, fontFamily: $.fontSans, fontSize: 16, fontWeight: 400, lineHeight: 1.5, borderWidth: 0, borderRadius: 9999, backgroundColor: '#f4f4f5', outlineStyle: 'none'},
  input: {flexGrow: 1, width: '100%', minWidth: 0, minHeight: 44, padding: 0, color: $.ink, fontFamily: $.fontSans, fontSize: 16, fontWeight: 400, lineHeight: 1.5, borderWidth: 0, outlineStyle: 'none', backgroundColor: 'transparent'},
  icon: {flexShrink: 0},
  clear: {display: 'grid', placeItems: 'center', flexShrink: 0, width: 44, height: 44, marginRight: -14, padding: 0, color: $.muted, borderWidth: 0, borderRadius: '50%', backgroundColor: {default: 'transparent', ':hover': '#e8e8eb'}, cursor: 'pointer'},
});
