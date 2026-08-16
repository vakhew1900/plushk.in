import { Text } from '@/components/ui/text';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useTranslation } from '@/hooks/useTranslation';
import { Locale } from '@/locale';
import styles from './LanguageSection.module.css';

const LOCALE_OPTIONS: Locale[] = [Locale.RU, Locale.EN];

export function LanguageSection() {
  const { translate: t, locale, setLocale } = useTranslation();

  return (
    <section className={styles.section}>
      <Text as="h2" size="subheading" className={styles.h2}>{t('languageSection.title')}</Text>
      <Select value={locale} onValueChange={(value) => setLocale(value as Locale)}>
        <SelectTrigger className={styles.trigger}>
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {LOCALE_OPTIONS.map((option) => (
            <SelectItem key={option} value={option}>
              {t(`languageSection.${option}`)}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </section>
  );
}
