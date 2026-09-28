import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './select';
import styles from './type-select.module.css';

interface Props<T extends string> {
  value: T;
  options: readonly T[];
  onChange: (value: T) => void;
}

/**
 * Compact dropdown for picking one of a handful of short type tags (e.g.
 * `css`/`meta`/`xpath`) — replaces a `RadioGroup` toggle once there isn't
 * room to show every option at once, doubling as the type's visual label
 * (no separate `Badge` needed alongside it).
 */
export function TypeSelect<T extends string>({ value, options, onChange }: Props<T>) {
  return (
    <Select value={value} onValueChange={(v) => onChange(v as T)}>
      <SelectTrigger className={styles.trigger}>
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {options.map((option) => (
          <SelectItem key={option} value={option} className={styles.item}>
            {option}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
