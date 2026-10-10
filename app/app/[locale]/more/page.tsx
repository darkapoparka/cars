'use client';

import * as stylex from '@stylexjs/stylex';
import PageHeader from '@/components/PageHeader';
import DealerBrand from '@/components/DealerBrand';
import ShowroomMenu from '@/components/ShowroomMenu';
import {media, tokens as $} from '@/app/tokens.stylex';

export default function MorePage() {
  return <div data-menu-page {...stylex.props(s.screen)}>
    <PageHeader title="Menu" compact wrapTitle showBack={false} action={<span {...stylex.props(s.brand)}><DealerBrand compact/></span>}/>
    <main {...stylex.props(s.content)}><ShowroomMenu/></main>
  </div>;
}

const s = stylex.create({
  screen: {display: 'flex', flexDirection: 'column', minHeight: {[media.desktop]: 'calc(100svh - 73px)', default: 'calc(100svh - 80px - env(safe-area-inset-bottom))'}, maxWidth: {[media.desktop]: 536, default: 760}, marginInline: 'auto', color: $.ink, backgroundColor: $.surface, fontFamily: $.fontSans},
  brand: {display: {[media.desktop]: 'none', default: 'block'}, maxWidth: 128, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', fontSize: 16, fontWeight: 600, letterSpacing: '-.025em'},
  content: {display: 'flex', flexDirection: 'column', flexGrow: 1, paddingInline: {[media.mobile]: 16, default: 28}, paddingTop: 8, paddingBottom: 12},
});
