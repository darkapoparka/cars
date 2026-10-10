'use client';
import * as stylex from '@stylexjs/stylex';
import { Button, ui } from '@/components/ui';
export default function ErrorScreen({ reset }: { error: Error; reset: () => void }) {
  return (
    <section {...stylex.props(ui.empty)}>
      <h1 {...stylex.props(ui.heading)}>Something went wrong</h1>
      <p>Please try opening this screen again.</p>
      <Button onClick={reset}>Try again</Button>
      <Button href="/" variant="outline">
        Home
      </Button>
    </section>
  );
}
