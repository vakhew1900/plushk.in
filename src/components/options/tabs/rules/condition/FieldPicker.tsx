import { useId } from 'react';
import { Input } from '@/components/ui/input';
import { useTranslation } from '@/hooks/useTranslation';
import { PageMetaField } from '@/types/page-meta';
import styles from './FieldPicker.module.css';

const KNOWN_FIELDS = Object.values(PageMetaField).filter((f) => f !== PageMetaField.EXTRAS);

interface Props {
  value: string;
  onChange: (value: string) => void;
}

export function FieldPicker({ value, onChange }: Props) {
  const { translate: t } = useTranslation();
  const listId = useId();

  return (
    <>
      <Input
        list={listId}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={t('conditionRow.fieldPlaceholder')}
        className={styles.input}
      />
      <datalist id={listId}>
        {KNOWN_FIELDS.map((field) => <option key={field} value={field} />)}
      </datalist>
    </>
  );
}
