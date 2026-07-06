import { clsx } from 'clsx';
import { useTranslation } from '@/hooks/useTranslation';
import { CodeView } from '@/components/options/CodeView';
import { countLeafRules, parseRuleNode } from '@/lib/visitor/rule-evaluator';
import styles from './JsonView.module.css';

interface Props {
  json: string;
  filename: string;
  onChange?: (json: string) => void;
}

export function JsonView({ json, filename, onChange }: Props) {
  const { translate: t } = useTranslation();

  const parsed = parseRuleNode(json);
  const isValid = parsed !== null;
  const condCount = parsed !== null ? countLeafRules(parsed) : 0;

  return (
    <CodeView
      value={json}
      filename={filename}
      editable={!!onChange}
      onChange={onChange}
      footer={
        <div className={clsx(styles.footerInner, isValid ? styles.valid : styles.invalid)}>
          <span className={clsx(styles.dot, isValid ? styles.dotValid : styles.dotInvalid)} />
          {isValid ? t('jsonView.valid', { count: condCount }) : t('jsonView.invalid')}
        </div>
      }
    />
  );
}
