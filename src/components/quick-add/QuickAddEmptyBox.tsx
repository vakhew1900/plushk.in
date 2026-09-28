import { Text } from '@/components/ui/text';
import styles from './QuickAddEmptyBox.module.css';

interface QuickAddEmptyBoxProps {
  text: string;
}

/** Shared by QuickAddVariablePreview/QuickAddIconPreview's "nothing found" state. */
export function QuickAddEmptyBox({ text }: QuickAddEmptyBoxProps) {
  return (
    <div className={styles.box}>
      <Text size="body">{text}</Text>
    </div>
  );
}
