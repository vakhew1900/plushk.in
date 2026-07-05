import { useState } from 'react';
import * as RadioGroup from '@radix-ui/react-radio-group';
import { Button } from '@/components/ui/button';
import { IconPlus, IconDownload, IconUpload } from '@/components/icons';
import { AliasRow } from './aliases/AliasRow';
import styles from './AliasesTab.module.css';

const ALIASES = [
  { name: 'reddit',    domains: ['reddit.com', 'old.reddit.com', 'reddit.kz'] },
  { name: 'facebook',  domains: ['www.facebook.com', 'm.facebook.com'] },
  { name: 'habr',      domains: ['habr.com', 'habrahabr.ru'] },
  { name: 'pinterest', domains: ['pinterest.com', 'ru.pinterest.com', 'pin.it'] },
];

const VARIABLES = [
  { name: 'reddit', fields: [{ k: 'title', v: 'body h1.post-title' }, { k: 'author', v: 'a.author-name' }, { k: 'content', v: 'div.post-body' }] },
  { name: 'habr',   fields: [{ k: 'title', v: 'h1.tm-title' }, { k: 'author', v: 'a.tm-user__nickname' }] },
];

export function AliasesTab() {
  const [theme, setTheme] = useState('dark');

  return (
    <div className={styles.wrap}>
      <h1 className={styles.h1}>Алиасы</h1>
      <p className={styles.lead}>Алиасы доменов, переменные извлечения и резервные копии.</p>

      <section className={styles.section}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.h2}>Алиасы доменов</h2>
          <Button variant="outline" size="sm" style={{ marginLeft: 'auto' }}>
            <IconPlus size={12} />
            Алиас
          </Button>
        </div>
        <p className={styles.sectionDesc}>Один псевдоним для нескольких доменов — например, региональных зеркал.</p>
        <div className={styles.table}>
          {ALIASES.map((a) => <AliasRow key={a.name} {...a} />)}
        </div>
      </section>

      <section className={styles.section}>
        <h2 className={styles.h2} style={{ marginBottom: 5 }}>Переменные</h2>
        <p className={styles.sectionDesc}>Поля-псевдонимы для путей по HTML-дереву страницы. Используются в правилах и при экспорте.</p>
        <div className={styles.variableList}>
          {VARIABLES.map((v) => (
            <div key={v.name} className={styles.variableBlock}>
              <div className={styles.variableHead}>
                <span className={styles.variableName}>{v.name}</span>
                <span className={styles.variableCount}>{v.fields.length} поля</span>
              </div>
              {v.fields.map((f) => (
                <div key={f.k} className={styles.fieldRow}>
                  <span className={styles.fieldKey}>{f.k}</span>
                  <span className={styles.fieldArrow}>→</span>
                  <span className={styles.fieldValue}>{f.v}</span>
                </div>
              ))}
            </div>
          ))}
        </div>
      </section>

      <section className={styles.section}>
        <h2 className={styles.h2} style={{ marginBottom: 5 }}>Экспорт / Импорт</h2>
        <p className={styles.sectionDesc}>Резервная копия всех правил, алиасов и переменных одним файлом.</p>
        <div className={styles.exportRow}>
          <Button variant="outline">
            <IconDownload size={15} />
            Экспорт .json
          </Button>
          <Button variant="outline">
            <IconUpload size={15} />
            Импорт
          </Button>
        </div>
      </section>

      <section className={styles.section}>
        <h2 className={styles.h2} style={{ marginBottom: 12 }}>Тема</h2>
        <RadioGroup.Root value={theme} onValueChange={setTheme} className={styles.themeGroup}>
          {(['dark', 'light', 'system'] as const).map((t) => (
            <RadioGroup.Item key={t} value={t} className={styles.themeItem}>
              {t === 'dark' ? 'Тёмная' : t === 'light' ? 'Светлая' : 'Системная'}
            </RadioGroup.Item>
          ))}
        </RadioGroup.Root>
      </section>
    </div>
  );
}
