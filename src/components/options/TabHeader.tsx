import { Text } from '@/components/ui/text';
import styles from './TabHeader.module.css';

interface Props {
  title: string;
  lead: string;
}

export function TabHeader({ title, lead }: Props) {
  return (
    <div className={styles.wrap}>
      <Text as="h1" size="heading" className={styles.h1}>{title}</Text>
      <Text size="body" tone="muted">{lead}</Text>
    </div>
  );
}
