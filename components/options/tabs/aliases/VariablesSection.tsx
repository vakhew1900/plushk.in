import { useTranslation } from '@/hooks/useTranslation';
import { VariableBlock } from './VariableBlock';
import styles from './VariablesSection.module.css';

const VARIABLES = [
  { name: 'reddit', fields: [{ k: 'title', v: 'body h1.post-title' }, { k: 'author', v: 'a.author-name' }, { k: 'content', v: 'div.post-body' }] },
  { name: 'habr',   fields: [{ k: 'title', v: 'h1.tm-title' }, { k: 'author', v: 'a.tm-user__nickname' }] },
];

export function VariablesSection() {
  const { translate: t } = useTranslation();

  return (
    <section className={styles.section}>
      <h2 className={styles.h2}>{t('variablesSection.title')}</h2>
      <p className={styles.sectionDesc}>{t('variablesSection.desc')}</p>
      <div className={styles.variableList}>
        {VARIABLES.map((v) => <VariableBlock key={v.name} {...v} />)}
      </div>
    </section>
  );
}
