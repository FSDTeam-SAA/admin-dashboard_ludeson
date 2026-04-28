"use client";

import Link from "next/link";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { CalendarDays, CarFront, DollarSign, MoreVertical, PiggyBank, Users } from "lucide-react";
import { MetricCard } from "@/components/dashboard/metric-card";
import { TopDriversChart } from "@/components/dashboard/top-drivers-chart";
import { UserStatusChart } from "@/components/dashboard/user-status-chart";
import { EmptyState } from "@/components/shared/empty-state";
import { ProfileAvatar } from "@/components/shared/profile-avatar";
import { StatusPill } from "@/components/shared/status-pill";
import { TableSkeleton } from "@/components/shared/table-skeleton";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { getDashboardSummary, getNewDrivers, getTopDrivers, getUserStatus } from "@/lib/api";
import { formatCurrency, formatDaysSince, getFullName } from "@/lib/utils";
import type { DashboardPeriod } from "@/types";

const periodOptions: Array<{ value: DashboardPeriod; label: string; changeLabel: string }> = [
  { value: "month", label: "This month", changeLabel: "last month" },
  { value: "3month", label: "3 Month", changeLabel: "last 3 months" },
  { value: "6month", label: "6 Month", changeLabel: "last 6 months" },
  { value: "custom", label: "Custom", changeLabel: "previous period" },
];

