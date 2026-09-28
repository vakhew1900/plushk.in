import { Text } from '@/components/ui/text';
import { QuickAddChip } from './QuickAddChip';

interface QuickAddVariableSingleProps {
  value: string;
}

export function QuickAddVariableSingle({ value }: QuickAddVariableSingleProps) {
  return (
    <QuickAddChip>
      <Text size="body">{value}</Text>
    </QuickAddChip>
  );
}
