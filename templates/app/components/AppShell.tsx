'use client';
import {useCopy} from '@/lib/locale';
import type {MouseEvent, ReactNode} from 'react';
import Link from '@/components/AppLink';
import {usePathname} from '@/lib/navigation';
import * as stylex from '@stylexjs/stylex';
import {Heart, Phone} from 'lucide-react';
import DealerBrand from '@/components/DealerBrand';
import DesktopHeaderMenu from '@/components/DesktopHeaderMenu';
import {MobileAlternativeDock, MobileAlternativeHeader} from '@/components/MobileHomeAlternative';
import {HomeAlternativeProvider, isHomeAlternative, primaryHomePath} from '@/lib/home-alternative';
import ShowroomIcon from '@/components/ShowroomIcon';
import {compactDock} from '@/components/dock.stylex';
import {showroom} from '@/lib/showroom';
import {dealer} from '@/lib/dealer-config';
import {media, tokens as $} from '@/app/tokens.stylex';

export default function AppShell({children}: {children:ReactNode}){
  const tx = useCopy();

  const currentPath=usePathname();
  const alternative=isHomeAlternative(currentPath);
  const pathname=primaryHomePath(currentPath);
  const heroHeader=['/','/sell','/finance','/service'].includes(pathname);
  const hideMobileNav=pathname.startsWith('/cars/')||pathname==='/search'||pathname.endsWith('/details')||pathname.startsWith('/benefits/');
  function skipNavigation(event: MouseEvent<HTMLAnchorElement>) {
    const content = [...document.querySelectorAll<HTMLElement>('main')].find(element=>element.getClientRects().length>0) ?? document.getElementById('app-content');
    if (!content) return;
    event.preventDefault();
    content.tabIndex = -1;
    content.focus({preventScroll: true});
    content.scrollIntoView({block: 'start', behavior: 'instant'});
  }
  return <HomeAlternativeProvider enabled={alternative}><div data-keyboard-navigation="false" onKeyDownCapture={event => {if (event.key === 'Tab') event.currentTarget.dataset.keyboardNavigation = 'true';}} onPointerDownCapture={event => {event.currentTarget.dataset.keyboardNavigation = 'false';}} {...stylex.props(s.app)}>
    <a href="#app-content" onClick={skipNavigation} {...stylex.props(s.skip)}>{tx('Skip to content')}</a>
    <div data-desktop-shell {...stylex.props(s.pageShell)}>
    <header data-desktop-header data-header-tone={heroHeader?'dark':'light'} {...stylex.props(s.desktopHeader,heroHeader&&s.heroHeader)}><div {...stylex.props(s.headerInner)}>
      <Link href="/" aria-label={tx(`${showroom.name} home`)} {...stylex.props(s.wordmark,heroHeader&&s.heroWordmark)}><DealerBrand onDark={heroHeader}/></Link>
      <nav data-desktop-journeys aria-label={tx('Car services')} {...stylex.props(s.journeys)}>{showroom.services.map(item=>{
        const active=item.key==='buy'?pathname==='/'||['/cars','/saved','/search','/luxe'].some(route=>pathname===route||pathname.startsWith(route+'/')):pathname===item.href||pathname.startsWith(item.href+'/')||item.key==='service'&&pathname==='/services';
        return <Link key={item.key} href={item.href} aria-current={active?'page':undefined} {...stylex.props(s.journey,heroHeader&&s.heroJourney)}><span {...stylex.props(s.journeyLabel,heroHeader&&s.heroJourneyLabel,active&&s.journeyActive,active&&heroHeader&&s.heroJourneyActive)}>{tx(item.key==='finance'?'Leasing':item.label)}</span></Link>;
      })}</nav>
      <nav data-desktop-tools aria-label={tx("Primary navigation")} {...stylex.props(s.actions)}>
        <Link href="/saved" aria-label={tx("Saved cars")} title={tx("Saved cars")} {...stylex.props(s.iconButton,heroHeader&&s.heroIconButton)}><Heart size={21} aria-hidden="true"/></Link>
        {dealer.phoneE164 ? <a href={`tel:${dealer.phoneE164}`} aria-label={`${tx('Call')} · ${dealer.phoneDisplay || dealer.phoneE164}`} title={dealer.phoneDisplay || dealer.phoneE164} {...stylex.props(s.iconButton,heroHeader&&s.heroIconButton)}><Phone size={20} aria-hidden="true"/></a> : null}
        <DesktopHeaderMenu key={currentPath} onDark={heroHeader}/>
      </nav>
    </div></header>
    {alternative&&pathname==='/'?<MobileAlternativeHeader onDark/>:null}
    <div id="app-content" {...stylex.props(s.main,hideMobileNav&&s.mainWithoutNav)}>{tx(children)}</div>
    </div>
    {!hideMobileNav?<nav aria-label={tx("App navigation")} {...stylex.props(compactDock.root,alternative&&s.standardAlternativeDock)}>{showroom.navigation.map(item=>{
      const active=item.href==='/'?pathname==='/':item.href==='/more'?pathname==='/more'||pathname==='/saved':pathname.startsWith(item.href);
      return <Link key={item.label} href={item.href} aria-label={tx(item.label)} title={tx(item.label)} aria-current={active?'page':undefined} {...stylex.props(compactDock.link,active&&compactDock.active)}><ShowroomIcon name={item.icon} size={22} strokeWidth={active?2:1.65}/></Link>;
    })}</nav>:null}
    {alternative&&!hideMobileNav?<MobileAlternativeDock pathname={pathname}/>:null}
  </div></HomeAlternativeProvider>;
}

