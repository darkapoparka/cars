'use client';

import {ArrowLeft} from 'lucide-react';
import IconButton, {type IconButtonAction, type IconButtonTone} from '@/components/IconButton';
import {useCopy} from '@/lib/locale';

type BackButtonProps = IconButtonAction & {label?: string; tone?: IconButtonTone};

export default function BackButton({label = 'Back home', ...props}: BackButtonProps) {
  const tx = useCopy();
  return <IconButton {...props} icon={ArrowLeft} label={tx(label)}/>;
}
