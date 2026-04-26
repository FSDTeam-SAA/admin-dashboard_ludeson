"use client";

import { useParams, useRouter } from "next/navigation";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { EmptyState } from "@/components/shared/empty-state";
import { ProfileAvatar } from "@/components/shared/profile-avatar";
import { StatusPill } from "@/components/shared/status-pill";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { blockPassenger, getPassengerDetail, toApiError } from "@/lib/api";
import { formatCurrency, formatDate, getFullName } from "@/lib/utils";

function InfoField({ label, value }: { label: string; value: string }) {
  return (
    <div className="space-y-2">
      <p className="text-lg font-medium text-[var(--foreground)]">{label}</p>
      <div className="rounded-2xl bg-[var(--soft)] px-4 py-4 text-lg text-[var(--secondary)]">
        {value || "--"}
      </div>
    </div>
  );
}

export default function PassengerDetailPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const queryClient = useQueryClient();

  const passengerQuery = useQuery({
    queryKey: ["passenger", params.id],
    queryFn: () => getPassengerDetail(params.id),
  });

  const blockMutation = useMutation({
    mutationFn: () => blockPassenger(params.id),
    onSuccess: () => {
      toast.success("Passenger blocked successfully.");
      queryClient.invalidateQueries({ queryKey: ["passenger", params.id] });
      queryClient.invalidateQueries({ queryKey: ["passengers"] });
    },
    onError: (error) => toast.error(toApiError(error).message),
  });

  if (passengerQuery.isLoading) {
    return <Skeleton className="h-[640px] rounded-[20px]" />;
  }

  if (!passengerQuery.data) {
    return (
      <EmptyState
        title="Passenger not found"
        description="The selected passenger record is unavailable."
      />
    );
  }

  const passenger = passengerQuery.data;

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-6 rounded-[20px] border border-[var(--border)] bg-white p-6 shadow-sm xl:flex-row xl:items-center xl:justify-between">
        <div className="flex items-center gap-5">
          <ProfileAvatar user={passenger} size="lg" />
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-3">
              <h1 className="text-4xl font-bold text-[var(--foreground)]">
                {getFullName(passenger)}
              </h1>
              <StatusPill value={passenger.status} />
            </div>
            <p className="text-2xl text-[var(--muted-foreground)]">Id:{passenger._id.slice(-6)}</p>
            <p className="text-lg text-[var(--muted-foreground)]">
              Joined {formatDate(passenger.join_date)}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Button variant="secondary" onClick={() => router.push("/passengers")}>
            Back
          </Button>
          {passenger.status !== "blocked" ? (
            <Button
              variant="danger"
              loading={blockMutation.isPending}
              onClick={() => blockMutation.mutate()}
            >
              Block Passenger
            </Button>
          ) : null}
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Contact Information</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-5 md:grid-cols-3">
          <InfoField label="Email" value={passenger.email} />
          <InfoField label="Phone Number" value={passenger.phone_number ?? "--"} />
          <InfoField label="Address" value={passenger.address ?? "--"} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Passenger Stats</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-5 md:grid-cols-3">
          <InfoField label="Total Ride" value={String(passenger.total_rides)} />
          <InfoField label="Total Spent" value={formatCurrency(passenger.total_spent)} />
          <InfoField label="Account Status" value={passenger.status} />
        </CardContent>
      </Card>
    </div>
  );
}
