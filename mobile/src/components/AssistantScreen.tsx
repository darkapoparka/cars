'use client';
import { useEffect, useRef, useState } from 'react';
import * as stylex from '@stylexjs/stylex';
import { colors } from '@/styles/tokens.stylex';
import { answerLocally } from '@/lib/assistant';
import { getVehicle } from '@/lib/catalog';
import { Header } from './Header';
import { Button, IconButton, ui } from './ui';
import { Icon } from './Icon';
const s = stylex.create({
  content: { padding: 16, paddingBottom: 110, display: 'flex', flexDirection: 'column', gap: 16 },
  error: {
    backgroundColor: '#fbefc5',
    borderRadius: 12,
    padding: 16,
    paddingTop: 24,
    color: '#885400',
    display: 'flex',
    flexDirection: 'column',
    gap: 8,
  },
  errorRow: {
    display: 'flex',
    alignItems: 'center',
    gap: 24,
    paddingInline: 16,
    paddingBottom: 4,
    fontSize: 14,
    lineHeight: '20px',
  },
  errorTitle: { fontWeight: 700 },
  message: {
    padding: 16,
    borderRadius: 16,
    backgroundColor: colors.surface,
    maxWidth: '92%',
    whiteSpace: 'pre-wrap',
    fontSize: 14,
    lineHeight: '22px',
  },
  user: { backgroundColor: colors.deepPurple, color: '#fff', alignSelf: 'flex-end' },
  composer: {
    position: 'fixed',
    bottom: 0,
    left: '50%',
    transform: 'translateX(-50%)',
    maxWidth: 1100,
    width: '100%',
    padding: 16,
    borderTopWidth: 1,
    borderTopStyle: 'solid',
    borderTopColor: colors.line,
    backgroundColor: colors.background,
  },
  inputWrap: {
    display: 'flex',
    alignItems: 'center',
    height: 44,
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: '#828593',
    borderRadius: 8,
    paddingLeft: 12,
  },
  input: {
    flex: '1',
    minWidth: 0,
    borderWidth: 0,
    backgroundColor: 'transparent',
    fontSize: 16,
    color: colors.text,
    outlineOffset: 2,
  },
  send: {
    width: 44,
    height: 42,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 0,
    backgroundColor: 'transparent',
    color: colors.purple,
    opacity: { default: 1, ':disabled': 0.45 },
  },
  choices: { display: 'flex', flexWrap: 'wrap', gap: 8 },
  note: { fontSize: 12, color: colors.muted, lineHeight: '18px' },
});
type Message = { id: number; role: 'user' | 'assistant'; text: string; ids?: string[] };
export function AssistantScreen() {
  const [demo, setDemo] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const end = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (messages.length) end.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
  }, [messages]);
  function send(value = input) {
    const text = value.trim();
    if (!text) return;
    const response = answerLocally(text);
    setDemo(true);
    setMessages((previous) => [
      ...previous,
      { id: Date.now(), role: 'user', text },
      { id: Date.now() + 1, role: 'assistant', text: response.text, ids: response.ids },
    ]);
    setInput('');
  }
  return (
    <>
      <Header title="mobee (Beta)" back="/">
        <IconButton
          icon="reset"
          label="Reset conversation"
          onClick={() => {
            setMessages([]);
            setDemo(false);
          }}
        />
      </Header>
      <div {...stylex.props(s.content)}>
        {!demo ? (
          <section {...stylex.props(s.error)}>
            <div {...stylex.props(s.errorRow)}>
              <Icon name="info" size={28} />
              <div>
                <strong {...stylex.props(s.errorTitle)}>Unable to connect</strong>
                <p>Please check your internet connection and try again.</p>
              </div>
            </div>
            <Button onClick={() => setDemo(true)} block>
              Try again
            </Button>
          </section>
        ) : (
          <>
            <p {...stylex.props(s.note)}>
              Local demonstration using captured vehicles, not the live mobee AI service.
            </p>
            {messages.length === 0 && (
              <>
                <h1 {...stylex.props(ui.heading)}>Let’s find your next car</h1>
                <div {...stylex.props(s.choices)}>
                  {['Compare BMW X3 and X6', 'Cars under €60,000', 'Show me the cheapest car'].map(
                    (text) => (
                      <Button key={text} variant="outline" onClick={() => send(text)}>
                        {text}
                      </Button>
                    ),
                  )}
                </div>
              </>
            )}
            {messages.map((message) => (
              <div key={message.id} {...stylex.props(s.message, message.role === 'user' && s.user)}>
                <p>{message.text}</p>
                {message.ids && (
                  <div {...stylex.props(ui.column, ui.space)}>
                    {message.ids.map((id) => {
                      const v = getVehicle(id);
                      return (
                        v && (
                          <Button key={id} href={'/vehicle/' + id} variant="outline">
                            View {v.make} {v.model}
                          </Button>
                        )
                      );
                    })}
                  </div>
                )}
              </div>
            ))}
          </>
        )}
        <div ref={end} />
      </div>
      <form
        {...stylex.props(s.composer)}
        onSubmit={(e) => {
          e.preventDefault();
          send();
        }}
      >
        <div {...stylex.props(s.inputWrap)}>
          <input
            aria-label="Ask mobee"
            placeholder="Ask mobee"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            maxLength={1000}
            {...stylex.props(s.input)}
          />
          <button
            type="submit"
            disabled={!input.trim()}
            aria-label="Send message"
            {...stylex.props(s.send)}
          >
            <Icon name="arrow" size={24} />
          </button>
        </div>
      </form>
    </>
  );
}
