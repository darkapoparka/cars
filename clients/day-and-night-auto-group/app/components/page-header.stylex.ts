import * as stylex from '@stylexjs/stylex';
import {media, tokens as $} from '@/app/tokens.stylex';

/** Shared header row geometry for page titles and the catalogue mode control. */
export const pageHeaderLayout = stylex.create({
  row: {display: 'flex', alignItems: 'center', gap: 12, minHeight: $.pageHeaderWideHeight, maxWidth: $.content, marginInline: 'auto', paddingInline: {[media.mobile]: 12, default: 28}},
  compact: {minHeight: {[media.mobile]: $.pageHeaderHeight, default: $.pageHeaderWideHeight}},
});
