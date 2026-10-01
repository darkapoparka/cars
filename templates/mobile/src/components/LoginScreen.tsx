'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { localReturnPath } from '@/lib/navigation';
import Image from 'next/image';
import * as stylex from '@stylexjs/stylex';
import { colors } from '@/styles/tokens.stylex';
import { patchState } from '@/lib/store';
import { Header } from './Header';
import { Button, CheckRow, Modal, ui } from './ui';
const s = stylex.create({
  page: {
    backgroundColor: colors.surface,
    minHeight: 'calc(100dvh - 60px)',
    paddingTop: 24,
    paddingBottom: 32,
  },
  card: {
    backgroundColor: colors.background,
    borderBottomLeftRadius: 16,
    borderBottomRightRadius: 16,
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: colors.line,
    maxWidth: 600,
    marginInline: 'auto',
    overflow: 'hidden',
  },
  tabs: { display: 'grid', gridTemplateColumns: '1fr 1fr', height: 54 },
  tab: {
    borderWidth: 0,
    borderBottomWidth: 1,
    borderBottomStyle: 'solid',
    borderBottomColor: colors.line,
    backgroundColor: '#f5f7fa',
    color: colors.muted,
    fontSize: 16,
    fontWeight: 700,
  },
  active: {
    backgroundColor: colors.background,
    color: colors.accent,
    borderBottomColor: 'transparent',
  },
  content: { padding: 18, paddingTop: 28, paddingBottom: 26 },
  title: {
    fontFamily: 'var(--font-hero)',
    fontSize: 24,
    fontWeight: 700,
    lineHeight: '32px',
    marginBottom: 20,
  },
  social: {
    width: '100%',
    height: 56,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 10,
    borderWidth: 1.5,
    borderStyle: 'solid',
    borderColor: colors.purpleLine,
    borderRadius: 8,
    backgroundColor: colors.background,
    color: colors.purple,
    fontSize: 16,
    fontWeight: 700,
    marginBottom: 8,
  },
  logo: { width: 20, height: 20, objectFit: 'contain' },
  or: {
    display: 'flex',
    gap: 18,
    alignItems: 'center',
    marginBlock: 16,
    color: colors.text,
    fontSize: 14,
  },
  rule: { flex: '1', height: 1, backgroundColor: '#818592' },
  label: {
    display: 'flex',
    flexDirection: 'column',
    gap: 4,
    fontSize: 14,
    fontWeight: 700,
    marginTop: 20,
  },
  input: { height: 56, backgroundColor: colors.background, opacity: 1, cursor: 'not-allowed' },
  forgot: {
    display: 'block',
    textAlign: 'left',
    padding: 0,
    marginTop: 8,
    marginBottom: 20,
    borderWidth: 0,
    backgroundColor: 'transparent',
    color: colors.text,
    textDecoration: 'underline',
    fontSize: 14,
  },
  submit: {
    width: '100%',
    height: 56,
    borderRadius: 8,
    borderWidth: 0,
    backgroundColor: colors.accent,
    color: '#fff',
    fontSize: 16,
    fontWeight: 700,
    marginTop: 0,
  },
  demo: {
    maxWidth: 600,
    marginInline: 'auto',
    padding: 18,
    display: 'flex',
    flexDirection: 'column',
    gap: 12,
  },
  notice: { fontSize: 12, lineHeight: '18px', color: colors.muted },
});
export function LoginScreen({
  next = '/profile',
  registerInitially = false,
}: {
  next?: string;
  registerInitially?: boolean;
}) {
  const router = useRouter();
  const [register, setRegister] = useState(registerInitially);
  const [dialog, setDialog] = useState('');
  const [terms, setTerms] = useState(false);
  function enterDemo() {
    patchState({ email: 'demo@example.test' });
    router.push(localReturnPath(next));
  }
  return (
    <>
      <Header title={register ? 'Register' : 'Login'} back="/profile" />
      <div {...stylex.props(s.page)}>
        <section {...stylex.props(s.card)}>
          <div {...stylex.props(s.tabs)} role="tablist" aria-label="Account access">
            <button
              type="button"
              role="tab"
              aria-selected={!register}
              onClick={() => setRegister(false)}
              {...stylex.props(s.tab, !register && s.active)}
            >
              Login
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={register}
              onClick={() => setRegister(true)}
              {...stylex.props(s.tab, register && s.active)}
            >
              Register
            </button>
          </div>
          <div {...stylex.props(s.content)}>
            <h1 {...stylex.props(s.title)}>
              {register ? 'Create your account' : 'Hello! Welcome back!'}
            </h1>
            <button
              type="button"
              onClick={() => setDialog('Sign in with Google')}
              {...stylex.props(s.social)}
            >
              <Image
                src="/images/google-auth.webp"
                alt=""
                width={20}
                height={20}
                {...stylex.props(s.logo)}
              />
              Sign in with Google
            </button>
            <button
              type="button"
              onClick={() => setDialog('Sign in with Apple')}
              {...stylex.props(s.social)}
            >
              <Image
                src="/images/apple-auth.webp"
                alt=""
                width={20}
                height={20}
                {...stylex.props(s.logo)}
              />
              Sign in with Apple
            </button>
            <div {...stylex.props(s.or)}>
              <span {...stylex.props(s.rule)} />
              or
              <span {...stylex.props(s.rule)} />
            </div>
            <label {...stylex.props(s.label)}>
              E-Mail address
              <input
                disabled
                type="email"
                autoComplete="off"
                aria-describedby="auth-local-notice"
                {...stylex.props(ui.input, s.input)}
              />
            </label>
            <label {...stylex.props(s.label)}>
              Password
              <input
                disabled
                type="password"
                autoComplete="off"
                aria-describedby="auth-local-notice"
                {...stylex.props(ui.input, s.input)}
              />
            </label>
            {register ? (
              <div {...stylex.props(ui.space)}>
                <CheckRow checked={terms} onChange={setTerms}>
                  I understand this is a local demonstration
                </CheckRow>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => setDialog('Forgotten Your Password?')}
                {...stylex.props(s.forgot)}
              >
                Forgotten Your Password?
              </button>
            )}
            <button
              type="button"
              disabled={register && !terms}
              onClick={() => setDialog(register ? 'Register' : 'Log In')}
              {...stylex.props(s.submit)}
            >
              {register ? 'Register' : 'Log In'}
            </button>
          </div>
        </section>
        <div {...stylex.props(s.demo)}>
          <p id="auth-local-notice" role="note" {...stylex.props(s.notice)}>
            Independent local UI reference. Real sign-in is disabled; no account credentials are
            collected or transmitted.
          </p>
          <Button variant="outline" onClick={enterDemo} block>
            Continue in local demo
          </Button>
        </div>
      </div>
      <Modal open={Boolean(dialog)} onClose={() => setDialog('')} title={dialog}>
        <div {...stylex.props(ui.column)}>
          <p>
            Account services are not connected in this independent interface reference. No
            credentials are collected and no request is sent.
          </p>
          <Button onClick={enterDemo} variant="purple" block>
            Continue in local demo
          </Button>
          <Button onClick={() => setDialog('')} variant="ghost" block>
            Cancel
          </Button>
        </div>
      </Modal>
    </>
  );
}
