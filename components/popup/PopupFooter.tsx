import { Button } from '@/components/ui/button';
import { browser } from 'wxt/browser';

function openSettings() {
  browser.tabs.create({ url: browser.runtime.getURL('/options.html') });
}

export function PopupFooter() {
  return (
    <div className="flex items-center justify-end px-4 py-[11px] border-t border-border bg-bg2">
      <Button
        variant="ghost"
        size="sm"
        className="text-accent hover:text-accent"
        onClick={openSettings}
      >
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
          <path d="M4 7h9M19 7h1M4 17h5M15 17h5" />
          <circle cx="16" cy="7" r="2.2" />
          <circle cx="11" cy="17" r="2.2" />
        </svg>
        Настройки
      </Button>
    </div>
  );
}
