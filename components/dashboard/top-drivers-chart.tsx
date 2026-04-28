import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCurrency } from "@/lib/utils";
import type { TopDriver } from "@/types";

const Y_STEPS = 7;

function niceMax(raw: number) {
  if (raw <= 0) return 700;
  const step = Math.pow(10, Math.floor(Math.log10(raw)));
  return Math.ceil(raw / step) * step;
}

export function TopDriversChart({ drivers }: { drivers: TopDriver[] }) {
  const rawMax = Math.max(...drivers.map((d) => d.total_earnings), 0);
  const max = niceMax(rawMax);
  const stepValue = max / Y_STEPS;

  const yLabels = Array.from({ length: Y_STEPS + 1 }, (_, i) =>
    formatCurrency(max - stepValue * i)
  );

  return (
    <Card className="h-full rounded-[8px] border border-[#e6e9f0] shadow-none">
      <CardHeader className="px-5 pb-2 pt-5">
        <CardTitle className="text-[20px] font-semibold text-[#101010]">
          Top 10 Drivers by Earning
        </CardTitle>
      </CardHeader>

      <CardContent className="px-5 pb-5 pt-4">
        <div className="flex gap-3">
          <div className="flex h-[220px] shrink-0 flex-col justify-between pt-0 text-right">
            {yLabels.map((label, i) => (
              <span key={i} className="text-[12px] leading-none text-[#747985]">
                {label}
              </span>
            ))}
          </div>

          <div className="relative h-[245px] flex-1 rounded-lg border border-dashed border-[#e6e9f0]">
            <div className="absolute inset-x-0 top-0 h-[220px] px-2">
              <div className="flex h-full flex-col justify-between">
                {Array.from({ length: Y_STEPS + 1 }).map((_, i) => (
                  <span key={i} className="block border-t border-dashed border-[#e6e9f0]" />
                ))}
              </div>
            </div>

            <div
              className="absolute inset-x-2 top-0 grid h-[220px] items-end"
              style={{
                gridTemplateColumns: `repeat(${Math.max(
                  drivers.length,
                  1
                )}, minmax(0, 1fr))`,
              }}
            >
              {drivers.map((driver) => {
                const pct = max > 0 ? driver.total_earnings / max : 0;
                const height = Math.max(18, pct * 190);

                return (
                  <div
                    key={`${driver.driver_name}-${driver.total_earnings}`}
                    className="flex h-full items-end justify-center"
                  >
                    <div
                      className="w-[36px] rounded-t-[6px] bg-[#234f9f]"
                      style={{ height }}
                    />
                  </div>
                );
              })}
            </div>

            <div
              className="absolute inset-x-2 bottom-2 grid"
              style={{
                gridTemplateColumns: `repeat(${Math.max(
                  drivers.length,
                  1
                )}, minmax(0, 1fr))`,
              }}
            >
              {drivers.map((driver) => (
                <p
                  key={driver.driver_name}
                  className="truncate text-center text-[11px] leading-tight text-[#747985]"
                >
                  {driver.driver_name}
                </p>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}