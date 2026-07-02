import { clsx } from 'clsx';
import { Switch } from '@/components/ui/switch';
import styles from './RuleListItem.module.css';

interface Props {
  index: number;
  name: string;
  desc: string;
  enabled: boolean;
  selected: boolean;
  onSelect: () => void;
  onToggle: () => void;
}

export function RuleListItem({ index, name, desc, enabled, selected, onSelect, onToggle }: Props) {
  return (
    <div onClick={onSelect} className={clsx(styles.item, selected && styles.selected)}>
      <div className={styles.top}>
        <span className={styles.index}>{index}</span>
        <b className={styles.name}>{name}</b>
        <span onClick={(e) => { e.stopPropagation(); onToggle(); }}>
          <Switch checked={enabled} onCheckedChange={onToggle} />
        </span>
      </div>
      <div className={styles.desc}>{desc}</div>
    </div>
  );
}
