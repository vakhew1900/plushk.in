import type { Mode } from './PopupModeSelector';
import { PopupHintConfirm } from './PopupHintConfirm';
import styles from './PopupActions.module.css';

interface Props { mode: Mode }

// TODO(RULE-2): targetFolder should come from HintModeHandler.onBookmarkSelected
// once the background/popup integration exists — this is a placeholder for now.
const MOCK_SUGGESTED_FOLDER = 'Чтение/Статьи';

export function PopupActions({ mode }: Props) {
  if (mode !== 'hint') return null;

  return (
    <div className={styles.wrap}>
      <PopupHintConfirm
        targetFolder={MOCK_SUGGESTED_FOLDER}
        onConfirm={() => {}}
        onCancel={() => {}}
      />
    </div>
  );
}
