import { useCallback, useEffect, useState } from 'react';
import { browser } from 'wxt/browser';
import { useServices } from '@/hooks/useServices';
import { createModeHandler } from '@/services/handler/createModeHandler';
import { BookmarkDecisionStatus } from '@/services/handler/interfaces/IBookmarkModeHandler';
import { debugLog } from '@/lib/debug-log';
import { Mode } from '@/types/mode';
import type { PageMeta } from '@/types/page-meta';

interface ActiveTab {
  title: string;
  url: string;
}

export function useQuickSave(mode: Mode) {
  const { bookmarkRuleRepository, quickSaveService } = useServices();
  const [tab, setTab] = useState<ActiveTab | undefined>(undefined);
  const [suggestedFolder, setSuggestedFolder] = useState<string | undefined>(undefined);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    let cancelled = false;

    browser.tabs.query({ active: true, currentWindow: true }).then(async ([activeTab]) => {
      if (cancelled || !activeTab?.url) return;

      const meta: PageMeta = {
        url: activeTab.url,
        domain: new URL(activeTab.url).hostname,
        title: activeTab.title ?? '',
      };
      setTab({ title: meta.title, url: meta.url });

      const handler = createModeHandler(mode, bookmarkRuleRepository);
      if (handler.status === BookmarkDecisionStatus.PENDING_CONFIRMATION) {
        const decision = await handler.onBookmarkSelected(meta);
        debugLog('[quick-save-debug] popup: suggested folder from matched rule', decision.targetFolder, decision.matchedRule);
        if (!cancelled) setSuggestedFolder(decision.targetFolder);
      }
    });

    return () => {
      cancelled = true;
    };
  }, [mode, bookmarkRuleRepository]);

  const save = useCallback(
    async (targetFolder?: string) => {
      if (!tab) return;
      debugLog('[quick-save-debug] popup: sending save message with targetFolder', targetFolder);
      await quickSaveService.create({ title: tab.title, url: tab.url, mode, targetFolder });
      setSaved(true);
    },
    [tab, mode, quickSaveService],
  );

  return { tab, suggestedFolder, saved, save };
}
