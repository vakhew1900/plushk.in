import { clsx } from 'clsx';
import { IconSettings, IconNotebook } from '@/components/icons';
import { useTranslation } from '@/hooks/useTranslation';
import styles from './SettingsTabRail.module.css';

export const SettingsTab = { SETTINGS: 'settings', NOTES: 'notes' } as const;
export type SettingsTab = typeof SettingsTab[keyof typeof SettingsTab];

interface Props {
  activeTab: SettingsTab;
  onTabChange: (tab: SettingsTab) => void;
}

export function SettingsTabRail({ activeTab, onTabChange }: Props) {
  const { translate: t } = useTranslation();

  return (
    <div className={styles.rail}>
      <button
        type="button"
        className={clsx(styles.tab, activeTab === SettingsTab.SETTINGS && styles.active)}
        title={t('bookmarkSettings.tabSettings')}
        onClick={() => onTabChange(SettingsTab.SETTINGS)}
      >
        <IconSettings size="md" />
      </button>
      <button
        type="button"
        className={clsx(styles.tab, activeTab === SettingsTab.NOTES && styles.active)}
        title={t('bookmarkSettings.tabNotes')}
        onClick={() => onTabChange(SettingsTab.NOTES)}
      >
        <IconNotebook size="md" />
      </button>
    </div>
  );
}
