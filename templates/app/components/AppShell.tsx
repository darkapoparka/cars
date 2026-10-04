'use client';
import {useCopy} from '@/lib/locale';
import type {MouseEvent, ReactNode} from 'react';
import Link from '@/components/AppLink';
import {usePathname} from '@/lib/navigation';
import * as stylex from '@stylexjs/stylex';
import {Heart, Menu, Phone} from 'lucide-react';
import DealerBrand from '@/components/DealerBrand';
import ShowroomIcon from '@/components/ShowroomIcon';
import {showroom} from '@/lib/showroom';
import {dealer} from '@/lib/dealer-config';
import {media, tokens as $} from '@/app/tokens.stylex';

export default function AppShell({children}: {children:ReactNode}){
  const tx = useCopy();

  const pathname=usePathname();
  const hideMobileNav=pathname.startsWith('/cars/')||pathname==='/search'||pathname.endsWith('/details')||pathname.startsWith('/benefits/');
  function skipNavigation(event: MouseEvent<HTMLAnchorElement>) {
    const content = document.querySelector<HTMLElement>('main') ?? document.getElementById('app-content');
    if (!content) return;
    event.preventDefault();
    content.tabIndex = -1;
    content.focus({preventScroll: true});
    content.scrollIntoView({block: 'start', behavior: 'instant'});
  }
  return <div data-keyboard-navigation="false" onKeyDownCapture={event => {if (event.key === 'Tab') event.currentTarget.dataset.keyboardNavigation = 'true';}} onPointerDownCapture={event => {event.currentTarget.dataset.keyboardNavigation = 'false';}} {...stylex.props(s.app)}>
    <a href="#app-content" onClick={skipNavigation} {...stylex.props(s.skip)}>{tx('Skip to content')}</a>
    <header data-desktop-header {...stylex.props(s.desktopHeader)}><div {...stylex.props(s.headerInner)}>
      <Link href="/" aria-label={tx(`${showroom.name} home`)} {...stylex.props(s.wordmark)}><DealerBrand/></Link>
      <nav data-desktop-tools aria-label={tx("Primary navigation")} {...stylex.props(s.actions)}>
        <Link href="/saved" aria-label={tx("Saved cars")} title={tx("Saved cars")} {...stylex.props(s.iconButton)}><Heart size={21} aria-hidden="true"/></Link>
        {dealer.phoneE164 ? <a href={`tel:${dealer.phoneE164}`} aria-label={`${tx('Call')} · ${dealer.phoneDisplay || dealer.phoneE164}`} title={dealer.phoneDisplay || dealer.phoneE164} {...stylex.props(s.iconButton)}><Phone size={20} aria-hidden="true"/></a> : null}
        <Link href="/more" aria-label={tx("Open menu")} title={tx("Open menu")} {...stylex.props(s.iconButton, s.menuButton)}><Menu size={23} aria-hidden="true"/>{tx('Menu')}</Link>
      </nav>
    </div></header>
    <div id="app-content" {...stylex.props(s.main,hideMobileNav&&s.mainWithoutNav)}>{tx(children)}</div>
    {!hideMobileNav?<nav aria-label={tx("App navigation")} {...stylex.props(s.bottomNav)}>{showroom.navigation.map(item=>{
      const active=item.href==='/'?pathname==='/':pathname.startsWith(item.href);
      return <Link key={item.label} href={item.href} aria-label={tx(item.label)} title={tx(item.label)} aria-current={active?'page':undefined} {...stylex.props(s.bottomLink,active&&s.bottomLinkActive)}><ShowroomIcon name={item.icon} size={22} strokeWidth={active?2:1.65}/></Link>;
    })}</nav>:null}
  </div>;
}

const s=stylex.create({
 app:{minHeight:'100vh',overflowX:'clip',color:$.text,backgroundColor:'#fff',fontFamily:$.fontSans},
 skip:{position:'fixed',top:8,left:12,zIndex:300,display:'flex',alignItems:'center',minHeight:44,paddingInline:16,color:$.ink,fontSize:14,fontWeight:500,borderRadius:12,backgroundColor:'#fff',boxShadow:$.shadowStrong,transform:{default:'translateY(-150%)',':focus':'translateY(0)'}},
 main:{minHeight:{[media.desktop]:'calc(100svh - 72px)',default:'100svh'},paddingBottom:{[media.desktop]:0,default:'calc(80px + env(safe-area-inset-bottom))'}},
 mainWithoutNav:{paddingBottom:0},
 desktopHeader:{display:{[media.desktop]:'block',default:'none'},position:'sticky',top:0,zIndex:90,borderBottomColor:$.line,borderBottomStyle:'solid',borderBottomWidth:1,backgroundColor:'rgba(255,255,255,.97)',backdropFilter:'blur(16px)'},
 headerInner:{display:'flex',alignItems:'center',justifyContent:'space-between',gap:24,width:'100%',maxWidth:$.content,minHeight:72,marginInline:'auto',paddingInline:28},
 wordmark:{display:'inline-flex',alignItems:'center',minHeight:44,color:$.ink},
 actions:{display:'flex',alignItems:'center',gap:8},
 iconButton:{display:'grid',placeItems:'center',width:44,height:44,color:$.ink,borderColor:$.line,borderStyle:'solid',borderWidth:1,borderRadius:999,backgroundColor:{default:'#fff',':hover':$.surfaceAlt}},
 menuButton:{display:'inline-flex',justifyContent:'center',gap:8,width:'auto',paddingInline:14,fontSize:14,fontWeight:400},
 bottomNav:{display:{[media.desktop]:'none',default:'grid'},gridTemplateColumns:'repeat(4,44px)',gap:2,position:'fixed',bottom:'calc(12px + env(safe-area-inset-bottom))',left:'50%',transform:'translateX(-50%)',width:'max-content',zIndex:100,padding:2,borderColor:'#e4e4e7',borderStyle:'solid',borderWidth:1,borderRadius:26,backgroundColor:'rgba(255,255,255,.97)',backdropFilter:'blur(16px)',boxShadow:'0 4px 18px rgba(20,20,24,.1)'},
 bottomLink:{display:'grid',width:44,height:44,placeItems:'center',color:'#717178',borderRadius:'50%'},
 bottomLinkActive:{color:$.ink,backgroundColor:'#eeeef0'},
});
