import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { IconArrowRight, IconCheck, IconStar } from '@/components/icons';
import { useQuickSave } from '@/hooks/useQuickSave';
import { useTranslation } from '@/hooks/useTranslation';
import { useServices } from '@/hooks/useServices';
import { createModeHandler } from '@/services/handler/createModeHandler';
import { BookmarkDecisionStatus } from '@/services/handler/interfaces/IBookmarkModeHandler';
import { QuickSaveView, getQuickSaveView } from '@/lib/quick-save-view';
import { Mode } from '@/types/mode';
import { ConfirmFolderView } from './folder/ConfirmFolderView';
import styles from './PopupQuickSave.module.css';

interface Props {
  mode: Mode;
  onOpenSettings: () => void;
}

function OffView() {
  const { translate: t } = useTranslation();
  return <div className={styles.offNote}>{t('popup.quickSave.offNote')}</div>;
}

function SavedView() {
  const { translate: t } = useTranslation();
  return (
    <div className={styles.saved}>
      <IconCheck size={14} />
      {t('popup.quickSave.saved')}
    </div>
  );
}

export function PopupQuickSave({ mode, onOpenSettings }: Props) {
  const { translate: t } = useTranslation();
  const { bookmarkRuleRepository } = useServices();
  const { suggestedFolder, saved, save } = useQuickSave(mode);

  const [path, setPath] = useState('');
  const [pathTouched, setPathTouched] = useState(false);
  const [confirming, setConfirming] = useState(false);

  const handler = createModeHandler(mode, bookmarkRuleRepository);

  useEffect(() => {
    if (!pathTouched && suggestedFolder !== undefined) setPath(suggestedFolder);
  }, [suggestedFolder, pathTouched]);

  useEffect(() => {
    if (!saved) return;
    const timer = setTimeout(() => window.close(), 900);
    return () => clearTimeout(timer);
  }, [saved]);

  const handleSaveClick = () => {
    if (handler.status === BookmarkDecisionStatus.PENDING_CONFIRMATION) {
      setConfirming(true);
    } else {
      save();
    }
  };

  const handlePathChange = (value: string) => {
    setPathTouched(true);
    setPath(value);
  };

  const view = getQuickSaveView(saved, handler.status, confirming);

  return (
    <div className={styles.wrap}>
      <div className={styles.header}>
        <div className={styles.icon}>
          <IconStar size={17} />
        </div>
        <div className={styles.title}>{t('popup.quickSave.title')}</div>
        <Button
          variant="ghost"
          size="icon-sm"
          onClick={onOpenSettings}
          aria-label={t('popup.quickSave.openSettings')}
        >
          <IconArrowRight size={14} />
        </Button>
      </div>

      <div className={styles.body}>
        {view === QuickSaveView.SAVED && <SavedView />}
        {view === QuickSaveView.OFF && <OffView />}
        {view === QuickSaveView.CONFIRM && (
          <ConfirmFolderView
            path={path}
            onPathChange={handlePathChange}
            onCancel={() => setConfirming(false)}
            onConfirm={save}
          />
        )}
        {view === QuickSaveView.SAVE && (
          <Button onClick={handleSaveClick} className={styles.saveWide}>
            {t('popup.quickSave.save')}
          </Button>
        )}
      </div>
    </div>
  );
}
