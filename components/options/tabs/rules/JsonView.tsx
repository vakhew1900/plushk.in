import { useState } from 'react';
import { clsx } from 'clsx';
import styles from './JsonView.module.css';

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

      <textarea
        className={styles.editor}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        spellCheck={false}
        autoComplete="off"
        autoCorrect="off"
      />

      <div className={clsx(styles.footer, isValid ? styles.valid : styles.invalid)}>
        <span className={clsx(styles.dot, isValid ? styles.dotValid : styles.dotInvalid)} />
        {isValid ? `Валидный JSON · ${condCount} условий` : 'Ошибка синтаксиса JSON'}
      </div>
    </div>
  );
}
