import { useEffect, useState } from 'react';
import { IconCheck, IconStar } from '@/components/icons';
import { FolderPicker } from '@/components/bookmark/folder-tree/FolderPicker';
import { useQuickSave } from '@/hooks/useQuickSave';
import { useTranslation } from '@/hooks/useTranslation';
import { QuickSaveView, getQuickSaveView } from '@/lib/quick-save-view';
import { Mode } from '@/types/mode';
import styles from './PopupQuickSave.module.css';

interface Props {
  mode: Mode;
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

export function PopupQuickSave({ mode }: Props) {
  const { translate: t } = useTranslation();
  const { suggestedFolder, saved, save } = useQuickSave(mode);

  const [path, setPath] = useState('');
  const [pathTouched, setPathTouched] = useState(false);

  useEffect(() => {
    if (!pathTouched && suggestedFolder !== undefined) setPath(suggestedFolder);
  }, [suggestedFolder, pathTouched]);

  useEffect(() => {
    if (!saved) return;
    const timer = setTimeout(() => window.close(), 900);
    return () => clearTimeout(timer);
  }, [saved]);

  const handlePathChange = (value: string) => {
    setPathTouched(true);
    setPath(value);
  };

  const view = getQuickSaveView(saved, mode);

  return (
    <div className={styles.wrap}>
      <div className={styles.header}>
        <div className={styles.icon}>
          <IconStar size={17} />
        </div>
        <div className={styles.title}>{t('popup.quickSave.title')}</div>
      </div>

      <div className={styles.body}>
        {view === QuickSaveView.SAVED && <SavedView />}
        {view === QuickSaveView.OFF && <OffView />}
        {view === QuickSaveView.SAVE && (
          <FolderPicker path={path} onPathChange={handlePathChange} onSave={save} />
        )}
      </div>
    </div>
  );
}
