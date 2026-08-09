import { useDefaultFolder } from '@/hooks/useDefaultFolder';
import { useMode } from '@/hooks/useMode';
import { useTranslation } from '@/hooks/useTranslation';
import { Mode } from '@/types/mode';
import { TabHeader } from '@/components/options/TabHeader';
import { ModeCard } from './main/ModeCard';
import { ActivityItem } from './main/ActivityItem';
import { DefaultFolderSection } from './main/DefaultFolderSection';
import { ThemeSection } from './main/ThemeSection';
import { ExportImportSection } from './main/ExportImportSection';
import styles from './MainTab.module.css';

const MODES = [
  { key: Mode.ON, showFallback: true },
  { key: Mode.OFF },
] as const;

const ACTIVITY = [
  { letter: 'r', color: '#e0746e', title: 'r/webdev — Show your project', folder: 'Соцсети / Reddit', rule: 'Соцсети', time: '2 мин назад' },
  { letter: 'h', color: '#5c9ee0', title: 'Архитектура браузерных расширений', folder: 'Чтение', rule: 'Чтение', time: '18 мин назад' },
  { letter: 'p', color: '#d06ec0', title: 'Dashboard UI inspiration board', folder: 'Инспирация', rule: 'Дизайн', time: '1 ч назад' },
  { letter: 'f', color: '#5c7ce0', title: 'Meta — открытая вакансия', folder: 'Соцсети', rule: 'Соцсети', time: '3 ч назад' },
];

export function MainTab() {
  const { mode, setMode } = useMode();
  const { defaultFolder } = useDefaultFolder();
  const { translate: t } = useTranslation();
  return (
    <div>
      <TabHeader title={t('common.modeSectionTitle')} lead={t('mainTab.lead')} />

      <div className={styles.modeList}>
        {MODES.map(({ key, ...rest }) => (
          <ModeCard
            key={key}
            {...rest}
            label={t(`modes.${key}.label`)}
            tag={t(`modes.${key}.tag`)}
            desc={t(`modes.${key}.desc`)}
            selected={mode === key}
            onSelect={() => setMode(key)}
            fallbackFolder={key === Mode.ON ? defaultFolder : undefined}
          />
        ))}
      </div>

      <DefaultFolderSection />
      <ThemeSection />
      <ExportImportSection />

      <h2 className={styles.h2}>{t('mainTab.recentActivity')}</h2>
      <div className={styles.activityWrap}>
        {ACTIVITY.map((a, i) => <ActivityItem key={i} {...a} />)}
      </div>
    </div>
  );
}
