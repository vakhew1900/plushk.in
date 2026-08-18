import { useMemo, useState } from 'react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { IconCheck } from '@/components/icons';
import { EntitySegment } from '@/components/bookmark/entity/EntitySegment';
import { TagPicker } from '@/components/bookmark/tags/TagPicker';
import { useTranslation } from '@/hooks/useTranslation';
import { useEntityWorkflows } from '@/hooks/useEntityWorkflows';
import { useTags } from '@/hooks/useTags';
import { parseRuleNode } from '@/lib/visitor/rule-evaluator';
import { hasRuleErrors } from '@/lib/visitor/rule-draft';
import { hasValidName } from '@/lib/validation/named-entity';
import type { BookmarkRule, RuleNode } from '@/types/rule';
import { JsonView } from '../json/JsonView';
import { ConsView } from '../cons/ConsView';
import { ConditionView, ConditionViewToggle } from './ConditionViewToggle';
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
  const [entityTypeId, setEntityTypeId] = useState(rule.entityTypeId);
  const [statusId, setStatusId] = useState(rule.statusId);
  const [tagIds, setTagIds] = useState(rule.tagIds ?? []);
  const [conditionText, setConditionText] = useState(JSON.stringify(rule.condition, null, 2));
  const [conditionView, setConditionView] = useState<ConditionView>(ConditionView.VISUAL);

  const { entityTypes, statusesFor } = useEntityWorkflows();
  const { items: tags } = useTags();
  const selectedEntity = entityTypes.find((e) => e.id === entityTypeId);

  const chooseEntity = (id: string | undefined) => {
    setEntityTypeId(id);
    setStatusId(id === undefined ? undefined : statusesFor(id)[0]?.id);
  };

  const toggleTag = (tagId: string) => {
    setTagIds((prev) => (prev.includes(tagId) ? prev.filter((id) => id !== tagId) : [...prev, tagId]));
  };

  const slug = name.toLowerCase().replace(/[^a-zа-я0-9]+/gi, '_').replace(/^_|_$/g, '');
  const parsedCondition = useMemo(() => parseRuleNode(conditionText), [conditionText]);

  // `ConsView` needs *some* `RuleNode` to render even while `conditionText`
  // is transiently invalid mid-edit — keeps showing the last valid tree
  // instead of blanking out (see RULE-1 test cases). Adjusted during render
  // (React's documented pattern for "remember a value from a previous
  // render") rather than an effect, since `parsedCondition` is `useMemo`'d
  // and so stays referentially stable until `conditionText` actually changes
  // — no risk of looping.
  const [lastValidCondition, setLastValidCondition] = useState<RuleNode>(rule.condition);
  if (parsedCondition && parsedCondition !== lastValidCondition) {
    setLastValidCondition(parsedCondition);
  }
  const displayedCondition = parsedCondition ?? lastValidCondition;

  const canSave = parsedCondition !== null && !hasRuleErrors(parsedCondition) && hasValidName(name);

  const handleSave = () => {
    if (!canSave || !parsedCondition) return;
    onSave({
      ...rule,
      name,
      desc,
      targetFolder,
      priority,
      entityTypeId,
      statusId,
      tagIds: tagIds.length > 0 ? tagIds : undefined,
      condition: parsedCondition,
    });
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

        {entityTypes.length > 0 && (
          <div>
            <div className={styles.fieldLabel}>{t('ruleEditor.categoryLabel')}</div>
            <EntitySegment entityTypes={entityTypes} selectedEntity={selectedEntity} onChoose={chooseEntity} />
          </div>
        )}

        <div>
          <div className={styles.fieldLabel}>{t('ruleEditor.tagsLabel')}</div>
          <TagPicker tags={tags} selectedTagIds={tagIds} onToggle={toggleTag} />
        </div>
      </div>

      <div className={styles.condHeader}>
        <span className={styles.condTitle}>{t('ruleEditor.conditionTitle')}</span>
        <ConditionViewToggle value={conditionView} onChange={setConditionView} />
      </div>

      <div className={styles.body}>
        {conditionView === ConditionView.VISUAL ? (
          <ConsView
            value={displayedCondition}
            onChange={(next) => setConditionText(JSON.stringify(next, null, 2))}
          />
        ) : (
          <JsonView
            json={conditionText}
            filename={(slug || 'rule') + '.rule.json'}
            onChange={setConditionText}
          />
        )}
      </div>

      <div className={styles.editorFooter}>
        <Button variant="outline" size="sm">
          <IconCheck size="md" />
          {t('ruleEditor.testButton')}
        </Button>
        <div style={{ flex: 1 }} />
        <Button onClick={handleSave} disabled={!canSave}>{t('ruleEditor.saveButton')}</Button>
      </div>
    </div>
  );
}
