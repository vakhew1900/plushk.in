import { useState } from 'react';
import * as RadioGroup from '@radix-ui/react-radio-group';
import { Button } from '@/components/ui/button';
import { IconPlus, IconDownload, IconUpload } from '@/components/icons';
import { useTranslation } from '@/hooks/useTranslation';
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
  const { translate: t } = useTranslation();

  return (
    <div className={styles.wrap}>
      <h1 className={styles.h1}>{t('nav.aliases')}</h1>
      <p className={styles.lead}>{t('aliasesTab.lead')}</p>

      <section className={styles.section}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.h2}>{t('aliasesTab.aliases.title')}</h2>
          <Button variant="outline" size="sm" style={{ marginLeft: 'auto' }}>
            <IconPlus size={12} />
            {t('aliasesTab.aliases.addAlias')}
          </Button>
        </div>
        <p className={styles.sectionDesc}>{t('aliasesTab.aliases.desc')}</p>
        <div className={styles.table}>
          {ALIASES.map((a) => <AliasRow key={a.name} {...a} />)}
        </div>
      </section>

      <section className={styles.section}>
        <h2 className={styles.h2} style={{ marginBottom: 5 }}>{t('aliasesTab.variables.title')}</h2>
        <p className={styles.sectionDesc}>{t('aliasesTab.variables.desc')}</p>
        <div className={styles.variableList}>
          {VARIABLES.map((v) => (
            <div key={v.name} className={styles.variableBlock}>
              <div className={styles.variableHead}>
                <span className={styles.variableName}>{v.name}</span>
                <span className={styles.variableCount}>{t('aliasesTab.variables.fieldsCount', { count: v.fields.length })}</span>
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
        <h2 className={styles.h2} style={{ marginBottom: 5 }}>{t('aliasesTab.export.title')}</h2>
        <p className={styles.sectionDesc}>{t('aliasesTab.export.desc')}</p>
        <div className={styles.exportRow}>
          <Button variant="outline">
            <IconDownload size={15} />
            {t('aliasesTab.export.exportButton')}
          </Button>
          <Button variant="outline">
            <IconUpload size={15} />
            {t('aliasesTab.export.importButton')}
          </Button>
        </div>
      </section>

      <section className={styles.section}>
        <h2 className={styles.h2} style={{ marginBottom: 12 }}>{t('aliasesTab.theme.title')}</h2>
        <RadioGroup.Root value={theme} onValueChange={setTheme} className={styles.themeGroup}>
          {(['dark', 'light', 'system'] as const).map((themeOption) => (
            <RadioGroup.Item key={themeOption} value={themeOption} className={styles.themeItem}>
              {t(`aliasesTab.theme.${themeOption}`)}
            </RadioGroup.Item>
          ))}
        </RadioGroup.Root>
      </section>
    </div>
  );
}
