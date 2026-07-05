import { Badge } from '@/components/ui/badge';
import { IconFolder } from '@/components/icons';
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
          <IconFolder size={11} />
          {folder}
        </span>
      </span>

      <Badge variant="accent">{rule}</Badge>
      <span className={styles.time}>{time}</span>
    </div>
  );
}
