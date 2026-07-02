import { useState } from 'react';
import './style.css';
import { OptionsSidebar } from '@/components/options/OptionsSidebar';
import type { Tab } from '@/components/options/OptionsSidebar';
import { MainTab } from '@/components/options/tabs/MainTab';
import { RulesTab } from '@/components/options/tabs/RulesTab';
import { AliasesTab } from '@/components/options/tabs/AliasesTab';

export default function App() {
  const [tab, setTab] = useState<Tab>('main');

  return (
    <div data-theme="dark" className="min-h-screen bg-backdrop text-text font-sans text-sm antialiased">
      {/* Window chrome */}
      <div className="flex items-center h-[42px] px-[14px] border-b border-border bg-bg2">
        <div className="flex gap-[6px]">
          <span className="w-[10px] h-[10px] rounded-full bg-border inline-block" />
          <span className="w-[10px] h-[10px] rounded-full bg-border inline-block" />
          <span className="w-[10px] h-[10px] rounded-full bg-border inline-block" />
        </div>
        <div className="flex-1 text-center text-xs text-muted font-medium">
          Сортировщик — Страница настроек
        </div>
        <div className="w-[42px]" />
      </div>

      {/* Body */}
      <div className="flex min-h-[calc(100vh-42px)]">
        <OptionsSidebar tab={tab} onTabChange={setTab} ruleCount={3} />
        <div className="flex-1 min-w-0 p-[28px_30px] overflow-auto">
          {tab === 'main' && <MainTab />}
          {tab === 'rules' && <RulesTab />}
          {tab === 'aliases' && <AliasesTab />}
        </div>
      </div>
    </div>
  );
}
