import { Text } from '@/components/ui/text';
import { QuickAddSpinner } from './QuickAddSpinner';
import styles from './QuickAddSearchingRow.module.css';

interface QuickAddSearchingRowProps {
  text: string;
}

export function QuickAddSearchingRow({ text }: QuickAddSearchingRowProps) {
  return (
    <div className={styles.row}>
      <QuickAddSpinner />
      <Text size="body" tone="muted">{text}</Text>
    </div>
  );
}
