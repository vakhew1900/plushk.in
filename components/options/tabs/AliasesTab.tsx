import { Button } from '@/components/ui/button';
import { AliasRow } from './aliases/AliasRow';

const ALIASES = [
  { name: 'reddit', domains: ['reddit.com', 'old.reddit.com', 'reddit.kz'] },
  { name: 'facebook', domains: ['www.facebook.com', 'm.facebook.com'] },
  { name: 'habr', domains: ['habr.com', 'habrahabr.ru'] },
  { name: 'pinterest', domains: ['pinterest.com', 'ru.pinterest.com', 'pin.it'] },
];

const VARIABLES = [
  { name: 'reddit', fields: [{ k: 'title', v: 'body h1.post-title' }, { k: 'author', v: 'a.author-name' }, { k: 'content', v: 'div.post-body' }] },
  { name: 'habr', fields: [{ k: 'title', v: 'h1.tm-title' }, { k: 'author', v: 'a.tm-user__nickname' }] },
];

export function AliasesTab() {
  return (
    <div className="max-w-[680px]">
      <h1 className="m-0 mb-1 text-[22px] font-bold text-text">Алиасы</h1>
      <p className="m-0 mb-6 text-[13.5px] text-muted">Алиасы доменов, переменные извлечения и резервные копии.</p>

      {/* Aliases */}
      <section className="mb-[22px]">
        <div className="flex items-center mb-[5px]">
          <h2 className="m-0 text-[15px] font-bold text-text">Алиасы доменов</h2>
          <Button variant="outline" size="sm" className="ml-auto">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
              <path d="M12 5v14M5 12h14" />
            </svg>
            Алиас
          </Button>
        </div>
        <p className="m-0 mb-3 text-[12.5px] text-muted">Один псевдоним для нескольких доменов — например, региональных зеркал.</p>
        <div className="border border-border rounded-[11px] overflow-hidden">
          {ALIASES.map((a, i) => (
            <AliasRow key={a.name} {...a} isLast={i === ALIASES.length - 1} />
          ))}
        </div>
      </section>

      {/* Variables */}
      <section className="mb-[22px]">
        <h2 className="m-0 mb-[5px] text-[15px] font-bold text-text">Переменные</h2>
        <p className="m-0 mb-3 text-[12.5px] text-muted">Поля-псевдонимы для путей по HTML-дереву страницы. Используются в правилах и при экспорте.</p>
        <div className="flex flex-col gap-[11px]">
          {VARIABLES.map((v) => (
            <div key={v.name} className="border border-border rounded-[11px] overflow-hidden">
              <div className="flex items-center gap-2 px-[14px] py-[10px] bg-bg2 border-b border-border">
                <span className="font-mono font-bold text-[12.5px] text-accent">{v.name}</span>
                <span className="text-[11px] text-faint">{v.fields.length} поля</span>
              </div>
              {v.fields.map((f, i) => (
                <div key={f.k} className={`flex items-center gap-3 px-[14px] py-[9px] ${i < v.fields.length - 1 ? 'border-b border-border' : ''}`}>
                  <span className="w-[90px] shrink-0 font-mono font-semibold text-[12.5px] text-text">{f.k}</span>
                  <span className="text-faint">→</span>
                  <span className="font-mono text-[12.5px] text-muted">{f.v}</span>
                </div>
              ))}
            </div>
          ))}
        </div>
      </section>

      {/* Export / Import */}
      <section className="mb-[22px]">
        <h2 className="m-0 mb-[5px] text-[15px] font-bold text-text">Экспорт / Импорт</h2>
        <p className="m-0 mb-3 text-[12.5px] text-muted">Резервная копия всех правил, алиасов и переменных одним файлом.</p>
        <div className="flex gap-[10px]">
          <Button variant="outline">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
              <path d="M12 3v12M7 11l5 4 5-4M5 21h14" />
            </svg>
            Экспорт .json
          </Button>
          <Button variant="outline">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
              <path d="M12 15V3M7 7l5-4 5 4M5 21h14" />
            </svg>
            Импорт
          </Button>
        </div>
      </section>

      {/* Theme */}
      <section>
        <h2 className="m-0 mb-3 text-[15px] font-bold text-text">Тема</h2>
        <div className="flex gap-[3px] bg-bg2 border border-border rounded-[9px] p-[3px] w-fit">
          {(['Тёмная', 'Светлая', 'Системная'] as const).map((t, i) => (
            <button
              key={t}
              className={`px-[18px] py-2 border-0 rounded-[6px] cursor-pointer font-semibold text-[13px] transition-colors ${i === 0 ? 'bg-bg text-text shadow-sm' : 'bg-transparent text-muted hover:text-text'}`}
            >
              {t}
            </button>
          ))}
        </div>
      </section>
    </div>
  );
}
