import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCurrency } from "@/lib/utils";
import type { TopDriver } from "@/types";

export function TopDriversChart({ drivers }: { drivers: TopDriver[] }) {
  const max = Math.max(...drivers.map((driver) => driver.total_earnings), 1);

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="text-[16px] leading-[1.2] font-medium">
          Top 10 Drivers by Earning
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid min-h-[420px] grid-cols-5 items-end gap-5 rounded-3xl border border-dashed border-[var(--border)] px-4 py-8 lg:grid-cols-10">
          {drivers.map((driver) => {
            const height = Math.max(18, (driver.total_earnings / max) * 260);

            return (
              <div key={`${driver.driver_name}-${driver.total_earnings}`} className="flex flex-col items-center gap-4">
                <p className="text-[14px] leading-[1.2] font-normal text-[var(--muted-foreground)]">
                  {formatCurrency(driver.total_earnings)}
                </p>
                <div
                  className="w-full rounded-t-2xl bg-[var(--secondary)] shadow-[0_14px_24px_rgba(35,75,151,0.18)]"
                  style={{ height }}
                />
                <p className="max-w-16 text-center text-[14px] leading-[1.2] font-normal text-[var(--muted-foreground)] sm:max-w-24">
                  {driver.driver_name}
                </p>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
