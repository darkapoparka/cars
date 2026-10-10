import type {MetadataRoute} from 'next';
import {dealer, isDealer} from '@/lib/dealer-config';
import {assetPath} from '@/lib/paths';
export default function manifest(): MetadataRoute.Manifest {
  return {id: assetPath('/'), name: dealer.name, short_name: dealer.shortName,
    description: dealer.previewNotice, lang: dealer.defaultLocale,
    start_url: assetPath('/' + dealer.defaultLocale), scope: assetPath('/'),
    display: 'standalone', background_color: '#ffffff', theme_color: '#262629',
    icons: [{src: assetPath(dealer.logo.icon), sizes: isDealer ? "512x512" : 'any',
      type: isDealer ? 'image/png' : 'image/svg+xml', purpose: 'any'}]};
}
