import { Button } from '@/components/ui/button';

interface Token { text: string; color: string }

interface Props {
  json: string;
  filename: string;
  condCount: number;
}

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
    <div className="border border-border rounded-[9px] overflow-hidden">
      <div className="flex items-center gap-2 px-[13px] py-[9px] border-b border-border bg-bg">
        <span className="font-mono text-[11.5px] text-muted">{filename}</span>
        <Button variant="ghost" size="icon-sm" className="ml-auto text-muted">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
            <rect x="9" y="9" width="11" height="11" rx="2" />
            <path d="M5 15V5a2 2 0 0 1 2-2h10" />
          </svg>
        </Button>
      </div>

      <pre className="m-0 px-4 py-[14px] bg-bg font-mono text-[12.5px] leading-[1.7] whitespace-pre overflow-auto max-h-[300px]">
        {tokens.map((t, i) => (
          <span key={i} style={{ color: t.color }}>{t.text}</span>
        ))}
      </pre>

      <div className="flex items-center gap-[7px] px-[13px] py-[9px] border-t border-border bg-bg text-[11.5px] text-green font-semibold">
        <span className="w-[7px] h-[7px] rounded-full bg-green" />
        Валидный JSON · {condCount} условия
      </div>
    </div>
  );
}
