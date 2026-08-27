import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { IconSourceType } from '@/types/icon-rule';

const OPTIONS: IconSourceType[] = [IconSourceType.STATIC, IconSourceType.CSS, IconSourceType.XPATH];

interface Props {
  value: IconSourceType;
  onChange: (value: IconSourceType) => void;
}

export function IconSourceTypeToggle({ value, onChange }: Props) {
  return (
    <RadioGroup value={value} onValueChange={(v) => onChange(v as IconSourceType)}>
      {OPTIONS.map((option) => (
        <RadioGroupItem key={option} value={option}>
          {option}
        </RadioGroupItem>
      ))}
    </RadioGroup>
  );
}
