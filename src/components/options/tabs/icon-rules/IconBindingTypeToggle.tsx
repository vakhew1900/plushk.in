import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { IconRuleBindingType } from '@/types/icon-rule';

const OPTIONS: IconRuleBindingType[] = [IconRuleBindingType.URL, IconRuleBindingType.ALIAS, IconRuleBindingType.DOMAIN];

interface Props {
  value: IconRuleBindingType;
  onChange: (value: IconRuleBindingType) => void;
}

export function IconBindingTypeToggle({ value, onChange }: Props) {
  return (
    <RadioGroup value={value} onValueChange={(v) => onChange(v as IconRuleBindingType)}>
      {OPTIONS.map((option) => (
        <RadioGroupItem key={option} value={option}>
          {option}
        </RadioGroupItem>
      ))}
    </RadioGroup>
  );
}
