'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ChevronDown, ChevronRight, Clock3 } from 'lucide-react';
import * as stylex from '@stylexjs/stylex';
import { showroom } from '@/lib/showroom';
import { useLocale } from '@/lib/use-locale';
import { colors } from '@/styles/tokens.stylex';

const s = stylex.create({
  intro: { display: { default: 'block', '@media (min-width: 700px)': 'none' }, minWidth: 0 },
  title: { fontSize: 24, lineHeight: '32px', fontWeight: 500, marginBottom: 6 },
  description: { color: colors.muted, fontSize: 16, lineHeight: '24px' },
  guide: {
    display: { default: 'flex', '@media (min-width: 700px)': 'none' },
    flexDirection: 'column',
    gap: 16,
    minWidth: 0,
    paddingTop: 8,
    paddingBottom: 48,
  },
  heading: { fontSize: 18, lineHeight: '26px', fontWeight: 500, marginBottom: 12 },
  questions: {
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: colors.cardLine,
    borderRadius: 16,
    backgroundColor: colors.background,
    overflow: 'hidden',
  },
  question: {
    borderBottomWidth: 1,
    borderBottomStyle: 'solid',
    borderBottomColor: colors.cardLine,
  },
  lastQuestion: { borderBottomWidth: 0 },
  trigger: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
    width: '100%',
    minHeight: 52,
    paddingBlock: 12,
    paddingInline: 14,
    borderWidth: 0,
    backgroundColor: { default: colors.background, ':hover': colors.stripe },
    color: colors.text,
    fontSize: 16,
    lineHeight: '24px',
    fontWeight: 500,
    textAlign: 'left',
    cursor: 'pointer',
    outlineColor: colors.accent,
    outlineOffset: -3,
  },
  questionText: { minWidth: 0, overflowWrap: 'anywhere' },
  chevron: { flexShrink: 0, color: colors.muted },
  expanded: { transform: 'rotate(180deg)' },
  answer: { paddingInline: 14, paddingBottom: 14 },
  answerText: { color: colors.muted, fontSize: 16, lineHeight: '24px', overflowWrap: 'anywhere' },
  serviceLink: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: 4,
    minHeight: 44,
    marginTop: 4,
    color: colors.text,
    fontSize: 16,
    lineHeight: '24px',
    fontWeight: 500,
    textDecoration: 'none',
    outlineColor: colors.accent,
    outlineOffset: 2,
  },
  hours: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: 10,
    padding: 16,
    borderRadius: 16,
    backgroundColor: colors.stripe,
  },
  hoursIcon: { flexShrink: 0, color: colors.muted, marginTop: 2 },
  hoursTitle: { fontSize: 16, lineHeight: '24px', fontWeight: 500, marginBottom: 4 },
});

const questions = [
  {
    id: 'viewing',
    question: 'How do I arrange a viewing?',
    answer:
      'Mention the car you are interested in and a day and time that suit you in your enquiry.',
  },
  {
    id: 'enquiry',
    question: 'What should I include?',
    answer: 'The car or service you are interested in, plus a phone number or email address.',
  },
  {
    id: 'services',
    question: 'Questions about services?',
    answer: 'Explore the options for import, finance, inspections and selling a car.',
  },
] as const;

export function ShowroomContactIntro() {
  const { t } = useLocale();
  return (
    <header data-mobile-contact-intro {...stylex.props(s.intro)}>
      <h1 {...stylex.props(s.title)}>{t('Contact us')}</h1>
      <p {...stylex.props(s.description)}>{t('For a car, a viewing or a service.')}</p>
    </header>
  );
}

export function ShowroomContactGuide() {
  const { t } = useLocale();
  const [openQuestion, setOpenQuestion] = useState<string | null>(null);
  return (
    <section
      data-mobile-contact-guide
      aria-labelledby="contact-visit-heading"
      {...stylex.props(s.guide)}
    >
      {showroom.hours.length > 0 && (
        <div data-mobile-contact-hours {...stylex.props(s.hours)}>
          <Clock3 size={20} strokeWidth={1.8} aria-hidden="true" {...stylex.props(s.hoursIcon)} />
          <div>
            <h2 {...stylex.props(s.hoursTitle)}>{t('Opening hours')}</h2>
            {showroom.hours.map((hours) => (
              <p key={hours} {...stylex.props(s.answerText)}>
                {hours}
              </p>
            ))}
          </div>
        </div>
      )}
      <div>
        <h2 id="contact-visit-heading" {...stylex.props(s.heading)}>
          {t('Before your visit')}
        </h2>
        <div {...stylex.props(s.questions)}>
          {questions.map(({ id, question, answer }, index) => {
            const expanded = openQuestion === id;
            return (
              <div
                key={id}
                {...stylex.props(s.question, index === questions.length - 1 && s.lastQuestion)}
              >
                <button
                  id={'contact-question-' + id}
                  data-contact-question={id}
                  type="button"
                  aria-expanded={expanded}
                  aria-controls={'contact-answer-' + id}
                  onClick={() => setOpenQuestion(expanded ? null : id)}
                  {...stylex.props(s.trigger)}
                >
                  <span {...stylex.props(s.questionText)}>{t(question)}</span>
                  <ChevronDown
                    size={18}
                    strokeWidth={1.8}
                    aria-hidden="true"
                    {...stylex.props(s.chevron, expanded && s.expanded)}
                  />
                </button>
                <div
                  id={'contact-answer-' + id}
                  role="region"
                  hidden={!expanded}
                  aria-labelledby={'contact-question-' + id}
                  {...stylex.props(s.answer)}
                >
                  <p {...stylex.props(s.answerText)}>{t(answer)}</p>
                  {id === 'services' && (
                    <Link href="/services" {...stylex.props(s.serviceLink)}>
                      {t('Services')}
                      <ChevronRight size={16} aria-hidden="true" />
                    </Link>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
