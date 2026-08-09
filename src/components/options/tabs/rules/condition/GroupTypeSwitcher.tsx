import { clsx } from 'clsx';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useTranslation } from '@/hooks/useTranslation';
import type { CompoundRuleType } from '@/lib/visitor/rule-draft';
import { RuleType } from '@/types/rule';
import styles from './GroupTypeSwitcher.module.css';

const OPTIONS: CompoundRuleType[] = [RuleType.AND, RuleType.OR, RuleType.NOT];

const ITEM_CLASS: Record<CompoundRuleType, string> = {
  [RuleType.AND]: styles.and,
  [RuleType.OR]: styles.or,
  [RuleType.NOT]: styles.not,
};

const LABEL_KEY: Record<CompoundRuleType, 'conditionGroup.andLabel' | 'conditionGroup.orLabel' | 'conditionGroup.notLabel'> = {
  [RuleType.AND]: 'conditionGroup.andLabel',
  [RuleType.OR]: 'conditionGroup.orLabel',
  [RuleType.NOT]: 'conditionGroup.notLabel',
};

interface Props {
  value: CompoundRuleType;
  onChange: (type: CompoundRuleType) => void;
}

export function GroupTypeSwitcher({ value, onChange }: Props) {
  const { translate: t } = useTranslation();

  return (
    <RadioGroup value={value} onValueChange={(v) => onChange(v as CompoundRuleType)} className={styles.root}>
      {OPTIONS.map((option) => (
        <RadioGroupItem key={option} value={option} className={clsx(styles.item, ITEM_CLASS[option])}>
          {t(LABEL_KEY[option])}
        </RadioGroupItem>
      ))}
    </RadioGroup>
  );
}
