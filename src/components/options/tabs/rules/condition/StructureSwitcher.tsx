import { clsx } from 'clsx';
import * as SelectPrimitive from '@radix-ui/react-select';
import { Select, SelectContent, SelectItem } from '@/components/ui/select';
import { IconChevronDown } from '@/components/icons';
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

// Shown on the collapsed trigger — short enough to fit a small fixed chip
// even for the bilingual ru labels ("И · AND") the full `LABEL_KEY` uses.
const SHORT_LABEL_KEY: Record<StructureType, TranslationKey> = {
  [StructureType.SINGLE]: 'conditionGroup.singleLabel',
  [StructureType.AND]: 'conditionGroup.andShortLabel',
  [StructureType.OR]: 'conditionGroup.orShortLabel',
  [StructureType.NOT]: 'conditionGroup.notShortLabel',
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
    <Select value={value} onValueChange={(v) => onChange(v as StructureType)}>
      <SelectPrimitive.Trigger
        className={clsx(styles.trigger, value !== StructureType.SINGLE && styles.active)}
        aria-label={t(LABEL_KEY[value])}
      >
        <SelectPrimitive.Value>{t(SHORT_LABEL_KEY[value])}</SelectPrimitive.Value>
        <SelectPrimitive.Icon className={styles.icon}>
          <IconChevronDown size="sm" />
        </SelectPrimitive.Icon>
      </SelectPrimitive.Trigger>
      <SelectContent>
        {OPTIONS.map((option) => (
          <SelectItem
            key={option}
            value={option}
            disabled={option === StructureType.SINGLE && singleDisabled}
          >
            {t(LABEL_KEY[option])}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
