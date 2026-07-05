import { Button } from '@/components/ui/button';
import { IconCopy } from '@/components/icons';
import styles from './JsonEditor.module.css';

interface Token { text: string; color: string }
interface Props { json: string; filename: string; condCount: number }

function tokenize(str: string): Token[] {
  const re = /\s+|"(?:[^"\\]|\\.)*"|[{}[\]:,]|true|false|null|-?\d+(?:\.\d+)?/g;
  const raw: string[] = [];
  let m: RegExpExecArray | null;
  while ((m = re.exec(str))) raw.push(m[0]);

  return raw.map((t, i) => {
    if (/^\s+$/.test(t)) return { text: t, color: 'var(--text)' };
    if (t[0] === '"') {
      const j = raw.slice(i + 1).findIndex((x) => !/^\s+$/.test(x));
      return { text: t, color: raw[i + 1 + j] === ':' ? 'var(--blue)' : 'var(--green)' };
    }
    if (/^[{}[\]:,]$/.test(t)) return { text: t, color: 'var(--muted)' };
    if (t === 'true' || t === 'false' || t === 'null') return { text: t, color: 'var(--red)' };
    return { text: t, color: 'var(--accent)' };
  });
}

export function JsonEditor({ json, filename, condCount }: Props) {
  const tokens = tokenize(json);
  return (
    <div className={styles.wrap}>
      <div className={styles.toolbar}>
        <span className={styles.filename}>{filename}</span>
        <Button variant="ghost" size="icon-sm" style={{ marginLeft: 'auto', color: 'var(--muted)' }}>
          <IconCopy size={12} />
        </Button>
      </div>

      <pre className={styles.pre}>
        {tokens.map((t, i) => <span key={i} style={{ color: t.color }}>{t.text}</span>)}
      </pre>

      <div className={styles.footer}>
        <span className={styles.dot} />
        Валидный JSON · {condCount} условия
      </div>
    </div>
  );
}
