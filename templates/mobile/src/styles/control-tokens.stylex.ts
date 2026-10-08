import * as stylex from '@stylexjs/stylex';

// Controls keep the same shape across phone and desktop. Pill radii scale with
// height; fields and selection rows retain usable corners for multiline content.
// Layout surfaces and underline tabs have their own composition-specific shapes.
export const controlShape = stylex.defineVars({
  pill: '999px',
  circle: '50%',
  field: '16px',
  option: '12px',
});
