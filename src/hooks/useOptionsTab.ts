import { useCallback, useState } from 'react';
import { Tab } from '@/components/options/OptionsSidebar';

const TAB_PARAM = 'tab';

function isTab(value: string | null): value is Tab {
  return (Object.values(Tab) as string[]).includes(value ?? '');
}

function readTabFromUrl(): Tab {
  const value = new URLSearchParams(window.location.search).get(TAB_PARAM);
  return isTab(value) ? value : Tab.MAIN;
}

export function useOptionsTab() {
  const [tab, setTabState] = useState<Tab>(readTabFromUrl);

  const setTab = useCallback((value: Tab) => {
    setTabState(value);
    const url = new URL(window.location.href);
    url.searchParams.set(TAB_PARAM, value);
    window.history.replaceState(null, '', url);
  }, []);

  return { tab, setTab };
}
