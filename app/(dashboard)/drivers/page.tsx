"use client";

import Link from "next/link";
import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Check, ChevronDown, MoreVertical, X } from "lucide-react";
import { toast } from "sonner";
import { EmptyState } from "@/components/shared/empty-state";
import { PaginationControls } from "@/components/shared/pagination-controls";
import { StatusPill } from "@/components/shared/status-pill";
import { TableSkeleton } from "@/components/shared/table-skeleton";
import { Card } from "@/components/ui/card";
import { approveDriver, getDrivers, rejectDriver, toApiError } from "@/lib/api";
import { formatCurrency, formatDaysSince, getFullName } from "@/lib/utils";

const driverStatusOptions = [
  { value: "all", label: "All" },
  { value: "pending", label: "Pending" },
  { value: "active", label: "Active" },
  { value: "inactive", label: "Inactive" },
  { value: "blocked", label: "Blocked" },
];

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
    <div className="space-y-8">
      <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
        <h1 className="text-[2.1rem] leading-none font-semibold tracking-[-0.04em] text-[#111827]">
          All Driver List
        </h1>
        <div className="relative w-full max-w-[104px] shrink-0">
          <select
            value={status}
            onChange={(event) => {
              setPage(1);
              setStatus(event.target.value);
            }}
            className="h-[42px] w-full appearance-none rounded-[12px] border border-[#ddd6cb] bg-white pl-4 pr-10 text-[15px] font-normal text-[#555b67] outline-none"
          >
            {driverStatusOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <ChevronDown className="pointer-events-none absolute top-1/2 right-4 size-4 -translate-y-1/2 text-[#9ca3af]" />
        </div>
      </div>

      <Card className="overflow-hidden rounded-[12px] border border-[#e4ddd2] bg-white shadow-none">
        {driversQuery.isLoading ? (
          <TableSkeleton columns={7} rows={6} />
        ) : drivers.length ? (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-left">
              <thead className="border-b border-[#e8e1d7] bg-white">
                <tr className="text-[15px] leading-[1.2] font-normal text-[#787d88]">
                  <th className="w-[210px] px-8 py-5">Driver Name</th>
                  <th className="w-[250px] px-8 py-5">Contact Information</th>
                  <th className="w-[150px] px-8 py-5">Status</th>
                  <th className="w-[130px] px-8 py-5 text-center">Total Days</th>
                  <th className="w-[120px] px-8 py-5 text-center">Total Ride</th>
                  <th className="w-[150px] px-8 py-5 text-center">Total Amount</th>
                  <th className="w-[160px] px-8 py-5 text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {drivers.map((driver) => (
                  <tr
                    key={driver._id}
                    className="border-b border-[#e8e1d7] last:border-b-0"
                  >
                    <td className="px-8 py-[18px] align-middle">
                      <div className="space-y-[10px]">
                        <p className="text-[15px] leading-[1.2] font-medium text-[#111827]">
                          {getFullName(driver.user_id)}
                        </p>
                        <p className="text-[14px] leading-[1.2] text-[#767c88]">
                          ID: {driver.user_id._id.slice(-6)}
                        </p>
                      </div>
                    </td>
                    <td className="px-8 py-[18px] align-middle text-[14px] leading-[1.2] text-[#767c88]">
                      <p>{driver.user_id.email}</p>
                      <p className="mt-[10px]">{driver.user_id.phone_number ?? "--"}</p>
                    </td>
                    <td className="px-8 py-[18px] align-middle">
                      <StatusPill value={driver.approval_status} />
                    </td>
                    <td className="px-8 py-[18px] text-center align-middle text-[14px] leading-[1.2] text-[#767c88]">
                      {formatDaysSince(driver.createdAt)}
                    </td>
                    <td className="px-8 py-[18px] text-center align-middle text-[14px] leading-[1.2] text-[#767c88]">
                      {driver.total_rides}
                    </td>
                    <td className="px-8 py-[18px] text-center align-middle text-[14px] leading-[1.2] text-[#767c88]">
                      {formatCurrency(driver.total_earnings)}
                    </td>
                    <td className="px-8 py-[18px] align-middle">
                      <div className="flex items-center justify-center gap-2 text-[#111827]">
                        {driver.can_approve ? (
                          <>
                            <button
                              type="button"
                              onClick={() => approveMutation.mutate(driver._id)}
                              className="inline-flex size-8 items-center justify-center text-[#21c55d]"
                              aria-label="Approve driver"
                              disabled={approveMutation.isPending || rejectMutation.isPending}
                            >
                              <Check className="size-5" strokeWidth={2.2} />
                            </button>
                            <button
                              type="button"
                              onClick={() => rejectMutation.mutate(driver._id)}
                              className="inline-flex size-8 items-center justify-center text-[#ff4d4f]"
                              aria-label="Reject driver"
                              disabled={approveMutation.isPending || rejectMutation.isPending}
                            >
                              <X className="size-5" strokeWidth={2.2} />
                            </button>
                          </>
                        ) : null}
                        <Link
                          href={`/drivers/${driver._id}`}
                          className="inline-flex size-8 items-center justify-center text-[#111827]"
                          aria-label="View driver details"
                        >
                          <MoreVertical className="size-5" strokeWidth={2.2} />
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

      <div className="flex flex-col justify-between gap-4 pt-1 text-[17px] leading-[1.2] text-[#8b9099] sm:flex-row sm:items-center">
        <p className="font-normal">
          Showing {start} to {end} of {total} results
        </p>
        <PaginationControls
          page={page}
          totalPages={totalPages}
          onPageChange={setPage}
        />
      </div>
    </div>
  );
}
