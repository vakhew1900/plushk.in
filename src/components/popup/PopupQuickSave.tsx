import { useEffect, useState } from 'react';
import { IconCheck, IconStar } from '@/components/icons';
import { FolderPicker } from '@/components/bookmark/folder-tree/FolderPicker';
import { AdvancedSection } from './AdvancedSection';
import { useQuickSave } from '@/hooks/useQuickSave';
import { useAdvancedSelection } from '@/hooks/useAdvancedSelection';
import { useEntityWorkflows } from '@/hooks/useEntityWorkflows';
import { useTags } from '@/hooks/useTags';
import { useTranslation } from '@/hooks/useTranslation';
import { QuickSaveView, getQuickSaveView } from '@/lib/quick-save-view';
import type { Mode } from '@/types/mode';
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
      <IconCheck size="md" />
      {t('popup.quickSave.saved')}
    </div>
  );
}

export function PopupQuickSave({ mode }: Props) {
  const { translate: t } = useTranslation();
  const { suggestedFolder, suggestion, saved, save } = useQuickSave(mode);
  const { entityTypes, statusesFor } = useEntityWorkflows();
  const { items: tags } = useTags();
  const { entityTypeId, statusId, tagIds, chooseEntity, toggleTag, matchedRuleName } = useAdvancedSelection(
    suggestion,
    statusesFor,
  );
  const selectedEntity = entityTypes.find((e) => e.id === entityTypeId);

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
          <IconStar size="md" />
        </div>
        <div className={styles.title}>{t('popup.quickSave.title')}</div>
      </div>

      <div className={styles.body}>
        {view === QuickSaveView.SAVED && <SavedView />}
        {view === QuickSaveView.OFF && <OffView />}
        {view === QuickSaveView.SAVE && (
          <FolderPicker
            path={path}
            onPathChange={handlePathChange}
            onSave={(value) => {
              void save(value, { tagIds, entityTypeId, statusId });
            }}
          >
            <AdvancedSection
              entityTypes={entityTypes}
              selectedEntity={selectedEntity}
              onChooseEntity={chooseEntity}
              tags={tags}
              selectedTagIds={tagIds}
              onToggleTag={toggleTag}
              matchedRuleName={matchedRuleName}
            />
          </FolderPicker>
        )}
      </div>
    </div>
  );
}
