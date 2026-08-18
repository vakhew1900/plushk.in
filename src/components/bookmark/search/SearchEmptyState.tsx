import { IconSearch } from '@/components/icons';
import styles from './SearchEmptyState.module.css';

interface Props {
  message: string;
}

export function SearchEmptyState({ message }: Props) {
  return (
    <div className={styles.wrap}>
      <IconSearch size="lg" className={styles.icon} />
      <p>{message}</p>
    </div>
  );
}
