import * as stylex from '@stylexjs/stylex';
import {media, tokens as $} from './tokens.stylex';

/** Shared text roles for the showroom. Component styles own layout and color. */
export const typography = stylex.create({
  base: {fontFamily: $.fontSans},
  hero: {fontSize: {[media.mobile]: 24, [media.tablet]: 30, default: 36}, fontWeight: 600, lineHeight: {[media.mobile]: '28px', [media.tablet]: '36px', default: '44px'}, letterSpacing: '-.02em'},
  heading: {fontSize: {[media.mobile]: 24, default: 28}, fontWeight: 600, lineHeight: {[media.mobile]: '28px', default: '34px'}, letterSpacing: '-.02em'},
  title: {fontSize: 18, fontWeight: 600, lineHeight: '24px'},
  body: {fontSize: {[media.mobile]: 15, default: 16}, fontWeight: 400, lineHeight: {[media.mobile]: '22px', default: '24px'}},
  caption: {fontSize: 14, fontWeight: 400, lineHeight: '20px'},
  control: {fontSize: 16, fontWeight: 500, lineHeight: '24px'},
  input: {fontSize: 16, fontWeight: 400, lineHeight: '24px'},
  navigation: {fontSize: {[media.mobile]: 14, default: 16}, fontWeight: 400, lineHeight: {[media.mobile]: '20px', default: '24px'}},
  amount: {fontSize: 32, fontWeight: 600, lineHeight: '40px', fontVariantNumeric: 'tabular-nums'},
  featuredAmount: {fontSize: 40, fontWeight: 600, lineHeight: '48px', fontVariantNumeric: 'tabular-nums'},
});
