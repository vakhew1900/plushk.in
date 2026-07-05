import type { Mode } from './PopupModeSelector';
import { IconLogo } from '@/components/icons';
import { useTranslation } from '@/hooks/useTranslation';
import styles from './PopupHeader.module.css';

interface Props { mode: Mode }

export function PopupHeader({ mode }: Props) {
  const { translate: t } = useTranslation();
  return (
    <div className={styles.header}>
      <div className={styles.icon}>
        <IconLogo size={20} />
      </div>

      <div className={styles.meta}>
        <div className={styles.name}>{t('popup.appName')}</div>
        <div className={styles.sub}>{t('popup.appSub')}</div>
      </div>

      <span className={styles.status}>
        <span className={styles.dot} />
        {t(`modes.${mode}.label`)}
      </span>
    </div>
  );
}
