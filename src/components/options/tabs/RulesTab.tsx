import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { IconPlus } from "@/components/icons";
import { useTranslation } from "@/hooks/useTranslation";
import { TabHeader } from "@/components/options/TabHeader";
import { RuleListItem } from "./rules/rule/RuleListItem";
import { RuleEditor } from "./rules/rule/RuleEditor";
import { RuleType } from "@/types/rule";
import type { BookmarkRule } from "@/types/rule";
import styles from "./RulesTab.module.css";

interface Props {
  rules: BookmarkRule[];
  onSave: (rule: BookmarkRule) => void;
  onRemove: (id: string) => void;
}

export function RulesTab({ rules, onSave, onRemove }: Props) {
  const [selectedId, setSelectedId] = useState<string | null>(rules[0]?.id ?? null);
  const { translate: t } = useTranslation();

  useEffect(() => {
    if (selectedId === null || !rules.some((r) => r.id === selectedId)) {
      setSelectedId(rules[0]?.id ?? null);
    }
  }, [rules, selectedId]);

  const addRule = () => {
    const rule: BookmarkRule = {
      id: crypto.randomUUID(),
      name: "",
      desc: "",
      condition: { type: RuleType.OR, or: [] },
      targetFolder: "",
      priority: 0,
      enabled: true,
    };
    onSave(rule);
    setSelectedId(rule.id);
  };

  const selected = rules.find((r) => r.id === selectedId) ?? null;

  return (
    <div>
      <TabHeader title={t("nav.rules")} lead={t("rulesTab.lead")} />

      <div className={styles.grid}>
        <div className={styles.list}>
          {rules.map((r, i) => (
            <RuleListItem
              key={r.id}
              index={i + 1}
              name={r.name}
              desc={r.desc ?? ""}
              enabled={r.enabled}
              selected={selectedId === r.id}
              onSelect={() => setSelectedId(r.id)}
              onToggle={() => onSave({ ...r, enabled: !r.enabled })}
              onRemove={() => onRemove(r.id)}
            />
          ))}
          <Button variant="dashed" style={{ width: "100%" }} onClick={addRule}>
            <IconPlus size={13} />
            {t("rulesTab.addRule")}
          </Button>
        </div>

        {selected && <RuleEditor key={selected.id} rule={selected} onSave={onSave} />}
      </div>
    </div>
  );
}
