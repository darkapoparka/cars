import * as stylex from '@stylexjs/stylex';
import {media, tokens as $} from '@/app/tokens.stylex';

export const geometry = stylex.defineVars({
  height: '352px',
  width: '1056px',
  twoFieldWidth: '768px',
  singleFieldWidth: '560px',
  barHeight: '72px',
  controlHeight: '54px',
  inset: '8px',
});

/** Shared desktop sizing and pill surfaces; form widths fit each journey's controls. */
export const desktopHero = stylex.create({
  container: {width: '100%', maxWidth: {[media.desktop]: geometry.width, default: null}, marginInline: 'auto'},
  bar: {width: '100%', maxWidth: {[media.desktop]: geometry.width, default: null}, minHeight: {[media.desktop]: geometry.barHeight, default: null}, marginInline: 'auto', paddingBlock: {[media.desktop]: geometry.inset, default: null}, paddingInline: {[media.desktop]: geometry.inset, default: null}, gap: {[media.desktop]: geometry.inset, default: null}},
  twoFieldBar: {maxWidth: {[media.desktop]: geometry.twoFieldWidth, default: null}},
  singleFieldBar: {maxWidth: {[media.desktop]: geometry.singleFieldWidth, default: null}},
  cell: {minHeight: {[media.desktop]: geometry.controlHeight, default: null}},
  field: {paddingBlock: {[media.desktop]: 6, default: null}, paddingInline: {[media.desktop]: 16, default: null}},
  iconButton: {width: {[media.desktop]: geometry.controlHeight, default: null}, height: {[media.desktop]: geometry.controlHeight, default: null}},
  secondary: {display: 'flex', alignItems: 'center', justifyContent: 'center', flexWrap: 'wrap', gap: 8, minHeight: 44, marginTop: 12},
  action: {display: 'inline-flex', alignItems: 'center', justifyContent: 'center', minHeight: 44, padding: 0, color: $.ink, fontFamily: $.fontSans, fontSize: 14, fontWeight: 400, lineHeight: '20px', whiteSpace: 'nowrap', borderWidth: 0, borderRadius: 999, backgroundColor: 'transparent', cursor: 'pointer', outlineColor: '#fff', outlineOffset: -2},
  actionSurface: {display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 8, minHeight: 36, padding: '0 12px', borderWidth: 1, borderStyle: 'solid', borderColor: $.surfaceBorder, borderRadius: 999, backgroundColor: {default: $.surface, ':hover': $.surfaceAlt}},
});
