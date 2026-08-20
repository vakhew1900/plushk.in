import CodeMirror from '@uiw/react-codemirror';
import { json as jsonLang } from '@codemirror/lang-json';
import type { ReactNode } from 'react';
import { useTheme } from '@/hooks/useTheme';
import { Theme } from '@/types/theme';
import { dracula, parchment } from './codeTheme';
import styles from './CodeView.module.css';

interface Props {
  value: string;
  filename: string;
  editable?: boolean;
  onChange?: (value: string) => void;
  footer?: ReactNode;
}

export function CodeView({ value, filename, editable = true, onChange, footer }: Props) {
  const { resolvedTheme } = useTheme();

  return (
    <div className={styles.wrap}>
      <div className={styles.toolbar}>
        <span className={styles.filename}>{filename}</span>
      </div>

      <CodeMirror
        value={value}
        extensions={[jsonLang()]}
        theme={resolvedTheme === Theme.LIGHT ? parchment : dracula}
        editable={editable}
        onChange={onChange}
        minHeight="180px"
        maxHeight="360px"
        className={styles.editor}
        basicSetup={{
          lineNumbers:            false,
          foldGutter:             true,
          highlightActiveLine:    editable,
          indentOnInput:          editable,
          bracketMatching:        true,
          closeBrackets:          editable,
          autocompletion:         false,
          dropCursor:             false,
          allowMultipleSelections:false,
        }}
      />

      {footer && <div className={styles.footer}>{footer}</div>}
    </div>
  );
}
