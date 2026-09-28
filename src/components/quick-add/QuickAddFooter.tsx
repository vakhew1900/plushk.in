import { Button } from '@/components/ui/button';
import { useTranslation } from '@/hooks/useTranslation';
import { QuickAddSpinner } from './QuickAddSpinner';
import styles from './QuickAddFooter.module.css';

interface QuickAddFooterProps {
  saving: boolean;
  saveDisabled: boolean;
  onSave: () => void;
}

// No Cancel button — the header's close icon plus Escape/click-outside
// (quick-add.content.tsx) already close the panel without saving; a second,
// redundant affordance for the same action didn't earn its place here.
export function QuickAddFooter({ saving, saveDisabled, onSave }: QuickAddFooterProps) {
  const { translate: t } = useTranslation();

  return (
    <div className={styles.row}>
      <Button size="sm" disabled={saveDisabled} onClick={onSave}>
        {saving ? (
          <span className={styles.saveContent}>
            <QuickAddSpinner onAccent />
            {t('quickAdd.saving')}
          </span>
        ) : (
          t('quickAdd.save')
        )}
      </Button>
    </div>
  );
}
