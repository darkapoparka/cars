'use client';
import {useCopy} from '@/lib/locale';
import DealerBrand from '@/components/DealerBrand';
import type {ReactNode} from 'react';
import Link from '@/components/AppLink';
import {usePathname} from '@/lib/navigation';
import * as stylex from '@stylexjs/stylex';
import {CarFront, Heart, House, Menu, PanelsTopLeft} from 'lucide-react';
import {showroom} from '@/lib/showroom';
import {media, tokens as $} from '@/app/tokens.stylex';
import {campaignTokens as campaign} from '@/app/campaign-theme.stylex';

const dockIcons = {Home: House, Cars: CarFront, Saved: Heart, More: PanelsTopLeft};

export default function AppShell({children}: {children:ReactNode}){
  const tx = useCopy();

  const pathname=usePathname();
  const hideMobileNav=pathname.startsWith('/cars/')||pathname==='/search'||pathname.endsWith('/details')||pathname.startsWith('/benefits/');
  return <div {...stylex.props(s.app)}>
    <header {...stylex.props(s.desktopHeader)}><div {...stylex.props(s.headerInner)}>
      <Link href="/" aria-label={tx(`${showroom.name} home`)} {...stylex.props(s.wordmark)}><DealerBrand/></Link>
      <nav aria-label={tx("Primary navigation")} {...stylex.props(s.desktopNav)}>{showroom.services.map(item=>{const href=item.key==='buy'?'/cars':item.href;return <Link key={href} href={href} aria-current={pathname.startsWith(href)?'page':undefined} {...stylex.props(s.desktopLink,pathname.startsWith(href)&&s.desktopLinkActive)}>{tx(item.label)}</Link>;})}</nav>
      <div {...stylex.props(s.actions)}><Link href="/saved" aria-label={tx("Saved cars")} {...stylex.props(s.iconButton)}><Heart size={21}/></Link><Link href={showroom.locationHref} {...stylex.props(s.desktopLink)}>{tx(showroom.locationLabel)}</Link><Link href="/more" aria-label={tx("Open menu")} {...stylex.props(s.iconButton)}><Menu size={23}/></Link></div>
    </div></header>
    <div {...stylex.props(s.main,hideMobileNav&&s.mainWithoutNav)}>{tx(children)}</div>
    {!hideMobileNav?<nav aria-label={tx("App navigation")} {...stylex.props(s.bottomNav)}>{showroom.navigation.map(item=>{
      const active=item.href==='/'?pathname==='/':pathname.startsWith(item.href);
      const Icon=dockIcons[item.label];
      return <Link key={item.label} href={item.href} aria-label={tx(item.label)} title={tx(item.label)} aria-current={active?'page':undefined} {...stylex.props(s.bottomLink,active&&s.bottomLinkActive)}><Icon size={22} strokeWidth={active?2:1.65} aria-hidden="true"/></Link>;
    })}</nav>:null}
  </div>;
}

const s=stylex.create({
 app:{minHeight:'100vh',overflowX:'clip',color:$.text,backgroundColor:'#fff',fontFamily:$.fontSans},
 main:{minHeight:{[media.desktop]:'calc(100svh - 72px)',default:'100svh'},paddingBottom:{[media.desktop]:0,default:'calc(80px + env(safe-area-inset-bottom))'}},
 wordmark:{fontSize:25,fontWeight:700,letterSpacing:'-1px',color:$.ink},
 mainWithoutNav:{paddingBottom:0},
 desktopHeader:{display:{[media.desktop]:'block',default:'none'},position:'sticky',top:0,zIndex:90,borderBottomColor:$.line,borderBottomStyle:'solid',borderBottomWidth:1,backgroundColor:'rgba(255,255,255,.97)',backdropFilter:'blur(16px)'},
 headerInner:{display:'flex',alignItems:'center',justifyContent:'space-between',gap:24,width:'100%',maxWidth:$.content,minHeight:72,marginInline:'auto',paddingInline:28},
 desktopNav:{display:'flex',alignItems:'center',gap:30},
 desktopLink:{display:'inline-flex',alignItems:'center',minHeight:44,color:$.muted,fontSize:15,fontWeight:500},
 desktopLinkActive:{color:campaign.lightInk},
 actions:{display:'flex',alignItems:'center',gap:20},
 iconButton:{display:'grid',placeItems:'center',width:42,height:42,color:$.ink,borderColor:$.line,borderStyle:'solid',borderWidth:1,borderRadius:12},
 bottomNav:{display:{[media.desktop]:'none',default:'grid'},gridTemplateColumns:'repeat(4,44px)',gap:2,position:'fixed',bottom:'calc(12px + env(safe-area-inset-bottom))',left:'50%',transform:'translateX(-50%)',width:'max-content',zIndex:100,padding:2,borderColor:'#e4e4e7',borderStyle:'solid',borderWidth:1,borderRadius:26,backgroundColor:'rgba(255,255,255,.97)',backdropFilter:'blur(16px)',boxShadow:'0 4px 18px rgba(20,20,24,.1)'},
 bottomLink:{display:'grid',width:44,height:44,placeItems:'center',color:'#717178',borderRadius:'50%'},
 bottomLinkActive:{color:$.ink,backgroundColor:'#eeeef0'},
});
