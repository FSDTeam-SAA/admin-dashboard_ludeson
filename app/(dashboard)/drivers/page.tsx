"use client";

import Link from "next/link";
import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Check, X } from "lucide-react";
import { toast } from "sonner";
import { EmptyState } from "@/components/shared/empty-state";
import { PaginationControls } from "@/components/shared/pagination-controls";
import { ProfileAvatar } from "@/components/shared/profile-avatar";
import { StatusPill } from "@/components/shared/status-pill";
import { TableSkeleton } from "@/components/shared/table-skeleton";
import { Card } from "@/components/ui/card";
import { approveDriver, getDrivers, rejectDriver, toApiError } from "@/lib/api";
import { formatCurrency, formatDaysSince, getFullName } from "@/lib/utils";

export default function DriversPage() {
  const queryClient = useQueryClient();
  const [page, setPage] = useState(1);
  const [status, setStatus] = useState("all");

  const driversQuery = useQuery({
    queryKey: ["drivers", page, status],
    queryFn: () => getDrivers({ page, limit: 10, status }),
    placeholderData: (previous) => previous,
  });

  const approveMutation = useMutation({
    mutationFn: approveDriver,
    onSuccess: () => {
      toast.success("Driver approved.");
      queryClient.invalidateQueries({ queryKey: ["drivers"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard"] });
    },
    onError: (error) => toast.error(toApiError(error).message),
  });

  const rejectMutation = useMutation({
    mutationFn: rejectDriver,
    onSuccess: () => {
      toast.success("Driver rejected.");
      queryClient.invalidateQueries({ queryKey: ["drivers"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard"] });
    },
    onError: (error) => toast.error(toApiError(error).message),
  });

  const drivers = driversQuery.data?.drivers ?? [];
  const total = driversQuery.data?.total ?? 0;
  const totalPages = driversQuery.data?.total_pages ?? 1;
  const start = total ? (page - 1) * 10 + 1 : 0;
  const end = total ? Math.min(page * 10, total) : 0;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <h1 className="text-4xl font-bold tracking-tight text-[var(--foreground)]">
          All Driver List
        </h1>
        <select
          value={status}
          onChange={(event) => {
            setPage(1);
            setStatus(event.target.value);
          }}
          className="h-12 rounded-2xl border border-[var(--border)] bg-white px-4 text-lg font-medium text-[var(--foreground)] shadow-sm outline-none"
        >
          <option value="all">All</option>
          <option value="pending">Pending</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
          <option value="blocked">Blocked</option>
        </select>
      </div>

      <Card className="overflow-hidden">
        {driversQuery.isLoading ? (
          <TableSkeleton columns={7} rows={6} />
        ) : drivers.length ? (
          <div className="overflow-x-auto">
            <table className="table-grid min-w-full">
              <thead className="border-b border-[var(--border)] text-left">
                <tr className="text-lg font-medium text-[var(--muted-foreground)]">
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
                {drivers.map((driver) => (
                  <tr key={driver._id} className="border-b border-[var(--border)] last:border-b-0">
                    <td className="px-6 py-6">
                      <div className="flex items-center gap-4">
                        <ProfileAvatar user={driver.user_id} />
                        <div>
                          <p className="text-2xl font-semibold text-[var(--foreground)]">
                            {getFullName(driver.user_id)}
                          </p>
                          <p className="text-lg text-[var(--muted-foreground)]">
                            ID: {driver.user_id._id.slice(-6)}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-6 text-lg text-[var(--muted-foreground)]">
                      <p>{driver.user_id.email}</p>
                      <p>{driver.user_id.phone_number ?? "--"}</p>
                    </td>
                    <td className="px-6 py-6">
                      <StatusPill value={driver.approval_status} />
                    </td>
                    <td className="px-6 py-6 text-lg text-[var(--muted-foreground)]">
                      {formatDaysSince(driver.createdAt)}
                    </td>
                    <td className="px-6 py-6 text-lg text-[var(--muted-foreground)]">
                      {driver.total_rides}
                    </td>
                    <td className="px-6 py-6 text-lg text-[var(--muted-foreground)]">
                      {formatCurrency(driver.total_earnings)}
                    </td>
                    <td className="px-6 py-6">
                      <div className="flex items-center gap-3">
                        {driver.can_approve ? (
                          <>
                            <button
                              type="button"
                              onClick={() => approveMutation.mutate(driver._id)}
                              className="text-[var(--success)]"
                              aria-label="Approve driver"
                            >
                              <Check className="size-5" />
                            </button>
                            <button
                              type="button"
                              onClick={() => rejectMutation.mutate(driver._id)}
                              className="text-[var(--danger)]"
                              aria-label="Reject driver"
                            >
                              <X className="size-5" />
                            </button>
                          </>
                        ) : null}
                        <Link
                          href={`/drivers/${driver._id}`}
                          className="text-base font-semibold text-[var(--primary)]"
                        >
                          View details
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-6">
            <EmptyState
              title="No drivers found"
              description="Adjust the filter or wait for new driver applications."
            />
          </div>
        )}
      </Card>

      <div className="flex flex-col justify-between gap-4 text-lg text-[var(--muted-foreground)] sm:flex-row sm:items-center">
        <p>
          Showing {start} to {end} of {total} results
        </p>
        <PaginationControls page={page} totalPages={totalPages} onPageChange={setPage} />
      </div>
    </div>
  );
}
