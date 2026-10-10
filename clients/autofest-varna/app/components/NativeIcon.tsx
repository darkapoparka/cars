'use client';

import {useCopy} from '@/lib/locale';
import * as stylex from '@stylexjs/stylex';

// These codepoints were verified in the installed app's accessibility captures.
const glyphs = {
  home:'\uec3f',homeSelected:'\uec3e',stores:'\uec3d',storesSelected:'\uec3c',
  menu:'\uebb0',menuSelected:'\uebb1',search:'\ue97a',heart:'\ueabe',
  filter:'\uebac',sort:'\ueb2e',chevronDown:'\uec83',dirham:'\uebd7',close:'\uec5a',
} as const;
export type NativeIconName = keyof typeof glyphs;
export default function NativeIcon({name,size=24}: {name:NativeIconName;size?:number}) {
  const tx = useCopy();

  return <span aria-hidden="true" data-native-icon={name} style={{fontSize:size}} {...stylex.props(s.icon)}>{tx(glyphs[name])}</span>;
}
const s=stylex.create({
  icon:{display:'inline-block',flexShrink:0,width:'1em',height:'1em',fontFamily:'Cars24ReferenceIcons',fontStyle:'normal',fontWeight:400,lineHeight:1,textAlign:'center',verticalAlign:'middle',textTransform:'none',letterSpacing:0,userSelect:'none'},
});
