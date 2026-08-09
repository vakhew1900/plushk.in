import { useCallback, useEffect, useState } from 'react';
import { browser } from 'wxt/browser';
import { useServices } from '@/hooks/useServices';
import { debugLog } from '@/lib/debug-log';
import { Mode } from '@/types/mode';
import type { PageMeta } from '@/types/page-meta';

interface ActiveTab {
  title: string;
  url: string;
}

export function useQuickSave(mode: Mode) {
  const { pageMatchGroupRepository, pageMetaFiller, pageExtrasService, quickSaveFolderResolver, bookmarkRepository } =
    useServices();
  const [tab, setTab] = useState<ActiveTab | undefined>(undefined);
  const [suggestedFolder, setSuggestedFolder] = useState<string | undefined>(undefined);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    let cancelled = false;

    void browser.tabs.query({ active: true, currentWindow: true }).then(async ([activeTab]) => {
      if (cancelled || !activeTab?.url) return;

      const baseMeta = await pageMetaFiller.fillPageMeta({ url: activeTab.url, title: activeTab.title ?? '' });
      setTab({ title: baseMeta.title, url: baseMeta.url });

      // Off mode never resolves a folder — skip the extraction round-trip entirely.
      if (mode === Mode.OFF) return;

      let overlay: Partial<PageMeta> | undefined;
      if (activeTab.id !== undefined) {
        const groups = await pageMatchGroupRepository.getAll();
        overlay = await pageExtrasService.extract(activeTab.id, groups);
      }

      const meta: PageMeta = { ...baseMeta, ...overlay };

      const folder = await quickSaveFolderResolver.resolve(meta);
      debugLog('[quick-save-debug] popup: resolved suggested folder', folder);
      if (!cancelled) setSuggestedFolder(folder);
    });

    return () => {
      cancelled = true;
    };
  }, [mode, pageMatchGroupRepository, pageMetaFiller, pageExtrasService, quickSaveFolderResolver]);

  const save = useCallback(
    async (targetFolder: string) => {
      if (!tab) return;
      debugLog('[quick-save-debug] popup: creating bookmark with targetFolder', targetFolder);
      await bookmarkRepository.create(tab.title, tab.url, targetFolder);
      setSaved(true);
    },
    [tab, bookmarkRepository],
  );

  return { tab, suggestedFolder, saved, save };
}
