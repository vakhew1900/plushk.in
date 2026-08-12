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
import { LibraryTab } from "@/components/options/tabs/LibraryTab";
import { MappingsTab } from "@/components/options/tabs/MappingsTab";
import { CategoriesTab } from "@/components/options/tabs/CategoriesTab";
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
          {tab === "library" && <LibraryTab />}
          {tab === "mappings" && <MappingsTab />}
          {tab === "categories" && <CategoriesTab />}
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
