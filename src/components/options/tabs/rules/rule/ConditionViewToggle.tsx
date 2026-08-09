import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useTranslation } from '@/hooks/useTranslation';
import styles from './ConditionViewToggle.module.css';

export const ConditionView = { VISUAL: 'visual', JSON: 'json' } as const;
export type ConditionView = (typeof ConditionView)[keyof typeof ConditionView];

interface Props {
  value: ConditionView;
  onChange: (view: ConditionView) => void;
}

export function ConditionViewToggle({ value, onChange }: Props) {
  const { translate: t } = useTranslation();

  return (
    <RadioGroup value={value} onValueChange={(v) => onChange(v as ConditionView)} className={styles.root}>
      <RadioGroupItem value={ConditionView.VISUAL}>{t('ruleEditor.visualViewTab')}</RadioGroupItem>
      <RadioGroupItem value={ConditionView.JSON}>{t('ruleEditor.jsonViewTab')}</RadioGroupItem>
    </RadioGroup>
  );
}
