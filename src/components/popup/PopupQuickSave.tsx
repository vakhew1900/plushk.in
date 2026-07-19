import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { IconArrowRight, IconCheck, IconFolder, IconStar, IconX } from '@/components/icons';
import { useQuickSave } from '@/hooks/useQuickSave';
import { useTranslation } from '@/hooks/useTranslation';
import { useServices } from '@/hooks/useServices';
import { createModeHandler } from '@/services/createModeHandler';
import { BookmarkDecisionStatus } from '@/services/interfaces/IBookmarkModeHandler';
import { Mode } from '@/types/mode';
import { FolderTree } from './FolderTree';
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
        {saved ? (
          <SavedView />
        ) : handler.status === BookmarkDecisionStatus.NOT_HANDLED ? (
          <OffView />
        ) : confirming && handler.status === BookmarkDecisionStatus.PENDING_CONFIRMATION ? (
          <div className={styles.confirmColumn}>
            <div className={styles.hintRow}>
              <IconFolder size={14} className={styles.folderIcon} />
              <Input
                value={path}
                onChange={(e) => {
                  setPathTouched(true);
                  setPath(e.target.value);
                }}
                placeholder={t('popup.hintConfirm.pathPlaceholder')}
                className={styles.pathInput}
              />
            </div>

            <FolderTree
              selectedPath={path}
              onSelect={(selected) => {
                setPathTouched(true);
                setPath(selected);
              }}
            />

            <div className={styles.buttonRow}>
              <Button
                variant="outline"
                className={styles.actionBtn}
                onClick={() => setConfirming(false)}
              >
                <IconX size={14} className={styles.btnIcon} />
                {t('popup.hintConfirm.cancel')}
              </Button>
              <Button className={styles.actionBtn} onClick={() => save(path)}>
                <IconCheck size={14} className={styles.btnIcon} />
                {t('popup.hintConfirm.confirm')}
              </Button>
            </div>
          </div>
        ) : (
          <Button onClick={handleSaveClick} className={styles.saveWide}>
            {t('popup.quickSave.save')}
          </Button>
        )}
      </div>
    </div>
  );
}
