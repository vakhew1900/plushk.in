import type React from 'react';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
} from '@/components/ui/dropdown-menu';
import { PaletteDot } from '@/components/ui/palette-dot';
import { useTranslation } from '@/hooks/useTranslation';
import type { WorkflowStatus } from '@/types/workflow-status';
import styles from './StatusSegment.module.css';

interface Props {
  statuses: WorkflowStatus[];
  selectedStatus: WorkflowStatus | undefined;
  onChoose: (statusId: string) => void;
}

export function StatusSegment({ statuses, selectedStatus, onChoose }: Props) {
  const { translate: t } = useTranslation();
  const handleClick = (e: React.MouseEvent) => e.stopPropagation();
  const current = selectedStatus ?? statuses[0];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button type="button" className={styles.segment} onClick={handleClick} title={t('bookmarkEntityControl.editTooltip')}>
          <PaletteDot color={current.color} size="md" />
          {current.name}
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" onClick={handleClick}>
        {statuses.map((status) => (
          <DropdownMenuCheckboxItem
            key={status.id}
            checked={status.id === current.id}
            onCheckedChange={() => onChoose(status.id)}
          >
            <PaletteDot color={status.color} />
            {status.name}
          </DropdownMenuCheckboxItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
