import { Button } from '@/components/ui/button';
import { IconSliders } from '@/components/icons';
import { browser } from 'wxt/browser';
import styles from './PopupFooter.module.css';

function openSettings() {
  browser.tabs.create({ url: browser.runtime.getURL('/options.html') });
}

export function PopupFooter() {
  return (
    <div className={styles.footer}>
      <Button variant="ghost" size="sm" style={{ color: 'var(--accent)' }} onClick={openSettings}>
        <IconSliders size={13} />
        Настройки
      </Button>
    </div>
  );
}
