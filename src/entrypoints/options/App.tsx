import { useEffect, useState } from "react";
import "./style.css";
import { LocaleProvider } from "@/context/LocaleContext";
import { ThemeProvider } from "@/context/ThemeContext";
import { ServicesProvider } from "@/context/ServicesContext";
import { ToastProvider } from "@/context/ToastContext";
import { useTheme } from "@/hooks/useTheme";
import { useTranslation } from "@/hooks/useTranslation";
import { OptionsSidebar } from "@/components/options/OptionsSidebar";
import type { Tab } from "@/components/options/OptionsSidebar";
import { MainTab } from "@/components/options/tabs/MainTab";
import { RulesTab } from "@/components/options/tabs/RulesTab";
import { SearchTab } from "@/components/options/tabs/SearchTab";
import { AliasesTab } from "@/components/options/tabs/AliasesTab";
import { TagsTab } from "@/components/options/tabs/TagsTab";
import { Toaster } from "@/components/Toaster";
import styles from "./App.module.css";

function AppShell() {
  const [tab, setTab] = useState<Tab>("main");
  const { resolvedTheme } = useTheme();
  const { translate: t, locale } = useTranslation();

  useEffect(() => {
    document.title = t("options.documentTitle");
  }, [t, locale]);

  return (
    <div data-theme={resolvedTheme} className={styles.root}>
      <div className={styles.body}>
        <OptionsSidebar tab={tab} onTabChange={setTab} />
        <div className={styles.content}>
          {tab === "main" && <MainTab />}
          {tab === "rules" && <RulesTab />}
          {tab === "search" && <SearchTab />}
          {tab === "aliases" && <AliasesTab />}
          {tab === "tags" && <TagsTab />}
        </div>
      </div>
      <Toaster />
    </div>
  );
}

export default function App() {
  return (
    <LocaleProvider>
      <ThemeProvider>
        <ServicesProvider>
          <ToastProvider>
            <AppShell />
          </ToastProvider>
        </ServicesProvider>
      </ThemeProvider>
    </LocaleProvider>
  );
}
