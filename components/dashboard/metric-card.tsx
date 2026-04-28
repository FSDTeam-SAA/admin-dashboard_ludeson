import type { LucideIcon } from "lucide-react";
import { Card } from "@/components/ui/card";
import { formatPercent } from "@/lib/utils";

export function MetricCard({
  title,
  value,
  change,
  icon: Icon,
  periodLabel = "last month",
}: {
  title: string;
  value: string;
  change: number;
  icon: LucideIcon;
  periodLabel?: string;
}) {
  return (
    <Card className="metric-glow p-6">
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-3">
          <p className="text-[16px] leading-[1.2] font-medium text-[var(--foreground)]">
            {title}
          </p>
          <div className="space-y-1">
            <p className="text-[16px] leading-[1.2] font-medium text-[var(--foreground)]">
              {value}
            </p>
            <p className="text-[14px] leading-[1.2] font-normal text-[var(--muted-foreground)]">
              {formatPercent(change)} from {periodLabel}
            </p>
          </div>
        </div>
        <div className="rounded-2xl bg-[var(--soft)] p-3 text-[var(--secondary)]">
          <Icon className="size-6" />
        </div>
      </div>
    </Card>
  );
}
