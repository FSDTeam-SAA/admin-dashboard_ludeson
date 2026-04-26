"use client";

import Link from "next/link";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { EmptyState } from "@/components/shared/empty-state";
import { PaginationControls } from "@/components/shared/pagination-controls";
import { ProfileAvatar } from "@/components/shared/profile-avatar";
import { StatusPill } from "@/components/shared/status-pill";
import { TableSkeleton } from "@/components/shared/table-skeleton";
import { Card } from "@/components/ui/card";
import { getPassengers } from "@/lib/api";
import { formatCurrency, formatDaysSince, getFullName } from "@/lib/utils";

export default function PassengersPage() {
  const [page, setPage] = useState(1);
  const [status, setStatus] = useState("all");

  const passengersQuery = useQuery({
    queryKey: ["passengers", page, status],
    queryFn: () => getPassengers({ page, limit: 10, status }),
    placeholderData: (previous) => previous,
  });

  const passengers = passengersQuery.data?.passengers ?? [];
  const total = passengersQuery.data?.total ?? 0;
  const totalPages = passengersQuery.data?.total_pages ?? 1;
  const start = total ? (page - 1) * 10 + 1 : 0;
  const end = total ? Math.min(page * 10, total) : 0;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <h1 className="text-4xl font-bold tracking-tight text-[var(--foreground)]">
          All Passengers List
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
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
          <option value="blocked">Blocked</option>
        </select>
      </div>

      <Card className="overflow-hidden">
        {passengersQuery.isLoading ? (
          <TableSkeleton columns={7} rows={6} />
        ) : passengers.length ? (
          <div className="overflow-x-auto">
            <table className="table-grid min-w-full">
              <thead className="border-b border-[var(--border)] text-left">
                <tr className="text-lg font-medium text-[var(--muted-foreground)]">
                  <th className="px-6 py-5">Passenger Name</th>
                  <th className="px-6 py-5">Contact Information</th>
                  <th className="px-6 py-5">Status</th>
                  <th className="px-6 py-5">Total Days</th>
                  <th className="px-6 py-5">Total Ride</th>
                  <th className="px-6 py-5">Total Amount</th>
                  <th className="px-6 py-5">Actions</th>
                </tr>
              </thead>
              <tbody>
                {passengers.map((passenger) => (
                  <tr key={passenger._id} className="border-b border-[var(--border)] last:border-b-0">
                    <td className="px-6 py-6">
                      <div className="flex items-center gap-4">
                        <ProfileAvatar user={passenger} />
                        <div>
                          <p className="text-2xl font-semibold text-[var(--foreground)]">
                            {getFullName(passenger)}
                          </p>
                          <p className="text-lg text-[var(--muted-foreground)]">
                            ID: {passenger._id.slice(-6)}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-6 text-lg text-[var(--muted-foreground)]">
                      <p>{passenger.email}</p>
                      <p>{passenger.phone_number ?? "--"}</p>
                    </td>
                    <td className="px-6 py-6">
                      <StatusPill value={passenger.status} />
                    </td>
                    <td className="px-6 py-6 text-lg text-[var(--muted-foreground)]">
                      {formatDaysSince(passenger.createdAt)}
                    </td>
                    <td className="px-6 py-6 text-lg text-[var(--muted-foreground)]">
                      {passenger.total_rides}
                    </td>
                    <td className="px-6 py-6 text-lg text-[var(--muted-foreground)]">
                      {formatCurrency(passenger.total_amount)}
                    </td>
                    <td className="px-6 py-6">
                      <Link
                        href={`/passengers/${passenger._id}`}
                        className="text-base font-semibold text-[var(--primary)]"
                      >
                        View details
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
              title="No passengers found"
              description="Adjust the filter or wait for new passengers to appear."
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
