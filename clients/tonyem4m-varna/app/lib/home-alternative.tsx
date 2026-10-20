'use client';

import {createContext, useContext, type ReactNode} from 'react';
export {isHomeAlternative, primaryHomePath, homeAlternativeHref} from './home-paths';

const AlternativeHomeContext = createContext(false);
export function HomeAlternativeProvider({enabled, children}: {enabled: boolean; children: ReactNode}) {
  return <AlternativeHomeContext.Provider value={enabled}>{children}</AlternativeHomeContext.Provider>;
}

export function useHomeAlternative() {
  return useContext(AlternativeHomeContext);
}
