import { Badge } from '@/components/ui/badge';
import styles from './ActivityItem.module.css';

interface Props {
  letter: string;
  color: string;
  title: string;
  folder: string;
  rule: string;
  time: string;
}

export function ActivityItem({ letter, color, title, folder, rule, time }: Props) {
  return (
    <div className={styles.row}>
      <span className={styles.avatar} style={{ background: color }}>{letter}</span>

      <span className={styles.info}>
        <span className={styles.title}>{title}</span>
        <span className={styles.folder}>
          <svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor">
            <path d="M3 6a1 1 0 0 1 1-1h5l2 2h8a1 1 0 0 1 1 1v9a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1z" />
          </svg>
          {folder}
        </span>
      </span>

      <Badge variant="accent">{rule}</Badge>
      <span className={styles.time}>{time}</span>
    </div>
  );
}
