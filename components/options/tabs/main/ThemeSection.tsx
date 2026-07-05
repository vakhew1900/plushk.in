import * as RadioGroup from '@radix-ui/react-radio-group';
import { Theme } from '@/context/ThemeContext';
import { useTheme } from '@/hooks/useTheme';
import { useTranslation } from '@/hooks/useTranslation';
import styles from './ThemeSection.module.css';

const THEME_OPTIONS: Theme[] = [Theme.DARK, Theme.LIGHT, Theme.SYSTEM];

export function ThemeSection() {
  const { theme, setTheme } = useTheme();
  const { translate: t } = useTranslation();

  return (
    <section className={styles.section}>
      <h2 className={styles.h2}>{t('themeSection.title')}</h2>
      <RadioGroup.Root
        value={theme}
        onValueChange={(v) => setTheme(v as Theme)}
        className={styles.themeGroup}
      >
        {THEME_OPTIONS.map((option) => (
          <RadioGroup.Item key={option} value={option} className={styles.themeItem}>
            {t(`themeSection.${option}`)}
          </RadioGroup.Item>
        ))}
      </RadioGroup.Root>
    </section>
  );
}
