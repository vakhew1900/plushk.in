import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useTranslation } from '@/hooks/useTranslation';
import { StructureType } from '@/lib/visitor/rule-draft';
import type { TranslationKey } from '@/locale';
import styles from './StructureSwitcher.module.css';

const OPTIONS: StructureType[] = [StructureType.SINGLE, StructureType.AND, StructureType.OR, StructureType.NOT];

const LABEL_KEY: Record<StructureType, TranslationKey> = {
  [StructureType.SINGLE]: 'conditionGroup.singleLabel',
  [StructureType.AND]: 'conditionGroup.andLabel',
  [StructureType.OR]: 'conditionGroup.orLabel',
  [StructureType.NOT]: 'conditionGroup.notLabel',
};

interface Props {
  value: StructureType;
  onChange: (type: StructureType) => void;
  /** Disable the "single" option — collapsing a group to one leaf only makes sense with exactly one child. */
  singleDisabled?: boolean;
}

export function StructureSwitcher({ value, onChange, singleDisabled }: Props) {
  const { translate: t } = useTranslation();

  return (
    <RadioGroup value={value} onValueChange={(v) => onChange(v as StructureType)} className={styles.root}>
      {OPTIONS.map((option) => (
        <RadioGroupItem
          key={option}
          value={option}
          disabled={option === StructureType.SINGLE && singleDisabled}
          className={styles.item}
        >
          {t(LABEL_KEY[option])}
        </RadioGroupItem>
      ))}
    </RadioGroup>
  );
}
