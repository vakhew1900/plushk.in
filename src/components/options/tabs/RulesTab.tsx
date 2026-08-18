import { useState } from "react";
import { useTranslation } from "@/hooks/useTranslation";
import { useBookmarkRules } from "@/hooks/useBookmarkRules";
import { TabHeader } from "@/components/options/TabHeader";
import { RuleTree } from "./rules/tree/RuleTree";
import { DefaultFolderPanel } from "./rules/tree/DefaultFolderPanel";
import { RuleEditor } from "./rules/rule/RuleEditor";
import { RuleType } from "@/types/rule";
import type { BookmarkRule } from "@/types/rule";
import styles from "./RulesTab.module.css";

export function RulesTab() {
  const { items: rules, save: onSave, remove: onRemove, removeWithDescendants } = useBookmarkRules();
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const { translate: t } = useTranslation();

  // `null` means the virtual default-folder root — also the fallback once
  // the previously selected rule (or an ancestor of it) no longer exists,
  // e.g. right after a delete.
  const effectiveSelectedId = selectedId !== null && rules.some((r) => r.id === selectedId) ? selectedId : null;

  const addRule = (parentId: string | undefined) => {
    const rule: BookmarkRule = {
      id: crypto.randomUUID(),
      name: "",
      desc: "",
      condition: { type: RuleType.OR, nodes: [] },
      targetFolder: "",
      priority: 0,
      enabled: true,
      parentId,
    };
    void onSave(rule);
    setSelectedId(rule.id);
  };

  const toggleEnabled = (rule: BookmarkRule) => {
    void onSave({ ...rule, enabled: !rule.enabled });
  };

  const selected = rules.find((r) => r.id === effectiveSelectedId) ?? null;

  return (
    <div>
      <TabHeader title={t("nav.rules")} lead={t("rulesTab.lead")} />

      <div className={styles.grid}>
        <div className={styles.list}>
          <RuleTree
            rules={rules}
            selectedId={effectiveSelectedId}
            onSelect={setSelectedId}
            onToggleEnabled={toggleEnabled}
            onAddRule={addRule}
            onRemove={onRemove}
            onRemoveWithDescendants={removeWithDescendants}
          />
        </div>

        {selected ? <RuleEditor key={selected.id} rule={selected} onSave={onSave} /> : <DefaultFolderPanel />}
      </div>
    </div>
  );
}
