import CodeMirror from '@uiw/react-codemirror';
import { clsx } from 'clsx';
import { obsidianDark } from '@/components/options/codeTheme';
import styles from './code-input.module.css';

interface Props {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

export function CodeInput({ value, onChange, placeholder, className }: Props) {
  return (
    <CodeMirror
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      theme={obsidianDark}
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
