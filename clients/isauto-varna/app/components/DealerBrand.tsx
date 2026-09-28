import {dealer, isDealer} from '@/lib/dealer-config';
import {assetPath} from '@/lib/paths';
/** Keep the approved image bytes, contextual contrast and intrinsic aspect ratio. */
export default function DealerBrand({compact = false}: {compact?: boolean}) {
  if (!isDealer) return <span>{dealer.name}</span>;
  return <img data-dealer-logo src={assetPath(dealer.logo.light)} alt={dealer.name}
    width={compact ? 108 : 152} height={compact ? 26 : 32}
    style={{display: 'block', width: 'auto', maxWidth: compact ? 108 : 152,
      height: compact ? 26 : 32, objectFit: 'contain', objectPosition: 'left center'}}/>;
}
