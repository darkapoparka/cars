import type {Metadata} from 'next';
import type {ReactNode} from 'react';

export const metadata: Metadata = {robots: {index: false, follow: false}};

export default function HomeAlternativeLayout({children}: {children: ReactNode}) {
  return children;
}
