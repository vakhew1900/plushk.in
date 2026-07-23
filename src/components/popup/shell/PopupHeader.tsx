import type { Mode } from '@/types/mode';
import { Button } from '@/components/ui/button';
import { IconArrowRight, IconLogo } from '@/components/icons';
import { useTranslation } from '@/hooks/useTranslation';
import styles from './PopupHeader.module.css';

interface Props {
  mode: Mode;
  onBack?: () => void;
}

export function PopupHeader({ mode, onBack }: Props) {
  const { translate: t } = useTranslation();
  return (
    <div className={styles.header}>
      {onBack && (
        <Button
          variant="ghost"
          size="icon-sm"
          onClick={onBack}
          aria-label={t('popup.settings.back')}
          className={styles.back}
        >
          <IconArrowRight size={14} />
        </Button>
      )}

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
