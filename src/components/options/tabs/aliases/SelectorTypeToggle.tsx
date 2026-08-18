import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { PageSelectorType } from '@/types/page-match';

const OPTIONS: PageSelectorType[] = [PageSelectorType.CSS, PageSelectorType.META, PageSelectorType.XPATH];

interface Props {
  value: PageSelectorType;
  onChange: (value: PageSelectorType) => void;
}

export function SelectorTypeToggle({ value, onChange }: Props) {
  return (
    <RadioGroup value={value} onValueChange={(v) => onChange(v as PageSelectorType)}>
      {OPTIONS.map((option) => (
        <RadioGroupItem key={option} value={option}>
          {option}
        </RadioGroupItem>
      ))}
    </RadioGroup>
  );
}
