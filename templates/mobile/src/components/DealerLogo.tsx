import Image from 'next/image';
import * as stylex from '@stylexjs/stylex';
import { capturedDealers } from '@/lib/dealers';
import { Icon } from './Icon';
const s = stylex.create({ image: { objectFit: 'contain', flexShrink: 0 } });
export function DealerLogo({ id, size = 32 }: { id: string; size?: number }) {
  const data = capturedDealers[id];
  return data ? (
    <Image src={data.logo} alt="" width={size} height={size} {...stylex.props(s.image)} />
  ) : (
    <Icon name="building" size={size} />
  );
}
