import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { IconPlus } from "@/components/icons";
import { useTranslation } from "@/hooks/useTranslation";
import { TabHeader } from "@/components/options/TabHeader";
import { RuleListItem } from "./rules/rule/RuleListItem";
import { RuleEditor } from "./rules/rule/RuleEditor";
import type { Condition } from "./rules/condition/ConditionGroup";
import styles from "./RulesTab.module.css";

interface Group {
  conds: Condition[];
}
interface Rule {
  id: string;
  name: string;
  desc: string;
  enabled: boolean;
  groups: Group[];
}

const INITIAL_RULES: Rule[] = [
  {
    id: "social",
    name: "Соцсети",
    desc: "Facebook, Reddit, Pinterest и другие соцсети → папка «Соцсети». Региональные зеркала ловятся через алиасы.",
    enabled: true,
    groups: [
      {
        conds: [
          { field: "alias", opLabel: "равно", value: "reddit" },
          { field: "title", opLabel: "не равно", value: "ad", isNot: true },
        ],
      },
      { conds: [{ field: "alias", opLabel: "равно", value: "facebook" }] },
    ],
  },
  {
    id: "reading",
    name: "Чтение / Лонгриды",
    desc: "Habr и длинные статьи (более 800 слов или тег article) → папка «Чтение».",
    enabled: true,
    groups: [
      {
        conds: [
          { field: "alias", opLabel: "равно", value: "habr" },
          { field: "tag", opLabel: "равно", value: "article" },
        ],
      },
    ],
  },
  {
    id: "design",
    name: "Дизайн-инспирация",
    desc: "Pinterest и дизайн-ресурсы с UI в заголовке → папка «Инспирация».",
    enabled: false,
    groups: [
      {
        conds: [
          { field: "alias", opLabel: "равно", value: "dribbble" },
          { field: "title", opLabel: "содержит", value: "UI" },
        ],
      },
    ],
  },
];

export function RulesTab() {
  const [rules, setRules] = useState<Rule[]>(INITIAL_RULES);
  const [sel, setSel] = useState(0);
  const { translate: t } = useTranslation();

  useEffect(() => {
    setSel((s) => Math.min(s, Math.max(rules.length - 1, 0)));
  }, [rules.length]);

  const updateRule = (id: string, patch: Partial<Rule>) =>
    setRules((prev) => prev.map((r) => (r.id === id ? { ...r, ...patch } : r)));

  const addRule = () => {
    setRules((prev) => [
      ...prev,
      { id: crypto.randomUUID(), name: "", desc: "", enabled: true, groups: [] },
    ]);
    setSel(rules.length);
  };

  const removeRule = (id: string) =>
    setRules((prev) => prev.filter((r) => r.id !== id));

  const selected = rules[sel];

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
              desc={r.desc}
              enabled={r.enabled}
              selected={sel === i}
              onSelect={() => setSel(i)}
              onToggle={() => updateRule(r.id, { enabled: !r.enabled })}
              onRemove={() => removeRule(r.id)}
            />
          ))}
          <Button variant="dashed" style={{ width: "100%" }} onClick={addRule}>
            <IconPlus size={13} />
            {t("rulesTab.addRule")}
          </Button>
        </div>

        {selected && (
          <RuleEditor
            name={selected.name}
            desc={selected.desc}
            groups={selected.groups}
            onNameChange={(name) => updateRule(selected.id, { name })}
            onDescChange={(desc) => updateRule(selected.id, { desc })}
          />
        )}
      </div>
    </div>
  );
}
