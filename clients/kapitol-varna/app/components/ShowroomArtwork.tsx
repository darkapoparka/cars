'use client';

import {useState, type ReactNode} from 'react';
import * as stylex from '@stylexjs/stylex';

/** Small decorative assets share fixed framing and an SVG failure fallback. */
export default function ShowroomArtwork({src, size, fallback, intrinsicSize = 64}: {src: string; size: number; fallback: ReactNode; intrinsicSize?: number}) {
  const [failedSource, setFailedSource] = useState<string | null>(null);
  return <span aria-hidden="true" data-showroom-artwork={src} {...stylex.props(s.frame(size))}>
    {failedSource === src ? fallback : <img src={src} alt="" width={intrinsicSize} height={intrinsicSize} loading="eager" decoding="async" onError={() => setFailedSource(src)} {...stylex.props(s.image)}/>}
  </span>;
}

const s = stylex.create({
  frame: (size: number) => ({display: 'inline-flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, width: size, height: size, pointerEvents: 'none'}),
  image: {display: 'block', width: '100%', height: '100%', objectFit: 'contain'},
});
