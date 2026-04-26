import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { UserStatusSummary } from "@/types";

export function UserStatusChart({ data }: { data: UserStatusSummary }) {
  const passengerPct = Number(data.passengers_pct);
  const driverPct = Number(data.drivers_pct);

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="text-[16px] leading-[1.2] font-medium">User Status</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col items-center gap-10">
        <div
          className="relative size-[260px] rounded-full"
          style={{
            background: `conic-gradient(var(--secondary) 0 ${passengerPct}%, var(--secondary-soft) ${passengerPct}% 100%)`,
          }}
        >
          <div className="absolute inset-[38px] rounded-full bg-white" />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="space-y-1 text-center">
              <p className="text-[16px] leading-[1.2] font-medium text-[var(--foreground)]">
                {data.passengers_count + data.drivers_count}
              </p>
              <p className="text-[14px] leading-[1.2] font-normal text-[var(--muted-foreground)]">
                Total users
              </p>
            </div>
          </div>
        </div>

        <div className="grid w-full gap-3 sm:grid-cols-2">
          <div className="flex items-center gap-3 rounded-2xl bg-[var(--soft)] px-4 py-3">
            <span className="size-3 rounded-full bg-[var(--secondary)]" />
            <div>
              <p className="text-[14px] leading-[1.2] font-normal text-[var(--muted-foreground)]">
                Total Passenger
              </p>
              <p className="text-[16px] leading-[1.2] font-medium text-[var(--foreground)]">
                {data.passengers_count} ({passengerPct}%)
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3 rounded-2xl bg-[var(--soft)] px-4 py-3">
            <span className="size-3 rounded-full bg-[var(--secondary-soft)]" />
            <div>
              <p className="text-[14px] leading-[1.2] font-normal text-[var(--muted-foreground)]">
                Total Driver
              </p>
              <p className="text-[16px] leading-[1.2] font-medium text-[var(--foreground)]">
                {data.drivers_count} ({driverPct}%)
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
