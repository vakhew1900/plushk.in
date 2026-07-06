import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { IconCheck } from '@/components/icons';
import { useTranslation } from '@/hooks/useTranslation';
import { parseRuleNode } from '@/lib/visitor/rule-evaluator';
import type { BookmarkRule } from '@/types/rule';
import { JsonView } from '../json/JsonView';
import styles from './RuleEditor.module.css';

interface Props {
  rule: BookmarkRule;
  onSave: (rule: BookmarkRule) => void;
}

export function RuleEditor({ rule, onSave }: Props) {
  const { translate: t } = useTranslation();
  const [name, setName] = useState(rule.name);
  const [desc, setDesc] = useState(rule.desc ?? '');
  const [targetFolder, setTargetFolder] = useState(rule.targetFolder);
  const [priority, setPriority] = useState(rule.priority);
  const [conditionText, setConditionText] = useState(JSON.stringify(rule.condition, null, 2));

  const slug = name.toLowerCase().replace(/[^a-zа-я0-9]+/gi, '_').replace(/^_|_$/g, '');
  const parsedCondition = parseRuleNode(conditionText);

  const handleSave = () => {
    if (!parsedCondition) return;
    onSave({ ...rule, name, desc, targetFolder, priority, condition: parsedCondition });
  };

  return (
    <div className={styles.wrap}>
      <div className={styles.nameSection}>
        <div>
          <div className={styles.fieldLabel}>{t('ruleEditor.nameLabel')}</div>
          <Input value={name} onChange={(e) => setName(e.target.value)} />
        </div>
        <div>
          <div className={styles.fieldLabel}>{t('ruleEditor.descLabel')}</div>
          <Textarea value={desc} onChange={(e) => setDesc(e.target.value)} rows={2} />
        </div>
        <div className={styles.row}>
          <div>
            <div className={styles.fieldLabel}>{t('ruleEditor.targetFolderLabel')}</div>
            <Input value={targetFolder} onChange={(e) => setTargetFolder(e.target.value)} />
          </div>
          <div>
            <div className={styles.fieldLabel}>{t('ruleEditor.priorityLabel')}</div>
            <Input
              type="number"
              value={priority}
              onChange={(e) => setPriority(Number(e.target.value))}
            />
          </div>
        </div>
      </div>

      <div className={styles.condHeader}>
        <span className={styles.condTitle}>{t('ruleEditor.conditionTitle')}</span>
      </div>

      <div className={styles.body}>
        <JsonView
          json={conditionText}
          filename={(slug || 'rule') + '.rule.json'}
          onChange={setConditionText}
        />
      </div>

      <div className={styles.editorFooter}>
        <Button variant="outline" size="sm">
          <IconCheck size={13} />
          {t('ruleEditor.testButton')}
        </Button>
        <div style={{ flex: 1 }} />
        <Button onClick={handleSave} disabled={!parsedCondition}>{t('ruleEditor.saveButton')}</Button>
      </div>
    </div>
  );
}
