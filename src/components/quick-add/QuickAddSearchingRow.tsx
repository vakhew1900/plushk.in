import { Text } from '@/components/ui/text';
import { QuickAddSpinner } from './QuickAddSpinner';
import styles from './QuickAddSearchingRow.module.css';

interface QuickAddSearchingRowProps {
  text: string;
}

/** Shared by QuickAddVariablePreview/QuickAddIconPreview's "still looking" state — identical markup, only the text differs. */
export function QuickAddSearchingRow({ text }: QuickAddSearchingRowProps) {
  return (
    <div className={styles.row}>
      <QuickAddSpinner />
      <Text size="body" tone="muted">{text}</Text>
    </div>
  );
}
