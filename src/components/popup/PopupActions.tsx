import { Button } from '@/components/ui/button';
import { IconBookmark, IconFolder } from '@/components/icons';
import { useTranslation } from '@/hooks/useTranslation';
import type { Mode } from './PopupModeSelector';
import styles from './PopupActions.module.css';

interface Props { mode: Mode }

export function PopupActions({ mode }: Props) {
  const { translate: t } = useTranslation();
  return (
    <div className={styles.wrap}>
      <Button size="lg" style={{ width: '100%' }}>
        <IconBookmark size={15} />
        {t(`popup.actions.${mode}`)}
      </Button>
      <Button variant="outline" style={{ width: '100%' }}>
        <IconFolder size={14} />
        {t('popup.changeFolderButton')}
      </Button>
    </div>
  );
}
