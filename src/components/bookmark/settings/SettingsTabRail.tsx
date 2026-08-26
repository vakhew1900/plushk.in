import { IconSettings, IconNotebook } from '@/components/icons';
import { useTranslation } from '@/hooks/useTranslation';
import styles from './SettingsTabRail.module.css';

// "Заметки" is a visual placeholder for the future NOTE-1 — deliberately
// inert (no click handler) until that task gives it real content.
export function SettingsTabRail() {
  const { translate: t } = useTranslation();

  return (
    <div className={styles.rail}>
      <div className={styles.tab} data-active title={t('bookmarkSettings.tabSettings')}>
        <IconSettings size="sm" />
      </div>
      <div className={styles.tab} data-disabled title={t('bookmarkSettings.tabNotes')}>
        <IconNotebook size="sm" />
      </div>
    </div>
  );
}
