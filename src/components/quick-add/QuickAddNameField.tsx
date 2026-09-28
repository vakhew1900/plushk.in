import { clsx } from 'clsx';
import { Input } from '@/components/ui/input';
import { Text } from '@/components/ui/text';
import styles from './QuickAddNameField.module.css';

interface QuickAddNameFieldProps {
  id: string;
  label: string;
  placeholder: string;
  value: string;
  error: string | null;
  onChange: (value: string) => void;
}

export function QuickAddNameField({ id, label, placeholder, value, error, onChange }: QuickAddNameFieldProps) {
  return (
    <div>
      <label htmlFor={id} className={styles.label}>
        <Text as="span" size="caption" tone="muted">{label}</Text>
      </label>
      <Input
        id={id}
        type="text"
        value={value}
        placeholder={placeholder}
        className={clsx(error && styles.inputError)}
        onChange={(e) => onChange(e.target.value)}
      />
      {error && <Text as="span" size="caption" className={styles.error}>{error}</Text>}
    </div>
  );
}
