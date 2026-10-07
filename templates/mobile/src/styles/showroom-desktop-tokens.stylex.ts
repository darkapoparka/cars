import * as stylex from '@stylexjs/stylex';

// Desktop geometry only. Consumers keep their existing phone values below 1024px.
export const showroomDesktop = stylex.defineVars({
  shellWidth: '1280px',
  viewportGutter: '24px',
  inventoryColumns: 'repeat(3,minmax(0,1fr))',
  gutter: '28px',
  sectionGap: '24px',
  cardGap: '16px',
  drawerRadius: '28px',
  panelRadius: '18px',
  fieldRadius: '12px',
});
