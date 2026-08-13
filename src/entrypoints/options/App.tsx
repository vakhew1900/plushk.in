import { useEffect } from "react";
import "./style.css";
import { LocaleProvider } from "@/context/LocaleContext";
import { ThemeProvider } from "@/context/ThemeContext";
import { ServicesProvider } from "@/context/ServicesContext";
import { ToastProvider } from "@/context/ToastContext";
import { useTheme } from "@/hooks/useTheme";
import { useTranslation } from "@/hooks/useTranslation";
import { useOptionsTab } from "@/hooks/useOptionsTab";
import { OptionsSidebar, Tab } from "@/components/options/OptionsSidebar";
import { MainTab } from "@/components/options/tabs/MainTab";
import { RulesTab } from "@/components/options/tabs/RulesTab";
import { LibraryTab } from "@/components/options/tabs/LibraryTab";
import { MappingsTab } from "@/components/options/tabs/MappingsTab";
import { CategoriesTab } from "@/components/options/tabs/CategoriesTab";
import { Toaster } from "@/components/Toaster";
import styles from "./App.module.css";

function AppShell() {
  const { tab, setTab } = useOptionsTab();
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
          {tab === Tab.MAIN && <MainTab />}
          {tab === Tab.RULES && <RulesTab />}
          {tab === Tab.LIBRARY && <LibraryTab />}
          {tab === Tab.MAPPINGS && <MappingsTab />}
          {tab === Tab.CATEGORIES && <CategoriesTab />}
        </div>
      </div>
      <Toaster />
    </div>
  );
}

export default function App() {
  return (
    <LocaleProvider>
      <ServicesProvider>
        <ThemeProvider>
          <ToastProvider>
            <AppShell />
          </ToastProvider>
        </ThemeProvider>
      </ServicesProvider>
    </LocaleProvider>
  );
}
