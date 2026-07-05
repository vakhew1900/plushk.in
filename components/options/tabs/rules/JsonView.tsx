import { useState } from 'react';
import { clsx } from 'clsx';
import CodeMirror from '@uiw/react-codemirror';
import { json } from '@codemirror/lang-json';
import { createTheme } from '@uiw/codemirror-themes';
import { tags as t } from '@lezer/highlight';
import styles from './JsonView.module.css';

const obsidianDark = createTheme({
  theme: 'dark',
  settings: {
    background:      '#1a1a1d',
    foreground:      '#d8d8dc',
    caret:           '#7d6cf0',
    selection:       'rgba(125,108,240,0.22)',
    selectionMatch:  'rgba(125,108,240,0.12)',
    lineHighlight:   'rgba(125,108,240,0.06)',
    gutterBackground:'#1a1a1d',
    gutterForeground:'#56565f',
  },
  styles: [
    { tag: t.propertyName,      color: '#5c9ee0' },
    { tag: t.string,            color: '#5cba8f' },
    { tag: t.number,            color: '#7d6cf0' },
    { tag: [t.bool, t.null],    color: '#e0746e' },
    { tag: t.punctuation,       color: '#8b8b94' },
    { tag: t.bracket,           color: '#8b8b94' },
  ],
});

interface Props {
  initialJson: string;
  filename: string;
}

function countConditions(raw: string): number | null {
  try {
    const obj = JSON.parse(raw) as unknown;
    if (typeof obj !== 'object' || obj === null) return null;
    const or = (obj as Record<string, unknown>)['or'];
    if (!Array.isArray(or)) return null;
    return or.reduce((sum: number, group: unknown) => {
      if (typeof group !== 'object' || group === null) return sum;
      const and = (group as Record<string, unknown>)['and'];
      return sum + (Array.isArray(and) ? and.length : 0);
    }, 0);
  } catch {
    return null;
  }
}

export function JsonView({ initialJson, filename }: Props) {
  const [value, setValue] = useState(initialJson);

  const condCount = countConditions(value);
  const isValid = condCount !== null;

  return (
    <div className={styles.wrap}>
      <div className={styles.toolbar}>
        <span className={styles.filename}>{filename}</span>
      </div>

      <CodeMirror
        value={value}
        extensions={[json()]}
        theme={obsidianDark}
        onChange={setValue}
        minHeight="180px"
        maxHeight="360px"
        className={styles.editor}
        basicSetup={{
          lineNumbers:            false,
          foldGutter:             true,
          highlightActiveLine:    true,
          indentOnInput:          true,
          bracketMatching:        true,
          closeBrackets:          true,
          autocompletion:         false,
          dropCursor:             false,
          allowMultipleSelections:false,
        }}
      />

      <div className={clsx(styles.footer, isValid ? styles.valid : styles.invalid)}>
        <span className={clsx(styles.dot, isValid ? styles.dotValid : styles.dotInvalid)} />
        {isValid ? `Валидный JSON · ${condCount} условий` : 'Ошибка синтаксиса JSON'}
      </div>
    </div>
  );
}
