import { useState } from "react";
import "./style.css";
import { LocaleProvider } from "@/context/LocaleContext";
import { OptionsSidebar } from "@/components/options/OptionsSidebar";
import type { Tab } from "@/components/options/OptionsSidebar";
import { MainTab } from "@/components/options/tabs/MainTab";
import { RulesTab } from "@/components/options/tabs/RulesTab";
import { AliasesTab } from "@/components/options/tabs/AliasesTab";
import styles from "./App.module.css";

export default function App() {
  const [tab, setTab] = useState<Tab>("main");

  return (
    <LocaleProvider>
      <div data-theme="dark" className={styles.root}>
        <div className={styles.body}>
          <OptionsSidebar tab={tab} onTabChange={setTab} ruleCount={3} />
          <div className={styles.content}>
            {tab === "main" && <MainTab />}
            {tab === "rules" && <RulesTab />}
            {tab === "aliases" && <AliasesTab />}
          </div>
        </div>
      </div>
    </LocaleProvider>
  );
}
