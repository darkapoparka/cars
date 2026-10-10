import NextImage, {type ImageProps} from 'next/image';
import {assetPath} from '@/lib/paths';
export default function AppImage(props: ImageProps) {
  return <NextImage {...props} src={assetPath(props.src)}/>;
}
