import { useEffect, useState } from "react";
import "./style.css";
import { LocaleProvider } from "@/context/LocaleContext";
import { ThemeProvider } from "@/context/ThemeContext";
import { ServicesProvider } from "@/context/ServicesContext";
import { useTheme } from "@/hooks/useTheme";
import { useTranslation } from "@/hooks/useTranslation";
import { useBookmarkRules } from "@/hooks/useBookmarkRules";
import { OptionsSidebar } from "@/components/options/OptionsSidebar";
import type { Tab } from "@/components/options/OptionsSidebar";
import { MainTab } from "@/components/options/tabs/MainTab";
import { RulesTab } from "@/components/options/tabs/RulesTab";
import { AliasesTab } from "@/components/options/tabs/AliasesTab";
import styles from "./App.module.css";

function AppShell() {
  const [tab, setTab] = useState<Tab>("main");
  const { resolvedTheme } = useTheme();
  const { translate: t, locale } = useTranslation();
  const rules = useBookmarkRules();

  useEffect(() => {
    document.title = t("options.documentTitle");
  }, [t, locale]);

  return (
    <div data-theme={resolvedTheme} className={styles.root}>
      <div className={styles.body}>
        <OptionsSidebar tab={tab} onTabChange={setTab} ruleCount={rules.items.length} />
        <div className={styles.content}>
          {tab === "main" && <MainTab />}
          {tab === "rules" && <RulesTab rules={rules.items} onSave={rules.save} onRemove={rules.remove} />}
          {tab === "aliases" && <AliasesTab />}
        </div>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <LocaleProvider>
      <ThemeProvider>
        <ServicesProvider>
          <AppShell />
        </ServicesProvider>
      </ThemeProvider>
    </LocaleProvider>
  );
}
