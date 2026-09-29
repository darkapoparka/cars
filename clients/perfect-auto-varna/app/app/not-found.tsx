import {getCopy} from '@/lib/locale-server';
﻿import Link from '@/components/AppLink';
import * as stylex from '@stylexjs/stylex';
import { tokens as $ } from '@/app/tokens.stylex';
export default async function NotFound(){
  const tx = await getCopy();
return <div {...stylex.props(styles.page)}><span>{tx("404")}</span><h1>{tx("This car has moved on.")}</h1><p>{tx("The listing may have been sold or reserved.")}</p><Link href="/cars">{tx("Browse available cars")}</Link></div>}
const styles=stylex.create({page:{display:'grid',minHeight:'80vh',placeItems:'center',alignContent:'center',gap:12,padding:24,textAlign:'center',backgroundColor:$.surfaceAlt}});
