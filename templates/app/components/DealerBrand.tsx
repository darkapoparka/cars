import {dealer, isDealer} from '@/lib/dealer-config';
import {assetPath} from '@/lib/paths';
/** Keep the approved image bytes, contextual contrast and intrinsic aspect ratio. */
export default function DealerBrand({compact = false, hero = false, onDark = false}: {compact?: boolean; hero?: boolean; onDark?: boolean}) {
  if (!isDealer) return <span style={{display: 'inline-flex', alignItems: 'center', gap: 8}}>{hero ? <img src={assetPath(dealer.logo.icon)} alt="" width={32} height={32}/> : null}{dealer.name}</span>;
  return <img data-dealer-logo src={assetPath(onDark ? dealer.logo.dark : dealer.logo.light)} alt={dealer.name}
    width={hero ? 256 : compact ? 108 : 152} height={hero ? 64 : compact ? 26 : 32}
    style={{display: 'block', width: 'auto', maxWidth: hero ? '100%' : compact ? 108 : 152,
      height: hero ? 'auto' : compact ? 26 : 32, maxHeight: hero ? 64 : undefined, objectFit: 'contain', objectPosition: hero ? 'center' : 'left center'}}/>;
}
