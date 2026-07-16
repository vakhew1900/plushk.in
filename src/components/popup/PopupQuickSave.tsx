import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { IconArrowRight, IconCheck, IconFolder, IconStar } from '@/components/icons';
import { useQuickSave } from '@/hooks/useQuickSave';
import { useTranslation } from '@/hooks/useTranslation';
import { Mode } from '@/types/mode';
import styles from './PopupQuickSave.module.css';

interface Props {
  mode: Mode;
  onOpenSettings: () => void;
}

function OffView() {
  const { translate: t } = useTranslation();
  return <div className={styles.offNote}>{t('popup.quickSave.offNote')}</div>;
}

function AutoView({ onSave }: { onSave: () => void }) {
  const { translate: t } = useTranslation();
  return (
    <Button onClick={onSave} className={styles.saveWide}>
      {t('popup.quickSave.save')}
    </Button>
  );
}

function HintView({ path, onPathChange, onSave }: {
  path: string;
  onPathChange: (value: string) => void;
  onSave: () => void;
}) {
  const { translate: t } = useTranslation();
  return (
    <div className={styles.hintRow}>
      <IconFolder size={14} className={styles.folderIcon} />
      <Input
        value={path}
        onChange={(e) => onPathChange(e.target.value)}
        placeholder={t('popup.hintConfirm.pathPlaceholder')}
        className={styles.pathInput}
      />
      <Button variant="outline" size="icon" onClick={onSave} aria-label={t('popup.quickSave.save')}>
        <IconCheck size={14} />
      </Button>
    </div>
  );
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

function QuickSaveBody({ mode, saved, path, onPathChange, save }: {
  mode: Mode;
  saved: boolean;
  path: string;
  onPathChange: (value: string) => void;
  save: (targetFolder?: string) => void;
}) {
  if (saved) return <SavedView />;

  switch (mode) {
    case Mode.OFF:
      return <OffView />;
    case Mode.AUTO:
      return <AutoView onSave={() => save()} />;
    case Mode.HINT:
      return <HintView path={path} onPathChange={onPathChange} onSave={() => save(path)} />;
  }
}

export function PopupQuickSave({ mode, onOpenSettings }: Props) {
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
        <QuickSaveBody
          mode={mode}
          saved={saved}
          path={path}
          onPathChange={(value) => {
            setPathTouched(true);
            setPath(value);
          }}
          save={save}
        />
      </div>
    </div>
  );
}
