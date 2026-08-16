import CodeMirror from '@uiw/react-codemirror';
import type { Extension } from '@codemirror/state';
import { clsx } from 'clsx';
import { obsidianDark } from '@/components/options/code/codeTheme';
import styles from './code-input.module.css';

interface Props {
  value: string;
  onChange: (value: string) => void;
  extensions?: Extension[];
  placeholder?: string;
  className?: string;
}

export function CodeInput({ value, onChange, extensions = [], placeholder, className }: Props) {
  return (
    <CodeMirror
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      theme={obsidianDark}
      extensions={extensions}
      className={clsx(styles.input, className)}
      basicSetup={{
        lineNumbers:            false,
        foldGutter:             false,
        highlightActiveLine:    false,
        indentOnInput:          false,
        bracketMatching:        true,
        closeBrackets:          true,
        autocompletion:         false,
        dropCursor:             false,
        allowMultipleSelections:false,
      }}
    />
  );
}
