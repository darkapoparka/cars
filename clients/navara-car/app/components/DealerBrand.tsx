import {dealer} from '@/lib/dealer-config';
import {assetPath} from '@/lib/paths';
/** Keep the approved image bytes, contextual contrast and intrinsic aspect ratio. */
export default function DealerBrand({compact = false, hero = false, onDark = false, mobileOnLight = false}: {compact?: boolean; hero?: boolean; onDark?: boolean; mobileOnLight?: boolean}) {
  const logo = <img data-dealer-logo src={assetPath(onDark ? dealer.logo.dark : dealer.logo.light)} alt={dealer.name}
    width={hero ? 256 : compact ? 108 : 152} height={hero ? 64 : compact ? 26 : 32}
    style={{display: 'block', width: 'auto', maxWidth: hero ? '100%' : compact ? 108 : 152,
      height: hero ? 'auto' : compact ? 26 : 32, maxHeight: hero ? 80 : undefined, objectFit: 'contain', objectPosition: hero ? 'center' : 'left center'}}/>;
  return mobileOnLight ? <picture style={{display: 'contents'}}><source media="(max-width: 767px)" srcSet={assetPath(dealer.logo.light)}/>{logo}</picture> : logo;
}
