import { Badge } from '@/components/ui/badge';
import styles from './AliasRow.module.css';

interface Props {
  name: string;
  domains: string[];
}

export function AliasRow({ name, domains }: Props) {
  return (
    <div className={styles.row}>
      <Badge variant="accent" style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '12.5px', flexShrink: 0 }}>
        {name}
      </Badge>
      <div className={styles.tags}>
        {domains.map((d) => <Badge key={d} variant="mono">{d}</Badge>)}
      </div>
    </div>
  );
}