export default function DashboardPage() {
  const [period, setPeriod] = useState<DashboardPeriod>("month");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const dateRange = { startDate, endDate };

  const summaryQuery = useQuery({
    queryKey: ["dashboard", "summary", period, startDate, endDate],
    queryFn: () => getDashboardSummary(period, dateRange),
    placeholderData: (previous) => previous,
  });

  const userStatusQuery = useQuery({
    queryKey: ["dashboard", "user-status"],
    queryFn: getUserStatus,
  });

  const topDriversQuery = useQuery({
    queryKey: ["dashboard", "top-drivers", period, startDate, endDate],
    queryFn: () => getTopDrivers(period, dateRange),
    placeholderData: (previous) => previous,
  });

  const newDriversQuery = useQuery({
    queryKey: ["dashboard", "new-drivers"],
    queryFn: getNewDrivers,
  });

  const summary = summaryQuery.data;
  const changeLabel = periodOptions.find((o) => o.value === period)?.changeLabel ?? "last month";

  return (
    <div className="space-y-8">
      <div className="flex flex-col justify-between gap-4 xl:flex-row xl:items-center">
        <div className="inline-flex flex-wrap items-center gap-2 rounded-2xl border border-[var(--border)] bg-white p-2 shadow-sm">
          {periodOptions.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => setPeriod(option.value)}
              className={
                option.value === period
                  ? "rounded-xl bg-[var(--secondary)] px-5 py-3 text-[16px] leading-[1.2] font-medium text-white"
                  : "rounded-xl px-5 py-3 text-[16px] leading-[1.2] font-normal text-[var(--muted-foreground)] hover:bg-[var(--soft)]"
              }
            >
              {option.label}
            </button>
          ))}
          <CalendarDays className="mx-3 hidden size-5 text-[var(--muted-foreground)] sm:block" />
        </div>

        {period === "custom" ? (
          <div className="flex flex-col gap-3 sm:flex-row">
            <input
              type="date"
              value={startDate}
              onChange={(event) => setStartDate(event.target.value)}
              className="h-11 rounded-xl border border-[var(--border)] bg-white px-4 text-[14px] leading-[1.2] font-normal shadow-sm outline-none"
            />
            <input
              type="date"
              value={endDate}
              onChange={(event) => setEndDate(event.target.value)}
              className="h-11 rounded-xl border border-[var(--border)] bg-white px-4 text-[14px] leading-[1.2] font-normal shadow-sm outline-none"
            />
          </div>
        ) : null}
      </div>

      {summaryQuery.isLoading && !summary ? (
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-5">
          {Array.from({ length: 5 }).map((_, index) => (
            <Skeleton key={index} className="h-[180px] rounded-[20px]" />
          ))}
        </div>
      ) : summary ? (
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-5">
          <MetricCard
            title="Total Active Passenger"
            value={summary.total_active_passengers.value.toString()}
            change={summary.total_active_passengers.change_pct}
            icon={Users}
            periodLabel={changeLabel}
          />
          <MetricCard
            title="Total Active Driver"
            value={summary.total_active_drivers.value.toString()}
            change={summary.total_active_drivers.change_pct}
            icon={CarFront}
            periodLabel={changeLabel}
          />
          <MetricCard
            title="Drivers Total Earning"
            value={formatCurrency(summary.drivers_total_earning.value)}
            change={summary.drivers_total_earning.change_pct}
            icon={DollarSign}
            periodLabel={changeLabel}
          />
          <MetricCard
            title="Your Total Earning"
            value={formatCurrency(summary.your_total_earning.value)}
            change={summary.your_total_earning.change_pct}
            icon={PiggyBank}
            periodLabel={changeLabel}
          />
          <MetricCard
            title="Total Ride Completed"
            value={summary.total_ride_completed.value.toString()}
            change={summary.total_ride_completed.change_pct}
            icon={CarFront}
            periodLabel={changeLabel}
          />
        </div>
      ) : (
        <EmptyState
          title="Dashboard metrics are unavailable"
          description="The summary endpoint did not return any metrics."
        />
      )}

      <div className="grid gap-5 xl:grid-cols-[420px_minmax(0,1fr)]">
        {userStatusQuery.isLoading ? (
          <Skeleton className="h-[400px] rounded-[20px]" />
        ) : (
          <UserStatusChart data={userStatusQuery.data ?? { passengers_count: 0, drivers_count: 0, passengers_pct: "0", drivers_pct: "0" }} />
        )}

        {topDriversQuery.isLoading ? (
          <Skeleton className="h-[400px] rounded-[20px]" />
        ) : (
          <TopDriversChart drivers={topDriversQuery.data?.top_drivers ?? []} />
        )}
      </div>

      <section className="space-y-4">
        <div className="flex items-center justify-between gap-4">
          <h2 className="text-[16px] leading-[1.2] font-medium text-[var(--foreground)]">
            New added Drivers
          </h2>
          <Link href="/drivers" className="text-[14px] leading-[1.2] font-normal text-[var(--secondary)]">
            See all drivers
          </Link>
        </div>

        <Card className="overflow-hidden">
          {newDriversQuery.isLoading ? (
            <TableSkeleton columns={7} rows={4} />
          ) : newDriversQuery.data?.drivers?.length ? (
            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-left">
                <thead className="border-b border-[var(--border)] bg-white">
                  <tr className="text-[16px] leading-[1.2] font-normal text-[var(--muted-foreground)]">
                    <th className="px-6 py-5">Driver Name</th>
                    <th className="px-6 py-5">Contact Information</th>
                    <th className="px-6 py-5">Status</th>
                    <th className="px-6 py-5">Total Days</th>
                    <th className="px-6 py-5">Total Ride</th>
                    <th className="px-6 py-5">Total Amount</th>
                    <th className="px-6 py-5">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {newDriversQuery.data.drivers.map((driver) => (
                    <tr key={driver._id} className="border-b border-[var(--border)] last:border-b-0">
                      <td className="px-6 py-6">
                        <div className="flex items-center gap-4">
                          <ProfileAvatar user={driver.user_id} />
                          <div>
                            <p className="text-[16px] leading-[1.2] font-medium text-[var(--foreground)]">
                              {getFullName(driver.user_id)}
                            </p>
                            <p className="text-[14px] leading-[1.2] font-normal text-[var(--muted-foreground)]">
                              ID: {driver.user_id._id.slice(-6)}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-6 text-[14px] leading-[1.2] font-normal text-[var(--muted-foreground)]">
                        <p>{driver.user_id.email}</p>
                        <p>{driver.user_id.phone_number ?? "--"}</p>
                      </td>
                      <td className="px-6 py-6">
                        <StatusPill value={driver.approval_status} />
                      </td>
                      <td className="px-6 py-6 text-[14px] leading-[1.2] font-normal text-[var(--muted-foreground)]">
                        {formatDaysSince(driver.createdAt)}
                      </td>
                      <td className="px-6 py-6 text-[14px] leading-[1.2] font-normal text-[var(--muted-foreground)]">
                        {driver.total_rides}
                      </td>
                      <td className="px-6 py-6 text-[14px] leading-[1.2] font-normal text-[var(--muted-foreground)]">
                        {formatCurrency(driver.total_earnings)}
                      </td>
                      <td className="px-6 py-6">
                        <Link
                          href={`/drivers/${driver._id}`}
                          className="inline-flex size-9 items-center justify-center rounded-full text-[var(--muted-foreground)] hover:bg-[var(--soft)] hover:text-[var(--foreground)]"
                          aria-label="View driver details"
                        >
                          <MoreVertical className="size-5" />
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="p-6">
              <EmptyState
                title="No recent drivers"
                description="Driver records will show up here when new applications arrive."
              />
            </div>
          )}
        </Card>
      </section>
    </div>
  );
}
