import * as stylex from '@stylexjs/stylex';

// Desktop geometry only. Consumers keep their existing phone values below 1024px.
export const showroomDesktop = stylex.defineVars({
  shellWidth: '1400px',
  viewportGutter: '24px',
  heroHeight: '380px',
  heroPaddingTop: '64px',
  heroPaddingBottom: '64px',
  heroCopyWidth: '860px',
  heroGap: '24px',
  heroTitleSize: 'clamp(36px, 3.1vw, 44px)',
  inventoryColumns: 'repeat(4,minmax(0,1fr))',
  wideInventoryColumns: 'repeat(5,minmax(0,1fr))',
  gutter: '28px',
  sectionGap: '24px',
  cardGap: '16px',
  drawerRadius: '28px',
  drawerOverlap: '-28px',
  panelRadius: '18px',
  fieldRadius: '12px',
});
