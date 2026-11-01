import * as stylex from '@stylexjs/stylex';
import {media, tokens as $} from '@/app/tokens.stylex';

/** The compact dock surface is shared by the regular and comparison journeys. */
export const compactDock = stylex.create({
  root: {display: {[media.desktop]: 'none', default: 'grid'}, gridTemplateColumns: 'repeat(4,44px)', gap: 2, position: 'fixed', bottom: 'calc(12px + env(safe-area-inset-bottom))', left: '50%', transform: 'translateX(-50%)', width: 'max-content', zIndex: 100, padding: 2, borderColor: '#e4e4e7', borderStyle: 'solid', borderWidth: 1, borderRadius: 26, backgroundColor: 'rgba(255,255,255,.97)', backdropFilter: 'blur(16px)', boxShadow: '0 4px 18px rgba(20,20,24,.1)'},
  link: {display: 'grid', width: 44, height: 44, placeItems: 'center', color: '#55585f', borderRadius: '50%'},
  active: {color: $.ink, backgroundColor: '#eeeef0'},
  labeledRoot: {gridTemplateColumns: 'repeat(4,minmax(0,1fr))', width: 'calc(100% - 24px)', maxWidth: 328, padding: 3, borderRadius: 24, bottom: 'calc(8px + env(safe-area-inset-bottom))'},
  labeledLink: {display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', gap: 1, width: 'auto', height: 48, minWidth: 0, borderRadius: 18},
  label: {fontSize: 11, fontWeight: 500, lineHeight: '14px', whiteSpace: 'nowrap'},
});
