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
import {
  approveDriver,
  blockDriver,
  getDriverDetail,
  rejectDriver,
  toApiError,
} from "@/lib/api";
import { formatDate, getFullName } from "@/lib/utils";

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

function DocumentPreview({
  label,
  image,
}: {
  label: string;
  image?: string;
}) {
  return (
    <div className="space-y-3">
      <p className="text-lg font-medium text-[var(--foreground)]">{label}</p>
      <div className="overflow-hidden rounded-3xl border border-[var(--border)] bg-[#f8fbff]">
        {image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={image} alt={label} className="h-[280px] w-full object-cover" />
        ) : (
          <div className="flex h-[280px] items-center justify-center text-sm text-[var(--muted-foreground)]">
            No document uploaded
          </div>
        )}
      </div>
    </div>
  );
}

export default function DriverDetailPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const queryClient = useQueryClient();

  const driverQuery = useQuery({
    queryKey: ["driver", params.id],
    queryFn: () => getDriverDetail(params.id),
  });

  const approveMutation = useMutation({
    mutationFn: () => approveDriver(params.id),
    onSuccess: () => {
      toast.success("Driver approved.");
      queryClient.invalidateQueries({ queryKey: ["driver", params.id] });
      queryClient.invalidateQueries({ queryKey: ["drivers"] });
    },
    onError: (error) => toast.error(toApiError(error).message),
  });

  const rejectMutation = useMutation({
    mutationFn: () => rejectDriver(params.id),
    onSuccess: () => {
      toast.success("Driver rejected.");
      queryClient.invalidateQueries({ queryKey: ["driver", params.id] });
      queryClient.invalidateQueries({ queryKey: ["drivers"] });
    },
    onError: (error) => toast.error(toApiError(error).message),
  });

  const blockMutation = useMutation({
    mutationFn: () => blockDriver(params.id),
    onSuccess: () => {
      toast.success("Driver blocked.");
      queryClient.invalidateQueries({ queryKey: ["driver", params.id] });
      queryClient.invalidateQueries({ queryKey: ["drivers"] });
    },
    onError: (error) => toast.error(toApiError(error).message),
  });

  if (driverQuery.isLoading) {
    return <Skeleton className="h-[980px] rounded-[20px]" />;
  }

  if (!driverQuery.data) {
    return (
      <EmptyState
        title="Driver not found"
        description="The selected driver record is unavailable."
      />
    );
  }

  const driver = driverQuery.data;

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-6 rounded-[20px] border border-[var(--border)] bg-white p-6 shadow-sm xl:flex-row xl:items-center xl:justify-between">
        <div className="flex items-center gap-5">
          <ProfileAvatar user={driver.user} size="lg" />
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-3">
              <h1 className="text-4xl font-bold text-[var(--foreground)]">
                {getFullName(driver.user)}
              </h1>
              <StatusPill value={driver.approval_status} />
            </div>
            <p className="text-2xl text-[var(--muted-foreground)]">Id:{driver.user._id.slice(-6)}</p>
            <p className="text-lg text-[var(--muted-foreground)]">
              Joined {formatDate(driver.createdAt)}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <Button variant="secondary" onClick={() => router.push("/drivers")}>
            Back
          </Button>
          {driver.approval_status === "pending" ? (
            <>
              <Button loading={approveMutation.isPending} onClick={() => approveMutation.mutate()}>
                Accept
              </Button>
              <Button
                variant="danger"
                loading={rejectMutation.isPending}
                onClick={() => rejectMutation.mutate()}
              >
                Decline
              </Button>
            </>
          ) : null}
          {driver.approval_status !== "blocked" ? (
            <Button
              variant="outline"
              loading={blockMutation.isPending}
              onClick={() => blockMutation.mutate()}
            >
              Block Driver
            </Button>
          ) : null}
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Contact Information</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-5 md:grid-cols-3">
          <InfoField label="Email" value={driver.user.email} />
          <InfoField label="Phone Number" value={driver.user.phone_number ?? "--"} />
          <InfoField label="Address" value={driver.user.address ?? "--"} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Vehicle Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-5">
          <div className="grid gap-5 md:grid-cols-3">
            <InfoField label="Vehicle Brand Name" value={driver.vehicle_brand_name} />
            <InfoField label="Vehicle Model Name" value={driver.vehicle_model_name} />
            <InfoField label="Vehicle Color" value={driver.vehicle_color} />
            <InfoField label="Vehicle Plate Number" value={driver.vehicle_plate_number} />
            <InfoField label="Vehicle Year" value={driver.vehicle_year} />
            <InfoField label="Status" value={driver.approval_status} />
          </div>

          <div className="grid gap-5 lg:grid-cols-3">
            <DocumentPreview label="Vehicle Image" image={driver.documents.vehicle_image_url} />
            <DocumentPreview label="Passport" image={driver.documents.passport_image_url} />
            <DocumentPreview
              label="Insurance Card"
              image={driver.documents.insurance_card_url}
            />
            <DocumentPreview
              label="Driving License Front"
              image={driver.documents.driving_license_front_url}
            />
            <DocumentPreview
              label="Driving License Back"
              image={driver.documents.driving_license_back_url}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
