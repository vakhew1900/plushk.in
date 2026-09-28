import { useEffect } from 'react';
import { IconCheck } from '@/components/icons';
import { FolderPicker } from '@/components/bookmark/folder-tree/FolderPicker';
import { AdvancedSection } from './AdvancedSection';
import { useQuickSave } from '@/hooks/useQuickSave';
import { useQuickSaveSelection } from '@/hooks/useQuickSaveSelection';
import { useEntityWorkflows } from '@/hooks/useEntityWorkflows';
import { useTags } from '@/hooks/useTags';
import { useTranslation } from '@/hooks/useTranslation';
import { QuickSaveView, getQuickSaveView } from '@/lib/quick-save-view';
import type { Mode } from '@/types/mode';
import styles from './PopupQuickSave.module.css';

interface Props {
  mode: Mode;
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
  const { suggestion, saved, save } = useQuickSave(mode);
  const { entityTypes, statusesFor } = useEntityWorkflows();
  const { items: tags } = useTags();
  const {
    targetFolder,
    entityTypeId,
    statusId,
    tagIds,
    iconUrl,
    setTargetFolder,
    chooseEntity,
    toggleTag,
    setIconUrl,
    matchedRuleName,
    matchedIconRuleName,
  } = useQuickSaveSelection(suggestion, statusesFor);
  const selectedEntity = entityTypes.find((e) => e.id === entityTypeId);

  useEffect(() => {
    if (!saved) return;
    const timer = setTimeout(() => window.close(), 900);
    return () => clearTimeout(timer);
  }, [saved]);

  const view = getQuickSaveView(saved, mode);
  if (view === QuickSaveView.OFF) return null;

  return (
    <div className={styles.wrap}>
      <div className={styles.body}>
        {view === QuickSaveView.SAVED && <SavedView />}
        {view === QuickSaveView.SAVE && (
          <FolderPicker
            path={targetFolder}
            onPathChange={setTargetFolder}
            onSave={(value) => {
              void save({ targetFolder: value, tagIds, entityTypeId, statusId, iconUrl });
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
              iconUrl={iconUrl}
              matchedIconRuleName={matchedIconRuleName}
              onIconUrlChange={setIconUrl}
            />
          </FolderPicker>
        )}
      </div>
    </div>
  );
}
