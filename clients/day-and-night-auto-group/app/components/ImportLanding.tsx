'use client';

import {useState} from 'react';
import {Heart} from 'lucide-react';
import * as stylex from '@stylexjs/stylex';
import PageHeader from '@/components/PageHeader';
import IconButton from '@/components/IconButton';
import ImportCountryPicker from '@/components/ImportCountryPicker';
import {useCopy} from '@/lib/locale';
import {media, tokens as $} from '@/app/tokens.stylex';

export default function ImportLanding() {
  const tx = useCopy();
  const [country, setCountry] = useState('all');
  return <div {...stylex.props(s.screen)}>
    <PageHeader compact onRail title={tx('Import')} backHref="/services" backLabel="Back to services" action={<IconButton href="/saved" label={tx('Saved cars')} icon={Heart} tone="rail"/>}/>
    <main {...stylex.props(s.content)}><ImportCountryPicker country={country} onCountryChange={setCountry} standalone/></main>
  </div>;
}

const s = stylex.create({
  screen: {minHeight: '100vh', paddingBottom: 'calc(84px + env(safe-area-inset-bottom))', color: $.ink, backgroundColor: $.surface},
  content: {maxWidth: $.content, marginInline: 'auto', paddingTop: 4, paddingInline: {[media.mobile]: 12, default: 28}, paddingBottom: 24},
});
