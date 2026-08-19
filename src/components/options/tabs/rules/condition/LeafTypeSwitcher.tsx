import * as SelectPrimitive from '@radix-ui/react-select';
import { Select, SelectContent, SelectItem } from '@/components/ui/select';
import { IconChevronDown } from '@/components/icons';
import { useTranslation } from '@/hooks/useTranslation';
import type { LeafRuleType } from '@/lib/visitor/rule-draft';
import { LEAF_LABELS, LEAF_TYPES } from './leafLabels';
import styles from './LeafTypeSwitcher.module.css';

interface Props {
  value: LeafRuleType;
  onChange: (type: LeafRuleType) => void;
}

// Sits where a plain `<span>{opLabel}</span>` used to, between the field and
// the value — the leaf's matcher type (`=` / "one of" / regex / wildcard)
// was previously only choosable once, at creation, via `AddConditionMenu`.
export function LeafTypeSwitcher({ value, onChange }: Props) {
  const { translate: t } = useTranslation();

  return (
    <Select value={value} onValueChange={(v) => onChange(v as LeafRuleType)}>
      <SelectPrimitive.Trigger className={styles.trigger} aria-label={t(LEAF_LABELS[value].addLabelKey)}>
        <SelectPrimitive.Value>{t(LEAF_LABELS[value].opLabelKey)}</SelectPrimitive.Value>
        <SelectPrimitive.Icon className={styles.icon}>
          <IconChevronDown size="sm" />
        </SelectPrimitive.Icon>
      </SelectPrimitive.Trigger>
      <SelectContent>
        {LEAF_TYPES.map((type) => (
          <SelectItem key={type} value={type}>{t(LEAF_LABELS[type].addLabelKey)}</SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
