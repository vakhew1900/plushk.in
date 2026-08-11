import * as React from 'react';
import { clsx } from 'clsx';
import styles from './text.module.css';

export type TextSize = 'heading' | 'subheading' | 'body' | 'caption' | 'code';
export type TextWeight = 'regular' | 'medium' | 'bold';
export type TextTone = 'default' | 'muted' | 'accent';

const SIZE: Record<TextSize, string> = {
  heading: styles.sizeHeading,
  subheading: styles.sizeSubheading,
  body: styles.sizeBody,
  caption: styles.sizeCaption,
  code: styles.sizeCode,
};

const WEIGHT: Record<TextWeight, string> = {
  regular: styles.weightRegular,
  medium: styles.weightMedium,
  bold: styles.weightBold,
};

const TONE: Record<TextTone, string> = {
  default: styles.toneDefault,
  muted: styles.toneMuted,
  accent: styles.toneAccent,
};

/** Sensible default weight per size — override via the `weight` prop. */
const DEFAULT_WEIGHT: Record<TextSize, TextWeight> = {
  heading: 'bold',
  subheading: 'bold',
  body: 'regular',
  caption: 'regular',
  code: 'regular',
};

/** Sensible default HTML tag per size — override via the `as` prop. */
const DEFAULT_TAG: Record<TextSize, React.ElementType> = {
  heading: 'h2',
  subheading: 'h3',
  body: 'p',
  caption: 'span',
  code: 'code',
};

interface TextProps extends React.HTMLAttributes<HTMLElement> {
  size?: TextSize;
  weight?: TextWeight;
  tone?: TextTone;
  as?: React.ElementType;
}

function Text({ className, size = 'body', weight, tone = 'default', as, ...props }: TextProps) {
  const Tag = as ?? DEFAULT_TAG[size];
  const resolvedWeight = weight ?? DEFAULT_WEIGHT[size];
  return (
    <Tag
      className={clsx(styles.text, SIZE[size], WEIGHT[resolvedWeight], TONE[tone], className)}
      {...props}
    />
  );
}

export { Text };
