import { useEffect, useMemo, useState } from 'react';
import { browser } from 'wxt/browser';
import { applyCssSelector } from '@/lib/page-extractor';
import { applyIconSelector } from '@/lib/icon-extractor';
import { IconSourceType } from '@/types/icon-rule';
import { QuickAddKind, QuickAddSaveMessageType, type QuickAddSaveResult } from '@/types/messages/quick-add-message';
import { Text } from '@/components/ui/text';
import { useTranslation } from '@/hooks/useTranslation';
import { QuickAddHeader } from './QuickAddHeader';
import { QuickAddSelectorField } from './QuickAddSelectorField';
import { QuickAddVariablePreview } from './QuickAddVariablePreview';
import { QuickAddIconPreview } from './QuickAddIconPreview';
import { QuickAddNameField } from './QuickAddNameField';
import { QuickAddFooter } from './QuickAddFooter';
import { QuickAddStatus } from './quick-add-status';
import type { VariableMatch, IconMatch } from './quick-add-match';
import styles from './QuickAddPanel.module.css';

const PANEL_WIDTH = 340;
const ESTIMATED_PANEL_HEIGHT = 420;
const VIEWPORT_MARGIN = 12;
const MAX_VISIBLE_TEXT_VALUES = 20; // guards against a runaway selector matching most of the page
const MATCH_DEBOUNCE_MS = 250; // matches the ~200ms lag already used for library search (specs/verification.md, SEARCH-10)

function clamp(value: number, max: number): number {
  return Math.max(VIEWPORT_MARGIN, Math.min(value, max - VIEWPORT_MARGIN));
}

function resolveVariableMatch(selector: string, doc: Document): VariableMatch {
  const values = applyCssSelector(selector, doc);
  if (!values || values.length === 0) return { status: 'empty', values: [] };
  if (values.length === 1) return { status: 'single', values: [values[0]] };
  return { status: 'multiple', values: values.slice(0, MAX_VISIBLE_TEXT_VALUES) };
}

function resolveIconMatch(selector: string, doc: Document): IconMatch {
  const url = applyIconSelector({ type: IconSourceType.CSS, value: selector }, doc);
  return url ? { status: 'found', url } : { status: 'empty' };
}

interface QuickAddPanelProps {
  kind: QuickAddKind;
  domain: string;
  selector: string;
  anchor: { x: number; y: number };
  onClose: () => void;
}

export function QuickAddPanel({ kind, domain, selector: initialSelector, anchor, onClose }: QuickAddPanelProps) {
  const { translate: t } = useTranslation();
  const [selector, setSelector] = useState(initialSelector);
  const [variableMatch, setVariableMatch] = useState<VariableMatch | undefined>(undefined);
  const [iconMatch, setIconMatch] = useState<IconMatch | undefined>(undefined);
  const [name, setName] = useState('');
  const [nameError, setNameError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  // Re-runs on every selector change, not just the initial auto-generated
  // one — the field is editable (QuickAddSelectorField), so a hand-typed
  // selector gets the same "Поиск" -> green/red preview cycle. Debounced
  // (not the near-instant single tick this used before editing existed) so
  // typing doesn't flash "searching" on every keystroke.
  useEffect(() => {
    // Deferred (not called synchronously in the effect body) purely to
    // satisfy react-hooks/set-state-in-effect — still fires effectively
    // immediately, so the "searching" state shows up right away while the
    // debounced timer below is still pending.
    const resetTimer = setTimeout(() => {
      if (kind === QuickAddKind.VARIABLE) {
        setVariableMatch(undefined);
      } else {
        setIconMatch(undefined);
      }
    }, 0);

    const resolveTimer = setTimeout(() => {
      if (kind === QuickAddKind.VARIABLE) {
        setVariableMatch(resolveVariableMatch(selector, document));
      } else {
        setIconMatch(resolveIconMatch(selector, document));
      }
    }, MATCH_DEBOUNCE_MS);

    return () => {
      clearTimeout(resetTimer);
      clearTimeout(resolveTimer);
    };
  }, [kind, selector]);

  const status: QuickAddStatus = useMemo(() => {
    const match = kind === QuickAddKind.VARIABLE ? variableMatch : iconMatch;
    if (match === undefined) return QuickAddStatus.SEARCHING;
    return match.status === 'empty' ? QuickAddStatus.EMPTY : QuickAddStatus.OK;
  }, [kind, variableMatch, iconMatch]);

  const position = useMemo(
    () => ({
      left: clamp(anchor.x, window.innerWidth - PANEL_WIDTH),
      top: clamp(anchor.y, window.innerHeight - ESTIMATED_PANEL_HEIGHT),
    }),
    [anchor.x, anchor.y],
  );

  const trimmedName = name.trim();
  const saveDisabled = saving || status !== QuickAddStatus.OK || trimmedName.length === 0;

  async function handleSave() {
    if (saveDisabled) return;
    setSaving(true);
    setNameError(null);

    const result: QuickAddSaveResult = await browser.runtime.sendMessage({
      type: QuickAddSaveMessageType,
      kind,
      domain,
      name: trimmedName,
      selector,
    });

    setSaving(false);
    if (result.ok) {
      onClose();
      return;
    }

    setNameError(
      t(kind === QuickAddKind.VARIABLE ? 'quickAdd.duplicateVariable' : 'quickAdd.duplicateIcon', {
        name: trimmedName,
        domain,
      }),
    );
  }

  return (
    <div className={styles.panel} style={{ left: position.left, top: position.top }}>
      <QuickAddHeader
        title={t(kind === QuickAddKind.VARIABLE ? 'quickAdd.titleVariable' : 'quickAdd.titleIcon')}
        onClose={onClose}
      />

      <div className={styles.section}>
        <QuickAddNameField
          id="quickadd-name"
          label={t('quickAdd.nameLabel')}
          placeholder={t(kind === QuickAddKind.VARIABLE ? 'quickAdd.namePlaceholderVariable' : 'quickAdd.namePlaceholderIcon')}
          value={name}
          error={nameError}
          onChange={(value) => {
            setName(value);
            setNameError(null);
          }}
        />
      </div>

      <Text as="div" size="caption" tone="muted" className={styles.section}>{t('quickAdd.domainLabel', { domain })}</Text>

      <div className={styles.section}>
        <QuickAddSelectorField value={selector} status={status} onChange={setSelector} />
      </div>

      <div className={styles.section}>
        {kind === QuickAddKind.VARIABLE
          ? <QuickAddVariablePreview match={variableMatch} />
          : <QuickAddIconPreview match={iconMatch} />}
      </div>

      <QuickAddFooter saving={saving} saveDisabled={saveDisabled} onSave={() => void handleSave()} />
    </div>
  );
}
