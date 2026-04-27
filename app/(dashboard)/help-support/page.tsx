"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { EmptyState } from "@/components/shared/empty-state";
import { PaginationControls } from "@/components/shared/pagination-controls";
import { ProfileAvatar } from "@/components/shared/profile-avatar";
import { StatusPill } from "@/components/shared/status-pill";
import { TableSkeleton } from "@/components/shared/table-skeleton";
import { Card } from "@/components/ui/card";
import { getSupportTickets } from "@/lib/api";
import { formatDate, getFullName } from "@/lib/utils";

export default function HelpSupportPage() {
  const [page, setPage] = useState(1);
  const [role, setRole] = useState("all");

  const ticketsQuery = useQuery({
    queryKey: ["support", page, role],
    queryFn: () => getSupportTickets({ page, limit: 10, role }),
    placeholderData: (previous) => previous,
  });

  const tickets = ticketsQuery.data?.tickets ?? [];
  const total = ticketsQuery.data?.total ?? 0;
  const totalPages = ticketsQuery.data?.total_pages ?? 1;
  const start = total ? (page - 1) * 10 + 1 : 0;
  const end = total ? Math.min(page * 10, total) : 0;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <h1 className="text-3xl font-bold tracking-tight text-[var(--foreground)]">
          All Help & Support List
        </h1>
        <select
          value={role}
          onChange={(event) => {
            setPage(1);
            setRole(event.target.value);
          }}
          className="h-12 rounded-2xl border border-[var(--border)] bg-white px-4 text-md font-medium text-[var(--foreground)] shadow-sm outline-none"
        >
          <option value="all">All</option>
          <option value="passenger">Passenger</option>
          <option value="driver">Driver</option>
        </select>
      </div>

      <Card className="overflow-hidden">
        {ticketsQuery.isLoading ? (
          <TableSkeleton columns={6} rows={6} />
        ) : tickets.length ? (
          <div className="overflow-x-auto">
            <table className="table-grid min-w-full">
              <thead className="border-b border-[var(--border)] text-left">
                <tr className="text-md font-medium text-[var(--muted-foreground)]">
                  <th className="px-6 py-5">User Name</th>
                  <th className="px-6 py-5">Contact Information</th>
                  <th className="px-6 py-5">Role</th>
                  <th className="px-6 py-5">Date</th>
                  <th className="px-6 py-5">Subject</th>
                  <th className="px-6 py-5">Description</th>
                </tr>
              </thead>
              <tbody>
                {tickets.map((ticket) => (
                  <tr
                    key={ticket._id}
                    className="border-b border-[var(--border)] last:border-b-0"
                  >
                    <td className="px-6 py-6">
                      <div className="flex items-center gap-4">
                        <ProfileAvatar user={ticket.user_id} />
                        <div>
                          <p className="text-xl font-semibold text-[var(--foreground)]">
                            {getFullName(ticket.user_id)}
                          </p>
                          <p className="text-md text-[var(--muted-foreground)]">
                            ID: {ticket.user_id._id.slice(-6)}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-6 text-md text-[var(--muted-foreground)]">
                      <p>{ticket.user_id.email}</p>
                      <p>{ticket.user_id.phone_number ?? "--"}</p>
                    </td>
                    <td className="px-6 py-6">
                      <StatusPill value={ticket.role} className="min-w-28" />
                    </td>
                    <td className="px-6 py-6 text-md text-[var(--muted-foreground)]">
                      {formatDate(ticket.createdAt, true)}
                    </td>
                    <td className="px-6 py-6 text-md font-medium text-[var(--foreground)]">
                      {ticket.subject}
                    </td>
                    <td className="px-6 py-6 text-md text-[var(--muted-foreground)]">
                      <p className="max-w-[380px] leading-7">
                        {ticket.description}
                      </p>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-6">
            <EmptyState
              title="No support tickets found"
              description="Support requests will appear here once users submit them."
            />
          </div>
        )}
      </Card>

      <div className="flex flex-col justify-between gap-4 text-md text-[var(--muted-foreground)] sm:flex-row sm:items-center">
        <p>
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
