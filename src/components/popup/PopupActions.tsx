import { usePendingHint } from '@/hooks/usePendingHint';
import { Mode } from '@/types/mode';
import { PopupHintConfirm } from './PopupHintConfirm';
import styles from './PopupActions.module.css';

interface Props { mode: Mode }

export function PopupActions({ mode }: Props) {
  const { hint, confirm, cancel } = usePendingHint();

  if (mode !== Mode.HINT || !hint) return null;

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
