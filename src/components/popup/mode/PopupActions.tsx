import { usePendingHint } from '@/hooks/usePendingHint';
import { useServices } from '@/hooks/useServices';
import { createModeHandler } from '@/services/handler/createModeHandler';
import { BookmarkDecisionStatus } from '@/services/handler/interfaces/IBookmarkModeHandler';
import { Mode } from '@/types/mode';
import { PopupHintConfirm } from './PopupHintConfirm';
import styles from './PopupActions.module.css';

interface Props { mode: Mode }

export function PopupActions({ mode }: Props) {
  const { bookmarkRuleRepository } = useServices();
  const { hint, confirm, cancel } = usePendingHint();

  const handler = createModeHandler(mode, bookmarkRuleRepository);
  if (handler.status !== BookmarkDecisionStatus.PENDING_CONFIRMATION || !hint) return null;

  return (
    <div className={styles.wrap}>
      <PopupHintConfirm
        targetFolder={hint.targetFolder}
        onConfirm={confirm}
        onCancel={cancel}
      />
    </div>
  );
}
