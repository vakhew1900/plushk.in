import { Badge } from '@/components/ui/badge';

interface Props {
  name: string;
  domains: string[];
  isLast?: boolean;
}

export function AliasRow({ name, domains, isLast }: Props) {
  return (
    <div className={`flex gap-[13px] px-[15px] py-[13px] ${isLast ? '' : 'border-b border-border'}`}>
      <Badge variant="accent" className="font-mono text-[12.5px] shrink-0 self-start">
        {name}
      </Badge>
      <div className="flex flex-wrap gap-[6px] flex-1 items-center">
        {domains.map((d) => (
          <Badge key={d} variant="mono">{d}</Badge>
        ))}
      </div>
    </div>
  );
}
