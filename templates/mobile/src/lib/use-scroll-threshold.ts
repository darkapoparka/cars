'use client';
import { useEffect, useState } from 'react';
/** Scroll-derived presentation only; all data remains independent from viewport position. */
export function useScrollThreshold(threshold: number): boolean {
  const [past, setPast] = useState(false);
  useEffect(() => {
    const update = () => setPast(window.scrollY > threshold);
    update();
    window.addEventListener('scroll', update, { passive: true });
    return () => window.removeEventListener('scroll', update);
  }, [threshold]);
  return past;
}
