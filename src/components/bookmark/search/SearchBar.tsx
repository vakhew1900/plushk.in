import { Input } from '@/components/ui/input';
import { IconSearch } from '@/components/icons';
import styles from './SearchBar.module.css';

interface Props {
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
}

export function SearchBar({ value, onChange, placeholder }: Props) {
  return (
    <div className={styles.wrap}>
      <IconSearch size="md" className={styles.icon} />
      <Input
        className={styles.input}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
      />
    </div>
  );
}
