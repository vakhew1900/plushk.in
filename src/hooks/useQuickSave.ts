import { useCallback, useEffect, useState } from 'react';
import { browser } from 'wxt/browser';
import { useServices } from '@/hooks/useServices';
import { debugLog } from '@/lib/debug-log';
import { Mode } from '@/types/mode';
import type { PageMeta } from '@/types/page-meta';
import type { QuickSaveSelection } from '@/types/quick-save';

interface ActiveTab {
  title: string;
  url: string;
}

export interface QuickSaveSuggestion extends QuickSaveSelection {
  ruleName: string | undefined;
  iconRuleName: string | undefined;
}

export function useQuickSave(mode: Mode) {
  const {
    pageMatchGroupRepository,
    pageMetaFiller,
    pageExtrasService,
    quickSaveFolderResolver,
    quickSaveBookmarkCreator,
    iconLinkService,
  } = useServices();
  const [tab, setTab] = useState<ActiveTab | undefined>(undefined);
  const [suggestion, setSuggestion] = useState<QuickSaveSuggestion | undefined>(undefined);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    let cancelled = false;

    void browser.tabs.query({ active: true, currentWindow: true }).then(async ([activeTab]) => {
      if (cancelled || !activeTab?.url) return;

      const { meta: baseMeta, aliasId } = await pageMetaFiller.fillPageMeta({
        url: activeTab.url,
        title: activeTab.title ?? '',
      });
      setTab({ title: baseMeta.title, url: baseMeta.url });

      // Off mode never resolves a folder — skip the extraction round-trip entirely.
      if (mode === Mode.OFF) return;

      // Only the PageMatchGroup scoped to the page's own resolved alias
      // applies here — never every stored group (RULE-12).
      let overlay: Partial<PageMeta> | undefined;
      if (activeTab.id !== undefined && aliasId !== undefined) {
        const groups = await pageMatchGroupRepository.getAll();
        const matchingGroup = groups.find((g) => g.aliasId === aliasId);
        if (matchingGroup) {
          overlay = await pageExtrasService.extract(activeTab.id, [matchingGroup]);
        }
      }

      const meta: PageMeta = { ...baseMeta, ...overlay };

      const resolution = await quickSaveFolderResolver.resolve(meta);
      debugLog('[quick-save-debug] popup: resolved suggested folder', resolution.targetFolder);

      const iconResult = activeTab.id !== undefined ? await iconLinkService.resolveForSave(meta, aliasId, activeTab.id) : undefined;
      if (cancelled) return;

      setSuggestion({
        targetFolder: resolution.targetFolder,
        ruleName: resolution.matchedRuleName,
        tagIds: resolution.tagIds ?? [],
        entityTypeId: resolution.entityTypeId,
        statusId: resolution.statusId,
        iconUrl: iconResult?.url,
        iconRuleName: iconResult?.type === 'rule' ? iconResult.ruleName : undefined,
      });
    });

    return () => {
      cancelled = true;
    };
  }, [mode, pageMatchGroupRepository, pageMetaFiller, pageExtrasService, quickSaveFolderResolver, iconLinkService]);

  const save = useCallback(
    async (selection: QuickSaveSelection) => {
      if (!tab) return;
      debugLog('[quick-save-debug] popup: creating bookmark with selection', selection);
      await quickSaveBookmarkCreator.create(tab.title, tab.url, selection);
      setSaved(true);
    },
    [tab, quickSaveBookmarkCreator],
  );

  return { tab, suggestion, saved, save };
}
