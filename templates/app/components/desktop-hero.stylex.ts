import * as stylex from '@stylexjs/stylex';
import {media} from '@/app/tokens.stylex';

export const geometry = stylex.defineVars({
  height: '352px',
  width: '1056px',
  barHeight: '72px',
  controlHeight: '54px',
  inset: '8px',
});

/** Shared desktop sizing and pill surfaces; form widths fit each journey's controls. */
export const desktopHero = stylex.create({
  container: {width: '100%', maxWidth: {[media.desktop]: geometry.width, default: null}, marginInline: 'auto'},
  bar: {width: '100%', maxWidth: {[media.desktop]: geometry.width, default: null}, minHeight: {[media.desktop]: geometry.barHeight, default: null}, marginInline: 'auto', paddingBlock: {[media.desktop]: geometry.inset, default: null}, paddingInline: {[media.desktop]: geometry.inset, default: null}, gap: {[media.desktop]: geometry.inset, default: null}},
  cell: {minHeight: {[media.desktop]: geometry.controlHeight, default: null}},
  field: {paddingBlock: {[media.desktop]: 6, default: null}, paddingInline: {[media.desktop]: 16, default: null}},
  iconButton: {width: {[media.desktop]: geometry.controlHeight, default: null}, height: {[media.desktop]: geometry.controlHeight, default: null}},
});
