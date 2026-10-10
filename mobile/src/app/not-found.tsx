'use client';
import * as stylex from '@stylexjs/stylex';
import { Header } from '@/components/Header';
import { Button, ui } from '@/components/ui';
export default function NotFound() {
  return (
    <>
      <Header title="Not found" back="/" />
      <section {...stylex.props(ui.empty)}>
        <h1 {...stylex.props(ui.heading)}>This page is not available</h1>
        <p>The vehicle or page is not in this local reference.</p>
        <Button href="/">Back to home</Button>
      </section>
    </>
  );
}
