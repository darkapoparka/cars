import * as stylex from '@stylexjs/stylex';
import { colors } from '@/styles/tokens.stylex';
import { Icon } from './Icon';
const s = stylex.create({
  row: { display: 'inline-flex', flexShrink: 0, verticalAlign: 'middle', lineHeight: 1 },
  star: { display: 'inline-block', position: 'relative', color: colors.line },
  size: (size: number) => ({ width: size, height: size }),
  fill: (percentage: number) => ({ width: `${percentage}%` }),
  colored: {
    position: 'absolute',
    top: 0,
    left: 0,
    overflow: 'hidden',
    height: '100%',
    color: '#bd7e10',
  },
});
/** Native vector geometry rather than font-dependent Unicode stars. */
export function RatingStars({ rating, size = 20 }: { rating: number; size?: number }) {
  const value = Math.min(5, Math.max(0, Number.isFinite(rating) ? rating : 0));
  return (
    <span role="img" aria-label={value + ' out of 5 stars'} {...stylex.props(s.row)}>
      {[0, 1, 2, 3, 4].map((index) => (
        <span key={index} {...stylex.props(s.star, s.size(size))}>
          <Icon name="ratingStar" size={size} />
          <span {...stylex.props(s.colored, s.fill(Math.min(1, Math.max(0, value - index)) * 100))}>
            <Icon name="ratingStar" size={size} />
          </span>
        </span>
      ))}
    </span>
  );
}
