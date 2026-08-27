import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
} from '@/components/ui/dropdown-menu';
import { DropdownTriggerButton } from '@/components/ui/dropdown-trigger';
import { PaletteDot } from '@/components/ui/palette-dot';
import { useTranslation } from '@/hooks/useTranslation';
import type { WorkflowStatus } from '@/types/workflow-status';

interface Props {
  statuses: WorkflowStatus[];
  selectedStatusId: string | undefined;
  onChange: (statusId: string | undefined) => void;
  disabled: boolean;
}

export function StatusFilterDropdown({ statuses, selectedStatusId, onChange, disabled }: Props) {
  const { translate: t } = useTranslation();
  const selected = statuses.find((status) => status.id === selectedStatusId);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild disabled={disabled}>
        <DropdownTriggerButton active={Boolean(selected)} disabled={disabled}>
          {selected ? selected.name : t('searchTab.filters.statusLabel')}
        </DropdownTriggerButton>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start">
        <DropdownMenuCheckboxItem checked={!selected} onCheckedChange={() => onChange(undefined)}>
          {t('searchTab.filters.anyStatus')}
        </DropdownMenuCheckboxItem>
        {statuses.map((status) => (
          <DropdownMenuCheckboxItem
            key={status.id}
            checked={status.id === selectedStatusId}
            onCheckedChange={() => onChange(status.id)}
          >
            <PaletteDot color={status.color} />
            {status.name}
          </DropdownMenuCheckboxItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
