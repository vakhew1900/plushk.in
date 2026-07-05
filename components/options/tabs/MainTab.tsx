import { useState } from 'react';
import { useTranslation } from '@/hooks/useTranslation';
import { ModeCard } from './main/ModeCard';
import { ActivityItem } from './main/ActivityItem';
import styles from './MainTab.module.css';

const MODES = [
  { key: 'auto', showFallback: true },
  { key: 'hint' },
  { key: 'off' },
] as const;

const ACTIVITY = [
  { letter: 'r', color: '#e0746e', title: 'r/webdev — Show your project', folder: 'Соцсети / Reddit', rule: 'Соцсети', time: '2 мин назад' },
  { letter: 'h', color: '#5c9ee0', title: 'Архитектура браузерных расширений', folder: 'Чтение', rule: 'Чтение', time: '18 мин назад' },
  { letter: 'p', color: '#d06ec0', title: 'Dashboard UI inspiration board', folder: 'Инспирация', rule: 'Дизайн', time: '1 ч назад' },
  { letter: 'f', color: '#5c7ce0', title: 'Meta — открытая вакансия', folder: 'Соцсети', rule: 'Соцсети', time: '3 ч назад' },
];

export function MainTab() {
  const [mode, setMode] = useState('auto');
  const { translate: t } = useTranslation();
  return (
    <div>
      <h1 className={styles.h1}>{t('common.modeSectionTitle')}</h1>
      <p className={styles.lead}>{t('mainTab.lead')}</p>

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
          />
        ))}
      </div>

      <h2 className={styles.h2}>{t('mainTab.recentActivity')}</h2>
      <div className={styles.activityWrap}>
        {ACTIVITY.map((a, i) => <ActivityItem key={i} {...a} />)}
      </div>
    </div>
  );
}