const s=stylex.create({
 app:{minHeight:'100vh',overflowX:'clip',color:$.text,backgroundColor:{[media.desktop]:$.rail,default:'#fff'},fontFamily:$.fontSans},
 pageShell:{display:{[media.desktop]:'block',default:'contents'},width:{[media.desktop]:'100%',default:'auto'},maxWidth:$.content,minHeight:{[media.desktop]:'100svh',default:0},marginInline:'auto',borderColor:$.line,backgroundColor:{[media.desktop]:$.surface,default:'transparent'}},
 skip:{position:'fixed',top:8,left:12,zIndex:300,display:'flex',alignItems:'center',minHeight:44,paddingInline:16,color:$.ink,fontSize:14,fontWeight:500,borderRadius:12,backgroundColor:'#fff',boxShadow:$.shadowStrong,transform:{default:'translateY(-150%)',':focus':'translateY(0)'}},
 main:{minHeight:{[media.desktop]:'calc(100svh - 64px)',default:'100svh'},paddingBottom:{[media.desktop]:0,default:'calc(80px + env(safe-area-inset-bottom))'}},
 mainWithoutNav:{paddingBottom:0},
 desktopHeader:{display:{[media.desktop]:'block',default:'none'},position:'sticky',top:0,zIndex:90,backgroundColor:'rgba(255,255,255,.97)',backdropFilter:'blur(16px)'},
 heroHeader:{backgroundColor:'#202023',backdropFilter:'none'},
 headerInner:{display:'grid',gridTemplateColumns:'minmax(0,1fr) auto minmax(0,1fr)',alignItems:'center',gap:24,width:'100%',maxWidth:$.content,minHeight:64,marginInline:'auto',paddingInline:28},
 wordmark:{display:'inline-flex',alignItems:'center',justifySelf:'start',minHeight:44,color:$.ink},
 heroWordmark:{color:'#fff',outlineColor:'#fff'},
 journeys:{display:'flex',alignItems:'center',gap:2},
 journey:{display:'inline-flex',alignItems:'center',justifyContent:'center',minHeight:44,paddingInline:2,color:$.muted,fontSize:$.desktopTextSize,fontWeight:400,lineHeight:'24px',whiteSpace:'nowrap',borderWidth:0,borderRadius:$.radiusPill,backgroundColor:'transparent'},
 journeyLabel:{display:'inline-flex',alignItems:'center',justifyContent:'center',minHeight:36,paddingInline:12,borderRadius:$.radiusPill,backgroundColor:{default:'transparent',':hover':$.surfaceAlt}},
 journeyActive:{color:$.ink,fontWeight:500,backgroundColor:{default:$.surfaceAlt,':hover':$.line}},
 heroJourney:{color:'#d8d8de',outlineColor:'#fff'},
 heroJourneyLabel:{backgroundColor:{default:'transparent',':hover':'#333337'}},
 heroJourneyActive:{color:'#fff',backgroundColor:{default:'#38383d',':hover':'#444449'}},
 actions:{display:'flex',alignItems:'center',justifySelf:'end',gap:8},
 iconButton:{display:'grid',placeItems:'center',width:44,height:44,color:$.ink,borderWidth:0,borderRadius:$.radiusPill,backgroundColor:{default:'transparent',':hover':$.surfaceAlt}},
 heroIconButton:{color:'#fff',backgroundColor:{default:'transparent',':hover':'#333337'},outlineColor:'#fff'},
 standardAlternativeDock:{display:{[media.mobile]:'none',[media.desktop]:'none',default:'grid'}},
});
