import ReactDOM from 'react-dom/client';
import { browser } from 'wxt/browser';
import { buildCssSelector } from '@/lib/css-selector';
import { QuickAddPanel } from '@/components/quick-add/QuickAddPanel';
import { isQuickAddOpenMessage } from '@/types/messages/quick-add-message';
import { LocaleContext } from '@/context/LocaleContext';
import { dictionaries } from '@/locale';
import { LocaleSettingsRepository } from '@/repository/LocaleSettingsRepository';

interface CapturedRightClick {
  element: Element;
  x: number;
  y: number;
}

const KeyboardKey = { ESCAPE: 'Escape' } as const;

// RULE-14 — right-click "add variable"/"add domain icon". Persistent
// (manifest-registered, unlike content.ts's on-demand RULE-3/RULE-5 script):
// unlike a menu click, there's no way to inject a listener *after* the fact
// and still see which element was right-clicked, since chrome.contextMenus.
// onClicked (background.ts) has no DOM access at all. See specs/tasks/
// RULE-14-context-menu-quick-add/description.md.
export default defineContentScript({
  matches: ['<all_urls>'],
  cssInjectionMode: 'ui',
  async main(ctx) {
    let lastRightClick: CapturedRightClick | undefined;

    // Capture phase, so this still sees the real target even if a page stops
    // propagation of its own contextmenu handling somewhere in the middle.
    document.addEventListener(
      'contextmenu',
      (event) => {
        if (!(event.target instanceof Element)) return;
        lastRightClick = { element: event.target, x: event.clientX, y: event.clientY };
      },
      { capture: true },
    );

    let shadowHost: Element | undefined;
    let activeUi: { remove(): void } | undefined;

    function closePanel() {
      activeUi?.remove();
      activeUi = undefined;
      shadowHost = undefined;
    }

    document.addEventListener(
      'mousedown',
      (event) => {
        if (!shadowHost) return;
        if (event.composedPath().includes(shadowHost)) return;
        closePanel();
      },
      { capture: true },
    );

    document.addEventListener('keydown', (event) => {
      if (event.key === KeyboardKey.ESCAPE) closePanel();
    });

    browser.runtime.onMessage.addListener((message: unknown) => {
      if (!isQuickAddOpenMessage(message) || !lastRightClick) return;

      const { element, x, y } = lastRightClick;
      const selector = buildCssSelector(element, document);
      const domain = location.hostname;

      closePanel();

      void (async () => {
        // No `LocaleProvider` up the tree here (this React root has no
        // ancestors at all — it's mounted fresh inside the shadow root), so
        // the Provider value is built by hand instead of rendered from
        // `@/context/LocaleContext`'s own component. `setLocale` is a no-op:
        // this panel has no language switcher, it only ever reads.
        const locale = await new LocaleSettingsRepository().get();

        const ui = await createShadowRootUi(ctx, {
          name: 'plushkin-quick-add',
          position: 'inline',
          anchor: 'body',
          onMount: (container, shadow) => {
            shadowHost = shadow.host;
            const root = ReactDOM.createRoot(container);
            root.render(
              <LocaleContext.Provider value={{ locale, dict: dictionaries[locale], setLocale: () => {} }}>
                <QuickAddPanel
                  kind={message.kind}
                  domain={domain}
                  selector={selector}
                  anchor={{ x, y }}
                  onClose={closePanel}
                />
              </LocaleContext.Provider>,
            );
            return root;
          },
          onRemove: (root) => root?.unmount(),
        });

        activeUi = ui;
        ui.mount();
      })();
    });
  },
});
