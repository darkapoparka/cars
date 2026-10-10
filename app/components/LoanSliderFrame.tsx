'use client';

import {useCopy} from '@/lib/locale';
import type {ReactNode} from 'react';
import * as stylex from '@stylexjs/stylex';

/** Decorative native scale marks; the child remains an accessible HTML range. */
export default function LoanSliderFrame({children}: {children: ReactNode}) {
  const tx = useCopy();

  return <div {...stylex.props(s.frame)}>{tx(children)}<span aria-hidden="true" {...stylex.props(s.ticks)}/></div>;
}
const s = stylex.create({
  frame: {display:'flow-root',position:'relative'},
  ticks: {position:'absolute',top:27,left:36,right:4,height:4,pointerEvents:'none',backgroundImage:'repeating-linear-gradient(90deg,#e0e0e0 0px,#e0e0e0 1px,transparent 1px,transparent 33.4px)'},
});
